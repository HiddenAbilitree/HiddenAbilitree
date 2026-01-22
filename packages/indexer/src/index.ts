import { loadConfig } from '@/src/config';
import { createEmbeddingProvider } from '@/src/embeddings';
import { runIndexPipeline } from '@/src/pipeline/index-repos';
import { createQdrantClient } from '@/src/vectors/qdrant';

const parseRepoArg = (args: string[]): string | undefined => {
  const repoIndex = args.indexOf(`--repo`);
  if (repoIndex === -1) return undefined;
  const repoValue = args[repoIndex + 1];
  if (!repoValue || repoValue.startsWith(`--`)) {
    throw new Error(`--repo flag requires a repository name`);
  }
  return repoValue;
};

const args = process.argv.slice(2);
const command = args[0];

if (command !== `index`) {
  console.log(
    `Usage: bun run src/index.ts index [--force] [--repo <name>] [--summaries-only] [--recreate-collection]`,
  );
  throw new Error(`Invalid command`);
}

const config = loadConfig();
const force = args.includes(`--force`);
const summariesOnly = args.includes(`--summaries-only`);
const recreateCollection = args.includes(`--recreate-collection`);
const singleRepo = parseRepoArg(args);

const provider = createEmbeddingProvider(config);
const qdrant = createQdrantClient(config.qdrant.url, config.qdrant.apiKey);

await runIndexPipeline(config, provider, qdrant, {
  force,
  recreateCollection,
  singleRepo,
  summariesOnly,
});

// eslint-disable-next-line unicorn/no-process-exit
process.exit(0);
