# ChatWatch Architecture Plan

## Assumptions
1. Feed content is publicly accessible over HTTPS and allows periodic fetches.
2. Most clusters are language-homogeneous; language supplied by feed unless article metadata overrides it.
3. OpenAI embedding dimensions use `text-embedding-3-small` (1536) for cost/performance balance.
4. Synthesis is regenerated when cluster membership changes and article count is >= 3.
5. Supabase Cron triggers Edge Functions for ingestion, clustering, and synthesis.

## Phase Plan

### Phase 1 (this PR)
- Initialize Next.js App Router project scaffold.
- Define production schema with pgvector indexes.
- Add typed domain models and foundational library modules.
- Add API RSS output route scaffold.
- Add AGENTS.md with contributor guidance.

### Phase 2
- Implement ingestion Edge Function with RSS parsing and persistence.
- Add ingestion logs and retry behavior.

### Phase 3
- Implement exact dedupe checks using URL/canonical/title hash.
- Add upsert-safe transaction flow and conflict handling.

### Phase 4
- Generate embeddings, then assign articles to existing/new clusters using similarity threshold and 72h window.
- Update cluster centroid incrementally.

### Phase 5
- Generate synthesis for eligible clusters with strict JSON schema parsing.
- Persist digest records and source attribution.

### Phase 6
- Expand frontend UX for cluster details and admin actions (merge/split/manual overrides).

### Phase 7
- Harden RSS output and metadata.
- Add operational docs for Vercel + Supabase deployment and observability.

## Runtime Topology
- **Next.js on Vercel**: web UI + RSS endpoint.
- **Supabase Postgres + pgvector**: canonical store + vector search.
- **Supabase Edge Functions**: ingestion, clustering, synthesis.
- **Supabase Cron**: schedule all background jobs.

## Data Flow
1. Cron triggers `ingest-rss`.
2. New non-duplicate articles are inserted.
3. Cron triggers `cluster-articles` to assign new items.
4. Cron triggers `generate-synthesis` for ready clusters.
5. UI reads `digests` and cluster composition.
6. `/api/rss` renders digest records into RSS XML.
