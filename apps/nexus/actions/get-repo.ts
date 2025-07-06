import { db, projects } from 'db';
import { eq } from 'drizzle-orm';

export const getRepo = async (repoId: number) => {
  'use server';

  const res = await db
    .select({ stars: projects.stargazers_count, fullName: projects.full_name })
    .from(projects)
    .where(eq(projects.id, repoId));

  return res[0] ?? undefined;
};
