import {
  GitHubGraphQLCommitCountResponse,
  GitHubGraphQLFileResponse,
  GitHubGraphQLRepoResponse,
  GitHubGraphQLReposResponse,
  GitHubGraphQLResponse,
  GitHubGraphQLShaResponse,
  type GitHubRateLimit,
  type GitHubRepo,
  GitHubTree,
} from '@/src/github/types';

const extractRateLimitHeaders = (headers: Headers): GitHubRateLimit | undefined => {
  const limit = headers.get(`x-ratelimit-limit`);
  const remaining = headers.get(`x-ratelimit-remaining`);
  const used = headers.get(`x-ratelimit-used`);
  const reset = headers.get(`x-ratelimit-reset`);
  const resource = headers.get(`x-ratelimit-resource`);

  if (!limit || !remaining || !reset) return undefined;

  return {
    limit: Number.parseInt(limit, 10),
    remaining: Number.parseInt(remaining, 10),
    reset: new Date(Number.parseInt(reset, 10) * 1000),
    resource: resource ?? `unknown`,
    used: used ? Number.parseInt(used, 10) : 0,
  };
};

const logRateLimit = (info: GitHubRateLimit, context: string) => {
  const resetIn = Math.max(0, Math.round((info.reset.getTime() - Date.now()) / 1000));
  const minutes = Math.floor(resetIn / 60);
  const seconds = resetIn % 60;
  console.log(
    `  [Rate Limit] ${context}: ${info.remaining}/${info.limit} remaining (resets in ${minutes}m ${seconds}s)`,
  );
};

export class GitHubApiError extends Error {
  rateLimit?: GitHubRateLimit;
  status: number;

  constructor(message: string, status: number, rateLimit?: GitHubRateLimit) {
    super(message);
    this.name = `GitHubApiError`;
    this.status = status;
    this.rateLimit = rateLimit;
  }
}

const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504] as const;
type RetryableStatus = (typeof RETRYABLE_STATUSES)[number];
const RETRYABLE_STATUS_SET = new Set<number>(RETRYABLE_STATUSES);
const isRetryableStatus = (status: number): status is RetryableStatus =>
  RETRYABLE_STATUS_SET.has(status);
const MAX_ERROR_DETAIL_LENGTH = 500;

const getRetryDelay = (response: Response, attempt: number, baseDelay: number): number => {
  const retryAfter = response.headers.get(`retry-after`);
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);

    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.max(0, date - Date.now());
  }

  return baseDelay * 2 ** attempt + Math.random() * baseDelay;
};

const getErrorDetail = async (response: Response): Promise<string> => {
  const contentType = response.headers.get(`content-type`) ?? ``;
  if (contentType.includes(`text/html`)) return response.statusText || `Request failed`;

  const body = (await response.text()).replaceAll(/\s+/g, ` `).trim();
  if (!body) return response.statusText || `Request failed`;
  return body.length > MAX_ERROR_DETAIL_LENGTH
    ? `${body.slice(0, MAX_ERROR_DETAIL_LENGTH)}…`
    : body;
};

const createSemaphore = (limit: number) => {
  let running = 0;
  const queue: Array<() => void> = [];

  const acquire = (): Promise<void> => {
    const { promise, resolve } = Promise.withResolvers<void>();
    if (running < limit) {
      running++;
      resolve();
    } else {
      queue.push(resolve);
    }
    return promise;
  };

  const release = () => {
    running--;
    const next = queue.shift();
    if (next) {
      running++;
      next();
    }
  };

  return { acquire, release };
};

