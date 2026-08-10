import { NextResponse } from 'next/server';

import { fetchResumeReleaseAsset, hasResumeAccess, RESUME_SESSION_COOKIE } from '@/lib/resume';

export const dynamic = `force-dynamic`;
export const runtime = `nodejs`;

const redirectToResume = (request: Request) => {
  const response = NextResponse.redirect(new URL(`/resume`, request.url));
  response.cookies.set({
    maxAge: 0,
    name: RESUME_SESSION_COOKIE,
    path: `/resume`,
    value: ``,
  });
  return response;
};

export async function GET(request: Request) {
  try {
    if (!(await hasResumeAccess())) {
      return redirectToResume(request);
    }
  } catch {
    return new Response(`Resume access is not configured.`, { status: 503 });
  }

  try {
    const asset = await fetchResumeReleaseAsset();
    const filename = Array.from(asset.filename)
      .map((character) => {
        const codePoint = character.codePointAt(0) ?? 0;
        return codePoint < 0x20 || codePoint === 0x7f || character === `"` || character === `\\`
          ? `_`
          : character;
      })
      .join(``);
    const shouldDownload = new URL(request.url).searchParams.get(`download`) === `1`;
    const headers = new Headers({
      'Cache-Control': `private, no-store`,
      'Content-Disposition': `${shouldDownload ? `attachment` : `inline`}; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(asset.filename)}`,
      'Content-Type': asset.contentType,
      'X-Content-Type-Options': `nosniff`,
    });
    if (asset.contentLength) headers.set(`Content-Length`, asset.contentLength);

    return new Response(asset.body, { headers });
  } catch {
    return new Response(`Unable to retrieve the latest resume.`, { status: 502 });
  }
}
