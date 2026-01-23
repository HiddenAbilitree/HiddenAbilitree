import { cerebras } from '@ai-sdk/cerebras';
import { generateText, Output } from 'ai';
import { z } from 'zod';

export type KeyFile = {
  content: string;
  path: string;
};

export const summarizeRepo = async (
  repoName: string,
  description: string | undefined,
  language: string | undefined,
  topics: string[],
  filePaths: string[],
  keyFiles: KeyFile[],
) => {
  const keyFilesSection =
    keyFiles.length > 0 ?
      `\n\nKey source files:\n${keyFiles.map((f) => `--- ${f.path} ---\n${f.content.slice(0, 3000)}${f.content.length > 3000 ? `\n... truncated` : ``}`).join(`\n\n`)}`
    : ``;

  const prompt = `Analyze this GitHub repository and provide a definitive summary and tags. Be specific and confident - you have access to the actual source code.

Repository: ${repoName}
Description: ${description ?? `No description`}
Primary Language: ${language ?? `Unknown`}
GitHub Topics: ${topics.length > 0 ? topics.join(`, `) : `None`}

File structure:
${filePaths.slice(0, 100).join(`\n`)}
${filePaths.length > 100 ? `\n... and ${filePaths.length - 100} more files` : ``}
${keyFilesSection}

Based on the actual code above, provide:
1. A confident, specific 3-4 sentence summary of what this project IS and DOES. Don't hedge with "appears to be" - state what it is definitively based on the code.
2. 5-10 specific tags including: programming languages used, frameworks/libraries (Next.js, React, Drizzle, etc.), and domain categories (Web, API, Database, AI, etc.)`;

  const { output } = await generateText({
    model: cerebras(`llama-3.3-70b`),
    output: Output.object({
      schema: z.object({
        summary: z
          .string()
          .describe(
            `A confident 3-4 sentence summary describing exactly what this project does, its main features, and purpose`,
          ),
        tags: z
          .array(z.string())
          .describe(
            `5-10 specific tags: languages, frameworks, libraries, and domain categories (AI, CLI, Web, API, etc.)`,
          ),
      }),
    }),
    prompt,
  });

  return output;
};
