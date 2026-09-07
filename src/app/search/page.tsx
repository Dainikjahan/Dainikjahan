import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim();
  const articles = await getPublishedArticles(100);
  const results = term ? articles.filter((article) => `${article.title} ${article.excerpt ?? ""} ${article.content}`.toLowerCase().includes(term.toLowerCase())) : articles.slice(0, 12);

  return (
    <>
      <SiteHeader />
      <main className="container">
        <div className="section-heading large"><h1>সংবাদ অনুসন্ধান</h1><span>{term ? `${results.length}টি ফলাফল` : "সাম্প্রতিক সংবাদ"}</span></div>
        <form className="search-form" action="/search"><input name="q" defaultValue={term} placeholder="সংবাদের শিরোনাম বা শব্দ লিখুন…" aria-label="সংবাদ খুঁজুন" /><button type="submit">খুঁজুন</button></form>
        <div className="story-grid search-grid">{results.map((article) => <article className="story-card" key={article.id}><div className="story-body"><p className="kicker">{article.category}</p><h3><Link href={`/article/${article.slug}`}>{article.title}</Link></h3>{article.excerpt && <p className="excerpt">{article.excerpt}</p>}</div></article>)}</div>
        {!results.length && <div className="empty-state"><h3>কোনো সংবাদ পাওয়া যায়নি</h3><p>অন্য শব্দ দিয়ে আবার অনুসন্ধান করুন।</p></div>}
      </main>
    </>
  );
}
