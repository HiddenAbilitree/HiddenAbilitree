import { QdrantClient } from '@qdrant/js-client-rest';

import type { EmbeddingProvider } from '@/src/embeddings/provider';

export type QdrantWrapper = {
  deleteCodeByProjectId: (_projectId: number) => Promise<void>;
  ensureCollection: (_provider: EmbeddingProvider) => Promise<void>;
  recreateCollection: (_dimensions: number) => Promise<void>;
  searchCodeFiles: (
    _vector: number[],
    _limit: number,
    _projectIdFilter?: number,
  ) => Promise<Array<{ id: number; projectId: number; score: number }>>;
  upsertCodeFile: (
    _fileId: number,
    _projectId: number,
    _language: string,
    _vector: number[],
  ) => Promise<void>;
};

export const createQdrantClient = (
  url: string,
  apiKey?: string,
): QdrantWrapper => {
  const client = new QdrantClient({ apiKey, url });

  const ensureCollection = async (
    provider: EmbeddingProvider,
  ): Promise<void> => {
    const collections = await client.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === `code_chunks`,
    );

    if (!exists) {
      await client.createCollection(`code_chunks`, {
        vectors: { distance: `Cosine`, size: provider.dimensions },
      });
      await client.createPayloadIndex(`code_chunks`, {
        field_name: `project_id`,
        field_schema: `integer`,
      });
      console.log(
        `Created collection: code_chunks (${provider.dimensions} dimensions)`,
      );
    }
  };

  const recreateCollection = async (dimensions: number): Promise<void> => {
    const collections = await client.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === `code_chunks`,
    );

    if (exists) {
      await client.deleteCollection(`code_chunks`);
      console.log(`Deleted existing code_chunks collection`);
    }

    await client.createCollection(`code_chunks`, {
      vectors: { distance: `Cosine`, size: dimensions },
    });
    await client.createPayloadIndex(`code_chunks`, {
      field_name: `project_id`,
      field_schema: `integer`,
    });
    console.log(`Recreated collection: code_chunks (${dimensions} dimensions)`);
  };

  const upsertCodeFile = async (
    fileId: number,
    projectId: number,
    language: string,
    vector: number[],
  ): Promise<void> => {
    await client.upsert(`code_chunks`, {
      points: [
        {
          id: fileId,
          payload: { file_id: fileId, language, project_id: projectId },
          vector,
        },
      ],
      wait: true,
    });
  };

  const deleteCodeByProjectId = async (projectId: number): Promise<void> => {
    await client.delete(`code_chunks`, {
      filter: { must: [{ key: `project_id`, match: { value: projectId } }] },
      wait: true,
    });
  };

  const searchCodeFiles = async (
    vector: number[],
    limit: number,
    projectIdFilter?: number,
  ): Promise<Array<{ id: number; projectId: number; score: number }>> => {
    const filter =
      projectIdFilter ?
        { must: [{ key: `project_id`, match: { value: projectIdFilter } }] }
      : undefined;

    const results = await client.search(`code_chunks`, {
      filter,
      limit,
      vector,
    });
    return results.map((r) => ({
      id: r.id as number,
      projectId: (r.payload as { project_id: number }).project_id,
      score: r.score,
    }));
  };

  return {
    deleteCodeByProjectId,
    ensureCollection,
    recreateCollection,
    searchCodeFiles,
    upsertCodeFile,
  };
};
