'use server';

import { cerebras } from '@ai-sdk/cerebras';
import { createStreamableValue } from '@ai-sdk/rsc';
import { stepCountIs, streamText, tool } from 'ai';
import { type } from 'arktype';

import {
  buildMinimalSystemPrompt,
  formatProjectDetails,
  getAllProjectSummaries,
  getLatestIndexedTime,
  getProjectDetails,
} from '@/lib/rag';

export const getDataLastUpdated = async (): Promise<string | undefined> => {
  const date = await getLatestIndexedTime();
  return date?.toISOString();
};

const DEFAULT_MODEL = `qwen-3.8-27b`;

const modelsResponseSchema = type({ data: type({ id: type.string }).array() });

export const getModels = async (): Promise<{ defaultModel?: string; models: string[] }> => {
  const response = await fetch(`https://api.cerebras.ai/v1/models`, {
    headers: { Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}` },
  });
  const body = response.ok ? modelsResponseSchema(await response.json()) : undefined;
  const models =
    body === undefined || body instanceof type.errors
      ? []
      : body.data.map(({ id }) => id).toSorted();
  return {
    defaultModel: models.includes(DEFAULT_MODEL)
      ? DEFAULT_MODEL
      : models[Math.floor(Math.random() * models.length)],
    models,
  };
};

export type ChatResult = {
  error?: `rate_limit` | `unknown`;
  stream?: ReturnType<typeof createStreamableValue<StreamEvent>>[`value`];
};

export type Message = {
  content: string;
  id: string;
  reasoning?: string;
  role: `assistant` | `user`;
  toolCalls?: ToolCall[];
};

export type StreamEvent =
  | { content: string; type: `reasoning` }
  | { content: string; type: `text` }
  | { error: `rate_limit` | `unknown`; type: `error` }
  | { tool: ToolCall; type: `tool_call` };

export type ToolCall = {
  name: string;
  result?: string;
  status: `completed` | `running`;
};

const projectDetailsInput = type({
  projectName: type.string.describe(`The full project name (e.g., "HiddenAbilitree/nexus")`),
  searchQuery: type.string.describe(
    `What to search for in the code. Include context from the conversation (e.g., "OAuth frontend components" not just "frontend code")`,
  ),
});

export const chat = async (messages: Message[], model: string): Promise<ChatResult> => {
  const stream = createStreamableValue<StreamEvent>();

  void (async () => {
    let hasError = false;

    try {
      const summaries = await getAllProjectSummaries();
      const systemPrompt = buildMinimalSystemPrompt(summaries);

      const result = streamText({
        maxRetries: 0,
        messages: messages.map((m) => ({ content: m.content, role: m.role })),
        model: cerebras(model),
        onError: (event) => {
          hasError = true;
          const errorMessage = String(event.error).toLowerCase();
          const isRateLimit =
            errorMessage.includes(`429`) ||
            errorMessage.includes(`rate`) ||
            errorMessage.includes(`limit`) ||
            errorMessage.includes(`quota`);
          stream.update({
            error: isRateLimit ? `rate_limit` : `unknown`,
            type: `error`,
          });
          stream.done();
        },
        stopWhen: stepCountIs(6),
        system: systemPrompt,
        tools: {
          getProjectDetails: tool({
            description: `Retrieve detailed information and relevant code snippets for a specific project. Use this when the user asks about implementation details, code, or specifics of a project.`,
            execute: async ({ projectName, searchQuery }) => {
              stream.update({
                tool: { name: `getProjectDetails`, status: `running` },
                type: `tool_call`,
              });
              const details = await getProjectDetails(projectName, searchQuery);
              const resultText = details
                ? formatProjectDetails(details)
                : `Project "${projectName}" not found`;
              stream.update({
                tool: {
                  name: `getProjectDetails`,
                  result: details
                    ? `Retrieved ${details.codeSnippets.length} code snippets`
                    : `Not found`,
                  status: `completed`,
                },
                type: `tool_call`,
              });
              return resultText;
            },
            inputSchema: projectDetailsInput,
          }),
        },
      });

      for await (const part of result.fullStream) {
        if (hasError) break;
        if (part.type === `reasoning-delta`) {
          stream.update({ content: part.text, type: `reasoning` });
        } else if (part.type === `text-delta`) {
          stream.update({ content: part.text, type: `text` });
        }
      }

      if (!hasError) {
        stream.done();
      }
    } catch {
      if (!hasError) {
        stream.update({ error: `unknown`, type: `error` });
        stream.done();
      }
    }
  })();

  return { stream: stream.value };
};
