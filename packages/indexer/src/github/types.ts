import { type } from 'arktype';

export const GitHubCommit = type({ sha: 'string' });
export type GitHubCommit = typeof GitHubCommit.infer;

export const GitHubContent = type({ content: 'string', encoding: `'base64'` });
export type GitHubContent = typeof GitHubContent.infer;

export const GitHubOwner = type({ id: 'number', login: 'string' });
export type GitHubOwner = typeof GitHubOwner.infer;

const githubRepoBase = type({
  created_at: 'string',
  fork: 'boolean',
  full_name: 'string',
  html_url: 'string',
  id: 'number',
  owner: GitHubOwner,
  pushed_at: 'string',
  stargazers_count: 'number',
  updated_at: 'string',
});

export const GitHubRestRepo = githubRepoBase.and({
  default_branch: 'string',
  description: 'string | null',
  language: 'string | null',
  topics: 'string[]',
});
export type GitHubRestRepo = typeof GitHubRestRepo.infer;

export const GitHubRepo = githubRepoBase.and({
  default_branch: 'string',
  description: 'string | undefined',
  language: 'string | undefined',
  topics: 'string[]',
});
export type GitHubRepo = typeof GitHubRepo.infer;

export const GitHubTreeItem = type({
  path: 'string',
  sha: 'string',
  'size?': 'number',
  type: `'blob' | 'tree'`,
});
export type GitHubTreeItem = typeof GitHubTreeItem.infer;

export const GitHubTree = type({
  sha: 'string',
  tree: GitHubTreeItem.array(),
  truncated: 'boolean',
});
export type GitHubTree = typeof GitHubTree.infer;

export const GitHubRateLimit = type({
  limit: 'number',
  remaining: 'number',
  reset: 'Date',
  resource: 'string',
  used: 'number',
});
export type GitHubRateLimit = typeof GitHubRateLimit.infer;

export const GitHubGraphQLResponse = type({
  'data?': 'unknown',
  'errors?': type({ message: 'string' }).array(),
});
export type GitHubGraphQLResponse = typeof GitHubGraphQLResponse.infer;

const nullableName = type({ name: 'string' }).or('null');

export const GitHubGraphQLRepoNode = githubRepoBase.and({
  default_branch: nullableName,
  description: 'string | null',
  language: nullableName,
  name: 'string',
  topics: {
    nodes: type({ topic: { name: 'string' } }).array(),
  },
});
export type GitHubGraphQLRepoNode = typeof GitHubGraphQLRepoNode.infer;

export const GitHubGraphQLReposResponse = type({
  user: {
    repositories: {
      nodes: GitHubGraphQLRepoNode.array(),
      pageInfo: {
        endCursor: 'string | null',
        hasNextPage: 'boolean',
      },
    },
  },
});
export type GitHubGraphQLReposResponse = typeof GitHubGraphQLReposResponse.infer;

export const GitHubGraphQLRepoResponse = type({ repository: GitHubGraphQLRepoNode });
export type GitHubGraphQLRepoResponse = typeof GitHubGraphQLRepoResponse.infer;

export const GitHubGraphQLShaResponse = type({
  repository: {
    ref: type({ target: { oid: 'string' } }).or('null'),
  },
});
export type GitHubGraphQLShaResponse = typeof GitHubGraphQLShaResponse.infer;

export const GitHubGraphQLCommitCountResponse = type({
  repository: {
    defaultBranchRef: type({
      target: { history: { totalCount: 'number' } },
    }).or('null'),
  },
});
export type GitHubGraphQLCommitCountResponse = typeof GitHubGraphQLCommitCountResponse.infer;

export const GitHubGraphQLFileResponse = type({
  repository: {
    '[string]': type({ text: 'string | null' }).or('null'),
  },
});
export type GitHubGraphQLFileResponse = typeof GitHubGraphQLFileResponse.infer;
