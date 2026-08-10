import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

import { type } from 'arktype';
import { cookies } from 'next/headers';
import 'server-only';

export const RESUME_SESSION_COOKIE = `resume_access`;
export const RESUME_SESSION_TTL_SECONDS = 60 * 60;

export type ResumeConfig = {
  password: string;
  sessionSecret: string;
  owner: string;
  repository: string;
  pat: string;
};

const releaseAssetSchema = type({
  id: `number`,
  name: `string`,
  'content_type?': `string`,
});

const releaseSchema = type({ assets: releaseAssetSchema.array() });

type ResumeReleaseAsset = {
  body: ReadableStream<Uint8Array>;
  contentLength: string | null;
  contentType: string;
  filename: string;
};

const parseRepository = (value: string): Pick<ResumeConfig, `owner` | `repository`> => {
  const normalized = value
    .trim()
    .replace(/^https?:\/\/github\.com\//i, ``)
    .replace(/\/+$/, ``)
    .replace(/\.git$/i, ``);
  const [owner, repository, ...extra] = normalized.split(`/`);

  if (!owner || !repository || extra.length > 0) {
    throw new Error(`RESUME_REPO must be a GitHub repository in owner/name format`);
  }

  return { owner, repository };
};

export const getResumeConfig = (): ResumeConfig => {
  const password = process.env.RESUME_PASSWORD;
  const repository = process.env.RESUME_REPO;
  const pat = process.env.RESUME_PAT?.trim();
  const sessionSecret = process.env.RESUME_SESSION_SECRET?.trim();

  if (!password || !repository || !pat || !sessionSecret) {
    throw new Error(`Resume environment variables are not configured`);
  }

  return { password, pat, sessionSecret, ...parseRepository(repository) };
};

export const matchesResumePassword = (password: string, expectedPassword: string) => {
  const submittedDigest = createHash(`sha256`).update(password).digest();
  const expectedDigest = createHash(`sha256`).update(expectedPassword).digest();
  return timingSafeEqual(submittedDigest, expectedDigest);
};

const signResumeSession = (expiresAt: string, sessionSecret: string) =>
  createHmac(`sha256`, sessionSecret).update(`resume:${expiresAt}`).digest(`base64url`);

export const createResumeSession = (sessionSecret: string, now = Date.now()) => {
  const expiresAt = String(Math.floor(now / 1000) + RESUME_SESSION_TTL_SECONDS);
  return `${expiresAt}.${signResumeSession(expiresAt, sessionSecret)}`;
};

export const isResumeSessionValid = (
  token: string | undefined,
  sessionSecret: string,
  now = Date.now(),
) => {
  if (!token) return false;

  const parts = token.split(`.`);
  if (parts.length !== 2) return false;

  const [expiresAt, signature] = parts;
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt)) return false;

  const expiresAtSeconds = Number(expiresAt);
  if (!Number.isSafeInteger(expiresAtSeconds) || expiresAtSeconds <= Math.floor(now / 1000)) {
    return false;
  }

  const expectedSignature = signResumeSession(expiresAt, sessionSecret);
  const providedSignature = Buffer.from(signature, `base64url`);
  const expectedSignatureBuffer = Buffer.from(expectedSignature, `base64url`);

  return (
    providedSignature.length === expectedSignatureBuffer.length &&
    timingSafeEqual(providedSignature, expectedSignatureBuffer)
  );
};

export const hasResumeAccess = async () => {
  const { sessionSecret } = getResumeConfig();
  const session = (await cookies()).get(RESUME_SESSION_COOKIE)?.value;
  return isResumeSessionValid(session, sessionSecret);
};

export const fetchResumeReleaseAsset = async (): Promise<ResumeReleaseAsset> => {
  const { owner, pat, repository } = getResumeConfig();
  const repositoryPath = `${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
  const headers = {
    Accept: `application/vnd.github+json`,
    Authorization: `Bearer ${pat}`,
    'User-Agent': `ericzhang.dev resume`,
    'X-GitHub-Api-Version': `2022-11-28`,
  };
  const releaseResponse = await fetch(
    `https://api.github.com/repos/${repositoryPath}/releases/latest`,
    { cache: `no-store`, headers },
  );

  if (!releaseResponse.ok) {
    throw new Error(`Unable to fetch the latest resume release`);
  }

  const release = releaseSchema.assert(await releaseResponse.json());
  const asset =
    release.assets.find((candidate) => candidate.name.toLowerCase().includes(`resume`)) ??
    release.assets.find((candidate) => /\.(pdf|docx?|odt)$/i.test(candidate.name)) ??
    release.assets[0];

  if (!asset) {
    throw new Error(`The latest resume release has no downloadable assets`);
  }

  const assetResponse = await fetch(
    `https://api.github.com/repos/${repositoryPath}/releases/assets/${asset.id}`,
    { cache: `no-store`, headers: { ...headers, Accept: `application/octet-stream` } },
  );

  if (!assetResponse.ok || !assetResponse.body) {
    throw new Error(`Unable to download the latest resume release asset`);
  }

  return {
    body: assetResponse.body,
    contentLength: assetResponse.headers.get(`content-length`),
    contentType:
      assetResponse.headers.get(`content-type`) ?? asset.content_type ?? `application/octet-stream`,
    filename: asset.name,
  };
};
