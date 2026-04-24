# ChatWatch

ChatWatch is a production-focused RSS aggregator that deduplicates overlapping stories, clusters related coverage, and publishes one synthesized digest per topic.

## Stack
- Next.js (App Router)
- Supabase Postgres + pgvector + Edge Functions + Cron
- OpenAI embeddings and synthesis

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `SITE_URL`
3. Run development server:
   ```bash
   npm run dev
   ```

## Phase status
- ✅ Phase 1: Architecture + schema + base app scaffolding
- ⏳ Phase 2+: ingestion, dedupe persistence flow, clustering job, synthesis job, admin controls

See `docs_architecture.md` for detailed system design and rollout plan.
