import { Webhooks } from "@octokit/webhooks";
import { db, projects } from "db";
import { Elysia, t } from "elysia";

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET!,
});

export const app = new Elysia({ aot: false }).post(
  `/`,
  async ({ body, headers, status }) => {
    if (
      headers[`x-hub-signature-256`] === undefined ||
      !(await webhooks.verify(
        JSON.stringify(body),
        headers[`x-hub-signature-256`],
      ))
    )
      return status(401);

    const { repository } = body;
    const values = {
      full_name: repository.full_name,
      html_url: repository.html_url,
      id: repository.id,
      stargazers_count: repository.stargazers_count,
    };
    const data = await db
      .insert(projects)
      .values(values)
      .onConflictDoUpdate({ set: values, target: projects.id });

    return status(data.rowCount === 0 ? 500 : 200);
  },
  {
    body: t.Object(
      {
        repository: t.Object({
          full_name: t.String(),
          html_url: t.String(),
          id: t.Number(),
          stargazers_count: t.Number(),
        }),
      },
      { additionalProperties: true },
    ),
  },
);
