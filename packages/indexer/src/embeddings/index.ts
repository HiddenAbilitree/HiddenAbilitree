import type { Config } from '@/src/config';
import type { EmbeddingProvider } from '@/src/embeddings/provider';

export type { EmbeddingProvider } from './provider';

const MODEL = `voyage-code-3`;
const DIMENSIONS = 1024;

export const createEmbeddingProvider = (config: Config): EmbeddingProvider => {
  const { voyageApiKey } = config.embedding;

  const embedBatch = async (texts: string[]): Promise<number[][]> => {
    const response = await fetch(`https://api.voyageai.com/v1/embeddings`, {
      body: JSON.stringify({
        input: texts,
        input_type: `document`,
        model: MODEL,
      }),
      headers: {
        Authorization: `Bearer ${voyageApiKey}`,
        'Content-Type': `application/json`,
      },
      method: `POST`,
    });

    if (!response.ok) {
      throw new Error(
        `Voyage embedding failed: ${response.status} ${await response.text()}`,
      );
    }

    const data = (await response.json()) as {
      data: Array<{ embedding: number[] }>;
    };
    return data.data.map((d) => d.embedding);
  };

  return { dimensions: DIMENSIONS, embedBatch, name: `voyage:${MODEL}` };
};
