import { describe, expect, it } from "vitest";
import fixture from "./fixtures/articles.json";
import { buildDedupeKeys, normalizeUrl } from "@/lib/dedupe";

describe("dedupe", () => {
  it("normalizes URLs consistently", () => {
    expect(normalizeUrl("https://Example.com/Story/")).toBe("example.com/story");
  });

  it("builds stable dedupe keys", () => {
    const article = fixture[0]!;
    const keys = buildDedupeKeys(article.url, article.canonicalUrl, article.title);

    expect(keys.url).toBe("news.example.com/local/housing-plan");
    expect(keys.canonicalUrl).toBe("news.example.com/local/housing-plan");
    expect(keys.normalizedTitleHash).toHaveLength(64);
  });
});
