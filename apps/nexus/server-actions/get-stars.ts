import { db, projects } from 'db';
import { eq } from 'drizzle-orm';

export const getStars = async (repo: string) => {
  'use server';

  const res = await db
    .select({ stars: projects.stargazers_count })
    .from(projects)
    .where(eq(projects.full_name, repo));

  const { stars } = res[0];

  return stars;
};
