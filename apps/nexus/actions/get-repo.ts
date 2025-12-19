'use server';

import { db, eq, projects } from 'db';
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
