export type GitHubCommit = {
  sha: string;
};

export type GitHubContent = {
  content: string;
  encoding: `base64`;
};

export type GitHubOwner = {
  id: number;
  login: string;
};

export type GitHubRepo = {
  created_at: string;
  default_branch: string;
  description: string | undefined;
  fork: boolean;
  full_name: string;
  html_url: string;
  id: number;
  language: string | undefined;
  owner: GitHubOwner;
  pushed_at: string;
  stargazers_count: number;
  topics: string[];
  updated_at: string;
};

export type GitHubTree = {
  sha: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
};

export type GitHubTreeItem = {
  path: string;
  sha: string;
  size?: number;
  type: `blob` | `tree`;
};
