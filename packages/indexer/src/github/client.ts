import {
  GitHubCommit,
  GitHubContent,
  type GitHubRepo,
  GitHubRestRepo,
  GitHubTree,
} from '@/src/github/types';

const normalizeRepo = (repo: GitHubRestRepo): GitHubRepo => ({
  ...repo,
  description: repo.description ?? undefined,
  language: repo.language ?? undefined,
});

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

export const createGitHubClient = (pat: string, username: string) => {
  const headers = {
    Accept: `application/vnd.github+json`,
    Authorization: `Bearer ${pat}`,
    'X-GitHub-Api-Version': `2022-11-28`,
  };

  const fetchJson = async <T>(url: string, parse: (data: unknown) => T): Promise<T> => {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${await response.text()}`);
    }
    return parse(await response.json());
  };

  const listRepos = async (): Promise<GitHubRepo[]> => {
    const repos: GitHubRepo[] = [];
    let page = 1;

    while (true) {
      const batch = await fetchJson(
        `https://api.github.com/users/${username}/repos?type=public&per_page=100&page=${page}`,
        GitHubRestRepo.array().assert,
      );
      repos.push(...batch.map(normalizeRepo));
      if (batch.length < 100) break;
      page++;
    }

    return repos;
  };

  const getRepo = async (fullName: string): Promise<GitHubRepo> =>
    normalizeRepo(
      await fetchJson(`https://api.github.com/repos/${fullName}`, GitHubRestRepo.assert),
    );

  const getDefaultBranchSha = async (fullName: string, branch: string): Promise<string> => {
    const commit = await fetchJson(
      `https://api.github.com/repos/${fullName}/commits/${branch}`,
      GitHubCommit.assert,
    );
    return commit.sha;
  };

  const getCommitCount = async (fullName: string): Promise<number> => {
    const response = await fetch(`https://api.github.com/repos/${fullName}/commits?per_page=1`, {
      headers,
    });
    const link = response.headers.get(`link`);
    if (!link) return 1;

    const match = link.match(/page=(\d+)>; rel="last"/);
    return match ? Number.parseInt(match[1], 10) : 1;
  };

  const getTree = async (fullName: string, sha: string): Promise<GitHubTree> =>
    fetchJson(
      `https://api.github.com/repos/${fullName}/git/trees/${sha}?recursive=1`,
      GitHubTree.assert,
    );

  const getFileContent = async (fullName: string, path: string): Promise<string> => {
    const content = await fetchJson(
      `https://api.github.com/repos/${fullName}/contents/${path}`,
      GitHubContent.assert,
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
