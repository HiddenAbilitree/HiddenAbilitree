import type {
  GitHubCommit,
  GitHubContent,
  GitHubRepo,
  GitHubTree,
} from '@/src/github/types';

export type GitHubClient = {
  getCommitCount: (_fullName: string) => Promise<number>;
  getDefaultBranchSha: (_fullName: string, _branch: string) => Promise<string>;
  getFileContent: (_fullName: string, _path: string) => Promise<string>;
  getRepo: (_fullName: string) => Promise<GitHubRepo>;
  getTree: (_fullName: string, _sha: string) => Promise<GitHubTree>;
  listRepos: () => Promise<GitHubRepo[]>;
};

const CODE_EXTENSIONS = new Set([
  `.bash`,
  `.c`,
  `.cc`,
  `.cjs`,
  `.clj`,
  `.cljc`,
  `.cljs`,
  `.cpp`,
  `.cs`,
  `.cxx`,
  `.d`,
  `.el`,
  `.ex`,
  `.exs`,
  `.fs`,
  `.fsx`,
  `.go`,
  `.h`,
  `.hpp`,
  `.hs`,
  `.hxx`,
  `.java`,
  `.jl`,
  `.js`,
  `.json`,
  `.jsx`,
  `.kt`,
  `.kts`,
  `.lua`,
  `.mjs`,
  `.ml`,
  `.mli`,
  `.nim`,
  `.php`,
  `.py`,
  `.pyw`,
  `.r`,
  `.R`,
  `.rb`,
  `.rs`,
  `.scala`,
  `.sh`,
  `.sql`,
  `.swift`,
  `.ts`,
  `.tsx`,
  `.v`,
  `.vim`,
  `.zig`,
  `.zsh`,
]);

export const isCodeFile = (path: string): boolean => {
  const ext = path.slice(path.lastIndexOf(`.`));
  return CODE_EXTENSIONS.has(ext.toLowerCase());
};

export const createGitHubClient = (
  pat: string,
  username: string,
): GitHubClient => {
  const headers = {
    Accept: `application/vnd.github+json`,
    Authorization: `Bearer ${pat}`,
    'X-GitHub-Api-Version': `2022-11-28`,
  };

  const fetchJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${await response.text()}`,
      );
    }
    return response.json() as Promise<T>;
  };

  const listRepos = async (): Promise<GitHubRepo[]> => {
    const repos: GitHubRepo[] = [];
    let page = 1;

    while (true) {
      const batch = await fetchJson<GitHubRepo[]>(
        `https://api.github.com/users/${username}/repos?type=public&per_page=100&page=${page}`,
      );
      repos.push(...batch);
      if (batch.length < 100) break;
      page++;
    }

    return repos;
  };

  const getRepo = async (fullName: string): Promise<GitHubRepo> =>
    fetchJson<GitHubRepo>(`https://api.github.com/repos/${fullName}`);

  const getDefaultBranchSha = async (
    fullName: string,
    branch: string,
  ): Promise<string> => {
    const commit = await fetchJson<GitHubCommit>(
      `https://api.github.com/repos/${fullName}/commits/${branch}`,
    );
    return commit.sha;
  };

  const getCommitCount = async (fullName: string): Promise<number> => {
    const response = await fetch(
      `https://api.github.com/repos/${fullName}/commits?per_page=1`,
      { headers },
    );
    const link = response.headers.get(`link`);
    if (!link) return 1;

    const match = link.match(/page=(\d+)>; rel="last"/);
    return match ? Number.parseInt(match[1], 10) : 1;
  };

  const getTree = async (fullName: string, sha: string): Promise<GitHubTree> =>
    fetchJson<GitHubTree>(
      `https://api.github.com/repos/${fullName}/git/trees/${sha}?recursive=1`,
    );

  const getFileContent = async (
    fullName: string,
    path: string,
  ): Promise<string> => {
    const content = await fetchJson<GitHubContent>(
      `https://api.github.com/repos/${fullName}/contents/${path}`,
    );
    return Buffer.from(content.content, `base64`).toString(`utf-8`);
  };

  return {
    getCommitCount,
    getDefaultBranchSha,
    getFileContent,
    getRepo,
    getTree,
    listRepos,
  };
};
