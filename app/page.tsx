import Link from "next/link";
import { listDigests } from "@/lib/db";

export default async function HomePage() {
  const digests = await listDigests();

  return (
    <main>
      <h1>ChatWatch</h1>
      <p>Synthesized coverage from multiple sources.</p>
      <section className="stack" aria-label="Digest list">
        {digests.length === 0 ? (
          <div className="card">No synthesized stories yet. Ingestion is running.</div>
        ) : (
          digests.map((digest) => (
            <article className="card" key={digest.id}>
              <h2>
                <Link href={`/cluster/${digest.cluster_id}`}>{digest.title}</Link>
              </h2>
              <p>{digest.summary_markdown.slice(0, 220)}...</p>
              <small>{new Date(digest.created_at).toLocaleString()}</small>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
