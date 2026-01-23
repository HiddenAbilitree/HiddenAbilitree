import { codeFiles, db, eq, indexerMetadata, projects } from 'db';

import type { Config } from '@/src/config';
import type { EmbeddingProvider } from '@/src/embeddings';
import type { GitHubRepo } from '@/src/github/types';
import type { QdrantWrapper } from '@/src/vectors/qdrant';

import { isCodeFile } from '@/src/github/client';
import {
  createGitHubGraphQLClient,
  GitHubApiError,
  type GitHubGraphQLClient,
} from '@/src/github/graphql-client';
import { type KeyFile, summarizeRepo } from '@/src/summarizer/cerebras';

const KEY_FILE_PATTERNS = [
  /^readme\.md$/i,
  /^package\.json$/,
  /^cargo\.toml$/,
  /^pyproject\.toml$/,
  /^src\/index\.[tj]sx?$/,
  /^src\/main\.[tj]sx?$/,
  /^src\/app\.[tj]sx?$/,
  /^app\/page\.[tj]sx?$/,
  /^app\/layout\.[tj]sx?$/,
  /^lib\/.*\.[tj]sx?$/,
  /^src\/lib\/.*\.[tj]sx?$/,
];

const isKeyFile = (path: string): boolean =>
  KEY_FILE_PATTERNS.some((pattern) => pattern.test(path));

type IndexResult =
  | { error: string; status: `error` }
  | { status: `indexed` }
  | { status: `skipped` };

const indexRepo = async (
  repo: GitHubRepo,
  github: GitHubGraphQLClient,
  provider: EmbeddingProvider,
  qdrant: QdrantWrapper,
  username: string,
  options: { force: boolean; summariesOnly: boolean },
): Promise<IndexResult> => {
  try {
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.id, repo.id))
      .then((rows) => rows[0]);

    const currentSha = await github.getDefaultBranchSha(
      repo.full_name,
      repo.default_branch,
    );

    if (!options.force && existing?.last_indexed_sha === currentSha) {
      console.log(`Skipping ${repo.full_name} (unchanged)`);
      return { status: `skipped` };
    }

    console.log(`Indexing ${repo.full_name}...`);

    const commitCount = await github.getCommitCount(repo.full_name);
    const tree = await github.getTree(repo.full_name, currentSha);
    const codeFilePaths = tree.tree
      .filter((item) => item.type === `blob` && isCodeFile(item.path))
      .map((item) => item.path);

    console.log(
      `  [${repo.full_name}] Found ${codeFilePaths.length} code files`,
    );

    let keyFilePaths = tree.tree
      .filter((item) => item.type === `blob` && isKeyFile(item.path))
      .map((item) => item.path)
      .slice(0, 5);

    if (keyFilePaths.length === 0 && codeFilePaths.length > 0) {
      keyFilePaths = codeFilePaths.slice(0, 3);
    }

    const keyFileContents = await github.getFileContents(
      repo.full_name,
      keyFilePaths,
    );
    const keyFiles: KeyFile[] = keyFilePaths.flatMap((path) => {
      const content = keyFileContents.get(path);
      return content === undefined ? [] : [{ content, path }];
    });

    const summary = await summarizeRepo(
      repo.full_name,
      repo.description ?? undefined,
      repo.language ?? undefined,
      repo.topics,
      codeFilePaths,
      keyFiles,
    );

    const isOwner = repo.owner.login.toLowerCase() === username.toLowerCase();
    const isFork = repo.fork;

    console.log(
      `  [${repo.full_name}] Summary: ${summary.summary.slice(0, 100)}...`,
    );
    console.log(`  [${repo.full_name}] Tags: ${summary.tags.join(`, `)}`);

    await db
      .insert(projects)
      .values({
        ai_summary: summary.summary,
        ai_tags: summary.tags,
        commit_count: commitCount,
        created_at: new Date(repo.created_at),
        description: repo.description,
        full_name: repo.full_name,
        html_url: repo.html_url,
        id: repo.id,
        is_fork: isFork,
        is_owner: isOwner,
        language: repo.language,
        last_indexed_at: new Date(),
        last_indexed_sha: currentSha,
        owner_login: repo.owner.login,
        pushed_at: new Date(repo.pushed_at),
        stargazers_count: repo.stargazers_count,
        topics: repo.topics,
        updated_at: new Date(repo.updated_at),
      })
      .onConflictDoUpdate({
        set: {
          ai_summary: summary.summary,
          ai_tags: summary.tags,
          commit_count: commitCount,
          created_at: new Date(repo.created_at),
          description: repo.description,
          full_name: repo.full_name,
          html_url: repo.html_url,
          is_fork: isFork,
          is_owner: isOwner,
          language: repo.language,
          last_indexed_at: new Date(),
          last_indexed_sha: currentSha,
          owner_login: repo.owner.login,
          pushed_at: new Date(repo.pushed_at),
          stargazers_count: repo.stargazers_count,
          topics: repo.topics,
          updated_at: new Date(repo.updated_at),
        },
        target: projects.id,
      });

    if (!options.summariesOnly) {
      await qdrant.deleteCodeByProjectId(repo.id);
      await db.delete(codeFiles).where(eq(codeFiles.project_id, repo.id));

      const BATCH_SIZE = 100;
      const batches = Array.from(
        { length: Math.ceil(codeFilePaths.length / BATCH_SIZE) },
        (_, i) => codeFilePaths.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE),
      );

      let completedBatches = 0;
      const totalBatches = batches.length;

      await Promise.all(
        batches.map(async (batchPaths) => {
          const fileContents = await github.getFileContents(
            repo.full_name,
            batchPaths,
          );

          const batchFiles = batchPaths.flatMap((path) => {
            const content = fileContents.get(path);
            return content === undefined ?
                []
              : [{ content, ext: path.slice(path.lastIndexOf(`.`) + 1), path }];
          });

          if (batchFiles.length === 0) return;

          const inserted = await db
            .insert(codeFiles)
            .values(
              batchFiles.map((f) => ({
                content: f.content,
                language: f.ext,
                path: f.path,
                project_id: repo.id,
              })),
            )
            .returning({ id: codeFiles.id });

          const embedTexts = batchFiles.map(
            (f) => `File: ${f.path}\n\n${f.content.slice(0, 8000)}`,
          );
          const vectors = await provider.embedBatch(embedTexts);

          await Promise.all(
            inserted.map((row, idx) =>
              qdrant.upsertCodeFile(
                row.id,
                repo.id,
                batchFiles[idx].ext,
                vectors[idx],
              ),
            ),
          );

          completedBatches++;
          console.log(
            `  [${repo.full_name}] Indexed batch ${completedBatches}/${totalBatches}`,
          );
        }),
      );

      console.log(
        `  [${repo.full_name}] Indexed ${codeFilePaths.length} files`,
      );
    }

    return { status: `indexed` };
  } catch (error) {
    const errorMsg =
      error instanceof GitHubApiError ? error.message
      : error instanceof Error ? error.message
      : String(error);
    console.error(`  [${repo.full_name}] Error: ${errorMsg}`);
    return { error: errorMsg, status: `error` };
  }
};

