create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists feeds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null unique,
  language text not null default 'en',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  feed_id uuid not null references feeds(id) on delete cascade,
  source_name text not null,
  url text not null,
  canonical_url text,
  title text not null,
  content_markdown text,
  normalized_title_hash text not null,
  language text not null default 'en',
  published_at timestamptz not null,
  fetched_at timestamptz not null default now(),
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (url),
  unique (canonical_url),
  unique (normalized_title_hash)
);

create index if not exists idx_articles_published_at on articles(published_at desc);
create index if not exists idx_articles_language on articles(language);
create index if not exists idx_articles_embedding on articles using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create table if not exists clusters (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  label text,
  centroid_embedding vector(1536),
  article_count integer not null default 0,
  last_article_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clusters_language on clusters(language);
create index if not exists idx_clusters_last_article_at on clusters(last_article_at desc);
create index if not exists idx_clusters_embedding on clusters using ivfflat (centroid_embedding vector_cosine_ops) with (lists = 100);

create table if not exists cluster_articles (
  cluster_id uuid not null references clusters(id) on delete cascade,
  article_id uuid not null references articles(id) on delete cascade,
  similarity_score double precision not null,
  created_at timestamptz not null default now(),
  primary key (cluster_id, article_id)
);

create index if not exists idx_cluster_articles_article on cluster_articles(article_id);

create table if not exists digests (
  id uuid primary key default gen_random_uuid(),
  cluster_id uuid not null references clusters(id) on delete cascade,
  title text not null,
  summary_markdown text not null,
  key_facts jsonb not null default '[]'::jsonb,
  uncertainties jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  model text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cluster_id)
);

create index if not exists idx_digests_created_at on digests(created_at desc);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_feeds_updated_at on feeds;
create trigger trg_feeds_updated_at before update on feeds
for each row execute function set_updated_at();

drop trigger if exists trg_articles_updated_at on articles;
create trigger trg_articles_updated_at before update on articles
for each row execute function set_updated_at();

drop trigger if exists trg_clusters_updated_at on clusters;
create trigger trg_clusters_updated_at before update on clusters
for each row execute function set_updated_at();

drop trigger if exists trg_digests_updated_at on digests;
create trigger trg_digests_updated_at before update on digests
for each row execute function set_updated_at();
