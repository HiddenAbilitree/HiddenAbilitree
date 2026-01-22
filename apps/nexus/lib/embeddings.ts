type EmbeddingResponse = {
  data: Array<{ embedding: number[] }>;
};

export const embedQueryForCode = async (text: string): Promise<number[]> => {
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
    throw new Error(`Voyage embedding failed: ${response.status}`);
  }

  const data = (await response.json()) as EmbeddingResponse;
  return data.data[0].embedding;
};