export const runIndexPipeline = async (
  config: Config,
  provider: EmbeddingProvider,
  qdrant: QdrantWrapper,
  options: {
    force: boolean;
    recreateCollection: boolean;
    singleRepo?: string;
    summariesOnly: boolean;
  },
): Promise<void> => {
  const github = createGitHubGraphQLClient(
    config.github.pat,
    config.github.username,
    { maxConcurrent: 50 },
  );

  if (options.recreateCollection) {
    await qdrant.recreateCollection(provider.dimensions);
  }

  await qdrant.ensureCollection(provider);

  const storedProvider = await db
    .select()
    .from(indexerMetadata)
    .where(eq(indexerMetadata.key, `embedding_provider`))
    .then((rows) => rows[0]?.value);

  if (
    storedProvider &&
    storedProvider !== provider.name &&
    !options.recreateCollection
  ) {
    throw new Error(
      `Embedding provider changed! Stored: ${storedProvider}, Current: ${provider.name}. Use --recreate-collection to rebuild with new provider`,
    );
  }

  await db
    .insert(indexerMetadata)
    .values({ key: `embedding_provider`, value: provider.name })
    .onConflictDoUpdate({
      set: { value: provider.name },
      target: indexerMetadata.key,
    });

  console.log(`Using embeddings: ${provider.name}`);

  const repos =
    options.singleRepo ?
      [await github.getRepo(options.singleRepo)]
    : await github.listRepos();

  console.log(`Found ${repos.length} repositories`);

  const results = await Promise.all(
    repos.map((repo) =>
      indexRepo(repo, github, provider, qdrant, config.github.username, {
        force: options.force,
        summariesOnly: options.summariesOnly,
      }),
    ),
  );

  const indexed = results.filter((r) => r.status === `indexed`).length;
  const skipped = results.filter((r) => r.status === `skipped`).length;
  const errors = results.filter((r) => r.status === `error`);

  console.log(
    `\nDone! Indexed: ${indexed}, Skipped: ${skipped}, Errors: ${errors.length}`,
  );

  if (errors.length > 0) {
    console.log(`\nFailed repos:`);
    for (const [i, r] of results.entries()) {
      if (r.status === `error`) {
        console.log(`  - ${repos[i].full_name}: ${r.error}`);
      }
    }
  }

  if (!options.singleRepo) {
    const githubRepoIds = new Set(repos.map((r) => r.id));
    const storedProjects = await db
      .select({ fullName: projects.full_name, id: projects.id })
      .from(projects);
    const staleProjects = storedProjects.filter(
      (p) => !githubRepoIds.has(p.id),
    );

    if (staleProjects.length > 0) {
      console.log(`\nCleaning up ${staleProjects.length} deleted repos...`);
      await Promise.all(
        staleProjects.map(async (stale) => {
          console.log(`  Removing ${stale.fullName}...`);
          await qdrant.deleteCodeByProjectId(stale.id);
          await db.delete(codeFiles).where(eq(codeFiles.project_id, stale.id));
          await db.delete(projects).where(eq(projects.id, stale.id));
        }),
      );
      console.log(`Cleaned up ${staleProjects.length} stale repos`);
    }
  }
};
