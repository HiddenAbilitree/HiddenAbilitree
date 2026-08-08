export type EmbeddingResult =
  | { embedding: number[]; success: true }
  | { error: string; success: false };

type EmbeddingResponse = {
  data: Array<{ embedding: number[] }>;
};
const isEmbeddingResponse = (value: unknown): value is EmbeddingResponse => {
  if (
    typeof value !== `object` ||
    value === null ||
    !(`data` in value) ||
    !Array.isArray(value.data)
  )
    return false;

  const first: unknown = value.data[0];
  return (
    typeof first === `object` &&
    first !== null &&
    `embedding` in first &&
    Array.isArray(first.embedding) &&
    first.embedding.every((item: unknown) => typeof item === `number`)
  );
};

export const embedQueryForCode = async (text: string): Promise<EmbeddingResult> => {
  const response = await fetch(`https://api.voyageai.com/v1/embeddings`, {
    body: JSON.stringify({
      input: text,
      input_type: `query`,
      model: `voyage-code-3`,
    }),
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': `application/json`,
    },
    method: `POST`,
  });

  if (!response.ok) {
    return {
      error: `Voyage embedding failed: ${response.status}`,
      success: false,
    };
  }

  const data: unknown = await response.json();
  if (!isEmbeddingResponse(data))
    return { error: `Voyage embedding returned an invalid response`, success: false };

  return { embedding: data.data[0].embedding, success: true };
};
