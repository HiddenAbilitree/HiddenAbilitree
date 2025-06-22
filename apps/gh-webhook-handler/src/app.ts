import { Webhooks } from '@octokit/webhooks';
import { db, projects } from 'db';
import { Elysia, t } from 'elysia';

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET,
});

const repository = t.Object({
  id: t.Number(),
  full_name: t.String(),
  stargazers_count: t.Number(),
});

const body = t.Object({ repository }, { additionalProperties: true });

export const app = new Elysia({ aot: false }).post(
  '/',
  async ({ body, headers, status }) => {
    if (
      !(await webhooks.verify(
        JSON.stringify(body),
        headers['x-hub-signature-256'] as string,
      ))
    )
      return status(401);
    const { repository } = body;
    await db
      .insert(projects)
      .values(repository)
      .onConflictDoUpdate({ target: projects.id, set: repository });
  },
  { body },
);
