import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getPublishedArticles } from "@/lib/articles";

export const revalidate = 300;

export default async function LatestPage() {
  const articles = await getPublishedArticles(50);
  return (
    <>
      <SiteHeader />
      <main className="container article-page">
        <div className="section-heading large"><h1>সর্বশেষ সংবাদ</h1><span>দৈনিক জাহান</span></div>
        <section className="story-grid" aria-label="সর্বশেষ প্রতিবেদন">
          {articles.map((article) => <article className="story-card" key={article.id}>
            <div className="story-image">{article.featuredImageUrl ? <img src={article.featuredImageUrl} alt={article.title} loading="lazy" /> : <span>জাহান</span>}</div>
            <div className="story-body"><p className="kicker">{article.category}</p><h2><Link href={`/${article.slug}`}>{article.title}</Link></h2>{article.excerpt && <p className="excerpt">{article.excerpt}</p>}</div>
          </article>)}
        </section>
      </main>
    </>
  );
}