export const createGitHubGraphQLClient = (
  pat: string,
  username: string,
  options: {
    fetcher?: typeof globalThis.fetch;
    maxConcurrent?: number;
    maxRetries?: number;
    retryBaseDelayMs?: number;
  } = {},
) => {
  const {
    fetcher = globalThis.fetch,
    maxConcurrent = 10,
    maxRetries = 3,
    retryBaseDelayMs = 500,
  } = options;
  const semaphore = createSemaphore(maxConcurrent);

  let lastRateLimitLog = 0;
  const RATE_LIMIT_LOG_INTERVAL = 10_000;

  const maybeLogRateLimit = (rateLimit: GitHubRateLimit | undefined, context: string) => {
    if (!rateLimit) return;

    const now = Date.now();
    const shouldLog =
      rateLimit.remaining < 100 ||
      rateLimit.remaining < rateLimit.limit * 0.1 ||
      now - lastRateLimitLog > RATE_LIMIT_LOG_INTERVAL;

    if (shouldLog) {
      logRateLimit(rateLimit, context);
      lastRateLimitLog = now;
    }
  };

  const request = async (
    url: string,
    init: RequestInit,
    context: string,
  ): Promise<{ rateLimit: GitHubRateLimit | undefined; response: Response }> => {
    let attempt = 0;

    while (true) {
      await semaphore.acquire();
      const response = await (async () => {
        try {
          return await fetcher(url, init);
        } finally {
          semaphore.release();
        }
      })();

      const rateLimit = extractRateLimitHeaders(response.headers);
      maybeLogRateLimit(rateLimit, context);

      if (!isRetryableStatus(response.status) || attempt >= maxRetries) {
        return { rateLimit, response };
      }

      const delay = getRetryDelay(response, attempt, retryBaseDelayMs);
      await response.body?.cancel();
      console.warn(
        `  [GitHub ${context}] ${response.status}; retrying ${attempt + 1}/${maxRetries} in ${Math.round(delay)}ms`,
      );
      const { promise, resolve } = Promise.withResolvers<void>();
      setTimeout(resolve, delay);
      await promise;
      attempt++;
    }
  };

  const graphqlFetch = async <T>(
    query: string,
    parseData: (data: unknown) => T,
    variables: Record<string, unknown> = {},
  ): Promise<T> => {
    const { rateLimit, response } = await request(
      `https://api.github.com/graphql`,
      {
        body: JSON.stringify({ query, variables }),
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': `application/json`,
        },
        method: `POST`,
      },
      `GraphQL`,
    );

    if (!response.ok) {
      if (response.status === 403 && rateLimit?.remaining === 0) {
        const resetIn = Math.ceil((rateLimit.reset.getTime() - Date.now()) / 1000);
        throw new GitHubApiError(
          `Rate limit exceeded. Resets in ${Math.ceil(resetIn / 60)} minutes.`,
          response.status,
          rateLimit,
        );
      }
      const detail = await getErrorDetail(response);
      throw new GitHubApiError(
        `GitHub GraphQL error: ${response.status} ${detail}`,
        response.status,
        rateLimit,
      );
    }

    const json = GitHubGraphQLResponse.assert(await response.json());
    if (json.errors?.length) {
      const errorMsg = json.errors.map(({ message }) => message).join(`, `);
      throw new GitHubApiError(`GitHub GraphQL errors: ${errorMsg}`, 400, rateLimit);
    }
    if (json.data === undefined) {
      throw new GitHubApiError(`GitHub GraphQL response contained no data`, 502, rateLimit);
    }

    return parseData(json.data);
  };

  const restFetch = async <T>(url: string, parse: (data: unknown) => T): Promise<T> => {
    const { rateLimit, response } = await request(
      url,
      {
        headers: {
          Accept: `application/vnd.github+json`,
          Authorization: `Bearer ${pat}`,
          'X-GitHub-Api-Version': `2022-11-28`,
        },
      },
      `REST`,
    );

    if (!response.ok) {
      if (response.status === 403 && rateLimit?.remaining === 0) {
        const resetIn = Math.ceil((rateLimit.reset.getTime() - Date.now()) / 1000);
        throw new GitHubApiError(
          `Rate limit exceeded. Resets in ${Math.ceil(resetIn / 60)} minutes.`,
          response.status,
          rateLimit,
        );
      }
      const detail = await getErrorDetail(response);
      throw new GitHubApiError(
        `GitHub REST API error: ${response.status} ${detail}`,
        response.status,
        rateLimit,
      );
    }

    return parse(await response.json());
  };

  const listRepos = async (): Promise<GitHubRepo[]> => {
    const repos: GitHubRepo[] = [];
    let cursor: string | undefined;

    while (true) {
      const query = `
        query($login: String!, $cursor: String) {
          user(login: $login) {
            repositories(first: 100, after: $cursor, ownerAffiliations: [OWNER, COLLABORATOR], privacy: PUBLIC) {
              pageInfo { hasNextPage endCursor }
              nodes {
                id: databaseId
                name
                full_name: nameWithOwner
                description
                html_url: url
                stargazers_count: stargazerCount
                created_at: createdAt
                updated_at: updatedAt
                pushed_at: pushedAt
                language: primaryLanguage { name }
                topics: repositoryTopics(first: 20) { nodes { topic { name } } }
                default_branch: defaultBranchRef { name }
                fork: isFork
                owner { login ... on User { id: databaseId } ... on Organization { id: databaseId } }
              }
            }
          }
        }
      `;

      const data = await graphqlFetch(query, GitHubGraphQLReposResponse.assert, {
        cursor,
        login: username,
      });

      for (const node of data.user.repositories.nodes) {
        repos.push({
          created_at: node.created_at,
          default_branch: node.default_branch?.name ?? `main`,
          description: node.description ?? undefined,
          fork: node.fork,
          full_name: node.full_name,
          html_url: node.html_url,
          id: node.id,
          language: node.language?.name ?? undefined,
          owner: node.owner,
          pushed_at: node.pushed_at,
          stargazers_count: node.stargazers_count,
          topics: node.topics.nodes.map((t) => t.topic.name),
          updated_at: node.updated_at,
        });
      }

      if (!data.user.repositories.pageInfo.hasNextPage) break;
      cursor = data.user.repositories.pageInfo.endCursor ?? undefined;
    }

    return repos;
  };

  const getRepo = async (fullName: string): Promise<GitHubRepo> => {
    const [owner, name] = fullName.split(`/`);
    const query = `
      query($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id: databaseId
          name
          full_name: nameWithOwner
          description
          html_url: url
          stargazers_count: stargazerCount
          created_at: createdAt
          updated_at: updatedAt
          pushed_at: pushedAt
          language: primaryLanguage { name }
          topics: repositoryTopics(first: 20) { nodes { topic { name } } }
          default_branch: defaultBranchRef { name }
          fork: isFork
          owner { login ... on User { id: databaseId } ... on Organization { id: databaseId } }
        }
      }
    `;

    const data = await graphqlFetch(query, GitHubGraphQLRepoResponse.assert, {
      name,
      owner,
    });
    const node = data.repository;

    return {
      created_at: node.created_at,
      default_branch: node.default_branch?.name ?? `main`,
      description: node.description ?? undefined,
      fork: node.fork,
      full_name: node.full_name,
      html_url: node.html_url,
      id: node.id,
      language: node.language?.name ?? undefined,
      owner: node.owner,
      pushed_at: node.pushed_at,
      stargazers_count: node.stargazers_count,
      topics: node.topics.nodes.map((t) => t.topic.name),
      updated_at: node.updated_at,
    };
  };

  const getDefaultBranchSha = async (fullName: string, branch: string): Promise<string> => {
    const [owner, name] = fullName.split(`/`);
    const query = `
      query($owner: String!, $name: String!, $branch: String!) {
        repository(owner: $owner, name: $name) {
          ref(qualifiedName: $branch) {
            target { oid }
          }
        }
      }
    `;

    const data = await graphqlFetch(query, GitHubGraphQLShaResponse.assert, {
      branch: `refs/heads/${branch}`,
      name,
      owner,
    });

    const sha = data.repository.ref?.target.oid;
    if (!sha) throw new Error(`Branch ${branch} not found in ${fullName}`);
    return sha;
  };

  const getCommitCount = async (fullName: string): Promise<number> => {
    const [owner, name] = fullName.split(`/`);
    const query = `
      query($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          defaultBranchRef {
            target {
              ... on Commit {
                history { totalCount }
              }
            }
          }
        }
      }
    `;

    const data = await graphqlFetch(query, GitHubGraphQLCommitCountResponse.assert, {
      name,
      owner,
    });
    return data.repository.defaultBranchRef?.target.history.totalCount ?? 0;
  };

  const getTree = async (fullName: string, sha: string): Promise<GitHubTree> =>
    restFetch(
      `https://api.github.com/repos/${fullName}/git/trees/${sha}?recursive=1`,
      GitHubTree.assert,
    );

  const getFileContents = async (
    fullName: string,
    paths: string[],
  ): Promise<Map<string, string>> => {
    const results = new Map<string, string>();
    if (paths.length === 0) return results;

    const [owner, name] = fullName.split(`/`);
    const BATCH_SIZE = 50;

    for (let i = 0; i < paths.length; i += BATCH_SIZE) {
      const batch = paths.slice(i, i + BATCH_SIZE);

      const fileQueries = batch
        .map((path, idx) => {
          const safeAlias = `file_${idx}`;
          return `${safeAlias}: object(expression: "HEAD:${path.replaceAll(`"`, String.raw`\"`)}") {
            ... on Blob { text }
          }`;
        })
        .join(`\n`);

      const query = `
        query($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            ${fileQueries}
          }
        }
      `;

      const data = await graphqlFetch(query, GitHubGraphQLFileResponse.assert, {
        name,
        owner,
      });

      for (const [idx, path] of batch.entries()) {
        const file = data.repository[`file_${idx}`];
        if (file?.text != null) {
          results.set(path, file.text);
        }
      }
    }

    return results;
  };

  return {
    getCommitCount,
    getDefaultBranchSha,
    getFileContents,
    getRepo,
    getTree,
    listRepos,
  };
};
