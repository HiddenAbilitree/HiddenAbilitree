export type Config = {
  embedding: {
    voyageApiKey: string;
  };
  github: {
    pat: string;
    username: string;
  };
  qdrant: {
    apiKey?: string;
    url: string;
  };
};

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

export const loadConfig = (): Config => ({
  embedding: {
    voyageApiKey: requireEnv(`VOYAGE_API_KEY`),
  },
  github: {
    pat: requireEnv(`GITHUB_PAT`),
    username: requireEnv(`GITHUB_USERNAME`),
  },
  qdrant: {
    apiKey: process.env.QDRANT_API_KEY,
    url: process.env.QDRANT_URL ?? `http://localhost:6333`,
  },
});
