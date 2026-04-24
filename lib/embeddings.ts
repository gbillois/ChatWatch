import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmbedding(input: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for embeddings");
  }

  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input
  });

  return response.data[0]?.embedding ?? [];
}
