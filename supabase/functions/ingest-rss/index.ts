// Phase 2 implementation target:
// 1) Load active feeds
// 2) Parse RSS
// 3) Deduplicate inserts
// 4) Queue clustering
export const config = { runtime: "edge" };

Deno.serve(async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      phase: 1,
      message: "ingest-rss scaffold ready"
    }),
    { headers: { "content-type": "application/json" } }
  );
});
