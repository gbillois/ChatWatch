import { describe, expect, it } from "vitest";
import fixture from "./fixtures/articles.json";
import { cosineSimilarity, shouldCreateNewCluster } from "@/lib/clustering";

describe("clustering", () => {
  it("detects semantically similar stories", () => {
    const sim = cosineSimilarity(fixture[0]!.embedding, fixture[1]!.embedding);
    expect(sim).toBeGreaterThan(0.99);
    expect(shouldCreateNewCluster(sim, 0.83)).toBe(false);
  });

  it("separates unrelated stories", () => {
    const sim = cosineSimilarity(fixture[0]!.embedding, fixture[2]!.embedding);
    expect(sim).toBeLessThan(0.6);
    expect(shouldCreateNewCluster(sim, 0.83)).toBe(true);
  });
});
