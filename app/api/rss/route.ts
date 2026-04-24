import { NextResponse } from "next/server";
import { listDigests } from "@/lib/db";

export async function GET() {
  const digests = await listDigests(50);

  const items = digests
    .map(
      (digest) => `
      <item>
        <title><![CDATA[${digest.title}]]></title>
        <link>${process.env.SITE_URL ?? "http://localhost:3000"}/cluster/${digest.cluster_id}</link>
        <guid>${digest.id}</guid>
        <pubDate>${new Date(digest.created_at).toUTCString()}</pubDate>
        <description><![CDATA[${digest.summary_markdown}]]></description>
      </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>ChatWatch Syntheses</title>
      <link>${process.env.SITE_URL ?? "http://localhost:3000"}</link>
      <description>Synthesized multi-source news clusters</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
