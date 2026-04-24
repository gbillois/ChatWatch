import OpenAI from "openai";
import type { Article, SynthesisOutput } from "@/types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const synthesisSchema = {
  name: "synthesis",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "summary_markdown", "key_facts", "uncertainties", "sources"],
    properties: {
      title: { type: "string" },
      summary_markdown: { type: "string" },
      key_facts: { type: "array", items: { type: "string" } },
      uncertainties: { type: "array", items: { type: "string" } },
      sources: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "url"],
          properties: {
            name: { type: "string" },
            url: { type: "string" }
          }
        }
      }
    }
  },
  strict: true
} as const;

export async function synthesizeCluster(articles: Article[]): Promise<SynthesisOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for synthesis");
  }

  const input = articles.map((article) => ({
    title: article.title,
    source: article.source_name,
    url: article.url,
    content: article.content_markdown
  }));

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are a neutral news synthesis engine. Use only supplied facts. Explicitly call out uncertainties and source disagreement."
      },
      {
        role: "user",
        content: JSON.stringify(input)
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: synthesisSchema.name,
        schema: synthesisSchema.schema,
        strict: true
      }
    }
  });

  const text = response.output_text;
  return JSON.parse(text) as SynthesisOutput;
}
