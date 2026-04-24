import { listFeeds } from "@/lib/db";

export default async function AdminPage() {
  const feeds = await listFeeds();

  return (
    <main>
      <h1>Admin</h1>
      <p>Manage feeds and review cluster quality.</p>
      <section className="stack" aria-label="Feed management">
        {feeds.map((feed) => (
          <article className="card" key={feed.id}>
            <h2>{feed.name}</h2>
            <p>{feed.url}</p>
            <small>{feed.active ? "Active" : "Paused"}</small>
          </article>
        ))}
      </section>
    </main>
  );
}
