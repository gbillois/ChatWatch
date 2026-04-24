import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { ClusterDetails, Digest, Feed } from "@/types";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional()
});

const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

const hasSupabase = Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase = hasSupabase
  ? createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  : null;

export async function listDigests(limit = 20): Promise<Digest[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("digests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to list digests", error);
    return [];
  }

  return (data ?? []) as Digest[];
}

export async function listFeeds(): Promise<Feed[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from("feeds").select("*").order("name");

  if (error) {
    console.error("Failed to list feeds", error);
    return [];
  }

  return (data ?? []) as Feed[];
}

export async function getClusterDetails(clusterId: string): Promise<ClusterDetails | null> {
  if (!supabase) {
    return null;
  }

  const [{ data: cluster, error: clusterError }, { data: articles, error: articleError }] =
    await Promise.all([
      supabase.from("clusters").select("*").eq("id", clusterId).single(),
      supabase
        .from("cluster_articles")
        .select("articles(*)")
        .eq("cluster_id", clusterId)
        .order("created_at", { ascending: false })
    ]);

  if (clusterError || articleError || !cluster) {
    console.error("Failed to load cluster details", { clusterError, articleError, clusterId });
    return null;
  }

  return {
    ...(cluster as ClusterDetails),
    articles: (articles ?? [])
      .map((row) => (row as { articles: ClusterDetails["articles"][number] }).articles)
      .filter(Boolean)
  };
}
