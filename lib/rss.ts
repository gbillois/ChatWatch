import Parser from "rss-parser";

const parser = new Parser();

export type ParsedFeedItem = {
  title: string;
  url: string;
  content: string;
  publishedAt: string;
};

export async function fetchFeedItems(feedUrl: string): Promise<ParsedFeedItem[]> {
  const feed = await parser.parseURL(feedUrl);

  return (feed.items ?? [])
    .map((item) => ({
      title: item.title?.trim() ?? "Untitled",
      url: item.link?.trim() ?? "",
      content: (item.contentSnippet ?? item.content ?? "").trim(),
      publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString()
    }))
    .filter((item) => item.url.length > 0);
}
