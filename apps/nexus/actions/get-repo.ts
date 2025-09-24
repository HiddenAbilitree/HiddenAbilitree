'use server';

import { db, projects } from 'db';
import { eq } from 'drizzle-orm';
import { unstable_noStore } from 'next/cache';

export const getRepo = async (repoId: number) => {
  unstable_noStore();
  const res = await db
    .select({ fullName: projects.full_name, stars: projects.stargazers_count })
    .from(projects)
    .where(eq(projects.id, repoId));

  if (res.length === 0) return;

  return res[0];
};
