export type Feed = {
  id: string;
  name: string;
  url: string;
  language: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: string;
  feed_id: string;
  source_name: string;
  url: string;
  canonical_url: string | null;
  title: string;
  content_markdown: string | null;
  normalized_title_hash: string;
  language: string;
  published_at: string;
  fetched_at: string;
  created_at: string;
  embedding: number[] | null;
};

export type Cluster = {
  id: string;
  language: string;
  label: string | null;
  centroid_embedding: number[] | null;
  article_count: number;
  created_at: string;
  updated_at: string;
};

export type ClusterArticle = {
  cluster_id: string;
  article_id: string;
  similarity_score: number;
  created_at: string;
};

export type Digest = {
  id: string;
  cluster_id: string;
  title: string;
  summary_markdown: string;
  key_facts: string[];
  uncertainties: string[];
  sources: Array<{ name: string; url: string }>;
  model: string;
  created_at: string;
};

export type ClusterDetails = Cluster & {
  articles: Article[];
};

export type SynthesisOutput = {
  title: string;
  summary_markdown: string;
  key_facts: string[];
  uncertainties: string[];
  sources: Array<{ name: string; url: string }>;
};
