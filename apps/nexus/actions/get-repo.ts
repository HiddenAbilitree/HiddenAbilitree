'use server';

import { db, eq, projects } from 'db';
import { unstable_noStore } from 'next/cache';

export type StarsResult = { error: false; stars: number } | { error: true };

export const getStars = async (repoId: number): Promise<StarsResult> => {
  unstable_noStore();
  try {
    const res = await db
      .select({ stars: projects.stargazers_count })
      .from(projects)
      .where(eq(projects.id, repoId));

    return res.length === 0 ?
        { error: true }
      : { error: false, stars: res[0].stars };
  } catch {
    return { error: true };
  }
};
