import { QdrantClient } from '@qdrant/js-client-rest';
import { db, eq, inArray } from 'db';
import { codeFiles, projects } from 'db';

import { embedQueryForCode } from '@/lib/embeddings';

export type ProjectDetails = {
  codeSnippets: Array<CodeFile & { projectName: string }>;
  project: Project;
};
export type ProjectSummary = {
  description: string | undefined;
  id: number;
  isOwner: boolean;
  name: string;
  tags: string[];
};

type CodeFile = typeof codeFiles.$inferSelect;

type Project = typeof projects.$inferSelect;

const qdrant = new QdrantClient({
  apiKey: process.env.QDRANT_API_KEY,
  url: process.env.QDRANT_URL ?? `http://localhost:6333`,
});

export const getAllProjectSummaries = async (): Promise<ProjectSummary[]> => {
  const allProjects = await db.select().from(projects);
  return allProjects.map((p) => ({
    description: p.ai_summary ?? undefined,
    id: p.id,
    isOwner: p.is_owner ?? true,
    name: p.full_name,
    tags: p.ai_tags ?? [],
  }));
};

export const getLatestIndexedTime = async (): Promise<Date | undefined> => {
  const allProjects = await db
    .select({ lastIndexedAt: projects.last_indexed_at })
    .from(projects);
  const dates = allProjects
    .map((p) => p.lastIndexedAt)
    .filter((d): d is Date => d !== null);
  return dates.length > 0 ?
      new Date(Math.max(...dates.map((d) => d.getTime())))
    : undefined;
};

export const getProjectDetails = async (
  projectName: string,
  query: string,
): Promise<ProjectDetails | undefined> => {
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.full_name, projectName))
    .then((rows) => rows[0]);

  if (!project) return undefined;

  const codeEmbedding = await embedQueryForCode(query);
  const codeResults = await qdrant.search(`code_chunks`, {
    filter: { must: [{ key: `project_id`, match: { value: project.id } }] },
    limit: 5,
    vector: codeEmbedding,
  });

  const fileIds = codeResults.map((r) => r.id as number);
  let codeSnippets: Array<CodeFile & { projectName: string }> = [];

  if (fileIds.length > 0) {
    const files = await db
      .select()
      .from(codeFiles)
      .where(inArray(codeFiles.id, fileIds));
    codeSnippets = files.map((f) => ({
      ...f,
      projectName: project.full_name,
    }));
  }

  return { codeSnippets, project };
};

export const buildMinimalSystemPrompt = (
  summaries: ProjectSummary[],
): string => {
  const owned = summaries.filter((s) => s.isOwner);
  const contributed = summaries.filter((s) => !s.isOwner);

  const projectList = summaries
    .map((s) => {
      const tagsStr = s.tags.length > 0 ? ` [${s.tags.join(`, `)}]` : ``;
      return `- ${s.name}: ${s.description ?? `No description`}${tagsStr}`;
    })
    .join(`\n`);

  return `REQUIRED BEHAVIOR - STRICTLY FOLLOW THESE RULES:
1. You MUST always respond in English.
2. When answering "how" or "implementation" questions, you MUST include code blocks from tool results.
3. When showing code, you MUST use the exact format from tool results: \`\`\`language|URL (e.g., \`\`\`typescript|https://github.com/...)
4. You MUST NEVER invent or hallucinate code - only show code returned by the tool.
5. If tool returns "Not found", you MUST say so - do NOT fabricate code.
6. You MUST use getProjectDetails tool for any question about a specific project.
7. You MUST ALWAYS use the FULL project name format "owner/repo" (e.g., "HiddenAbilitree/mcp-scheduling", NOT just "mcp-scheduling"). The tool will return "Not found" if you omit the owner prefix.
8. You MUST match typos to closest project name (e.g., "next auth template" → "HiddenAbilitree/next-auth-template").
9. When the user says "this site", "this website", or "this portfolio", they are referring to the nexus app within "HiddenAbilitree/HiddenAbilitree" unless context clearly indicates otherwise.
10. IMPORTANT: The nexus app is a portfolio website that DISPLAYS information about other projects (via ProjectCard components). Do NOT confuse the tech stack of DISPLAYED projects with the tech stack of nexus itself. The nexus tech stack is what's in package.json and imports (Next.js, React, Tailwind, etc.), NOT the badges/technologies shown in ProjectCard components which describe OTHER projects.
11. WORKFLOW: Complete ALL your tool calls first, then provide your final response. Do NOT output partial responses like "I'll search..." or "Let me check..." - just do the searches silently and respond with the answer.
12. EFFICIENCY: For broad questions across many projects, be selective. Use the project summaries provided to answer when possible. Only call getProjectDetails for 2-3 most relevant projects, not all of them.
13. LINKING: When mentioning an exact project name, ALWAYS use a markdown link to the GitHub repo. Format: [project-name](https://github.com/owner/repo). Example: [ghast](https://github.com/HiddenAbilitree/ghast) or [next-auth-template](https://github.com/HiddenAbilitree/next-auth-template).

You are a portfolio assistant for Eric Zhang. Eric owns ${owned.length} projects and contributed to ${contributed.length} others. You are embedded in the nexus app, which is part of the HiddenAbilitree/HiddenAbilitree monorepo.

Projects:
${projectList}`;
};

export const formatProjectDetails = (details: ProjectDetails): string => {
  const { codeSnippets, project } = details;

  const ownershipInfo =
    project.is_owner ?
      `Eric owns this project`
    : `Eric contributed to this project (owned by ${project.owner_login})`;

  const forkNote = project.is_fork ? ` (Fork)` : ``;

  const codeSection =
    codeSnippets.length > 0 ?
      `\n\n=== CODE SNIPPETS (COPY THESE EXACTLY IN YOUR RESPONSE) ===\n${codeSnippets
        .map(
          (c) => `
${c.path}:
\`\`\`${c.language}|${project.html_url}/blob/main/${c.path}
${c.content}
\`\`\`
`,
        )
        .join(`\n`)}`
    : ``;

  return `## ${project.full_name}${forkNote}
- ${ownershipInfo}
- Summary: ${project.ai_summary ?? `No summary`}
- Tags: ${project.ai_tags?.join(`, `) ?? `None`}
- Stars: ${project.stargazers_count} | Commits: ${project.commit_count ?? `Unknown`}
- Link: ${project.html_url}
${codeSection}

REMINDER: Copy the code blocks above EXACTLY (including the language|URL format) for "how" or implementation questions.`;
};
