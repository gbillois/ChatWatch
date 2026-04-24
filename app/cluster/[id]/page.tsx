import { notFound } from "next/navigation";
import { getClusterDetails } from "@/lib/db";

type ClusterPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClusterPage({ params }: ClusterPageProps) {
  const { id } = await params;
  const cluster = await getClusterDetails(id);

  if (!cluster) {
    notFound();
  }

  return (
    <main>
      <h1>{cluster.label ?? `Cluster ${cluster.id}`}</h1>
      <p>
        Articles: <strong>{cluster.articles.length}</strong>
      </p>
      <section className="stack" aria-label="Cluster sources">
        {cluster.articles.map((article) => (
          <article className="card" key={article.id}>
            <h2>
              <a href={article.url} target="_blank" rel="noreferrer">
                {article.title}
              </a>
            </h2>
            <p>{article.source_name}</p>
            <small>{new Date(article.published_at).toLocaleString()}</small>
          </article>
        ))}
      </section>
    </main>
  );
}
