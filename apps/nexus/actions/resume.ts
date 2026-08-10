'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  createResumeSession,
  getResumeConfig,
  matchesResumePassword,
  RESUME_SESSION_COOKIE,
  RESUME_SESSION_TTL_SECONDS,
  type ResumeConfig,
} from '@/lib/resume';

export type ResumeActionState = {
  error?: string;
};

export const unlockResume = async (
  _state: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> => {
  const submittedPassword = formData.get(`password`);
  if (typeof submittedPassword !== `string`) {
    return { error: `Enter the resume password.` };
  }

  let config: ResumeConfig;
  try {
    config = getResumeConfig();
  } catch {
    return { error: `Resume access is not configured.` };
  }

  if (!matchesResumePassword(submittedPassword, config.password)) {
    return { error: `Incorrect password.` };
  }

  (await cookies()).set({
    httpOnly: true,
    maxAge: RESUME_SESSION_TTL_SECONDS,
    name: RESUME_SESSION_COOKIE,
    path: `/resume`,
    sameSite: `lax`,
    secure: process.env.NODE_ENV === `production`,
    value: createResumeSession(config.sessionSecret),
  });

  return redirect(`/resume`);
};
