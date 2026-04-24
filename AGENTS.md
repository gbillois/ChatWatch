# AGENTS.md — ChatWatch

## Project goal
Build and operate a production-grade RSS aggregation and synthesis platform that ingests many sources, deduplicates coverage, clusters related stories, and publishes one factual synthesized digest per topic.

## Coding standards
- Use strict TypeScript and prefer explicit domain types in `types/index.ts`.
- Keep modules focused (`lib/*` for reusable business logic, `app/*` for UI/API routes, `supabase/*` for data/back-end operations).
- Add logging around ingestion, dedupe, clustering, and synthesis decisions.
- Handle errors with explicit, actionable messages.
- Avoid hardcoded secrets; rely on environment variables.
- Favor deterministic functions for critical transformations (normalization, hashing, similarity scoring).

## Expected behaviors
- Preserve source attribution in all synthesis output.
- Never invent facts that are not grounded in source articles.
- Use neutral tone and highlight disagreements/uncertainties.
- Maintain idempotent background jobs and conflict-safe database writes.

## Constraints
- Stack is mandatory: Next.js + Supabase (Postgres/pgvector/Edge Functions/Cron) + OpenAI.
- The product should be manageable from the web UI and Supabase dashboard (no end-user CLI dependency).
- Keep UI responsive and mobile-friendly for supervision workflows.
- Every change should be reviewable, testable, and production-oriented.
