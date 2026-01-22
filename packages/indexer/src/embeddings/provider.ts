export type EmbeddingProvider = {
  dimensions: number;
  embedBatch: (_texts: string[]) => Promise<number[][]>;
  name: string;
};
