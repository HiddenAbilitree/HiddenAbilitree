'use server';

import { db, projects } from 'db';
import { eq } from 'drizzle-orm';

export const getRepo = async (repoId: number) => {
  const res = await db
    .select({ stars: projects.stargazers_count, fullName: projects.full_name })
    .from(projects)
    .where(eq(projects.id, repoId));

  if (res.length === 0) return;

  return res[0];
};
