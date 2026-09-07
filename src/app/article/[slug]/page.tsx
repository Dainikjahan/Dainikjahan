import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticles } from "@/lib/articles";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getPublishedArticles(100);
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <>
      <SiteHeader />
      <main className="container article-page">
        <div className="article-breadcrumb"><Link href="/">প্রচ্ছদ</Link><span>›</span><span>{article.category}</span></div>
        <article>
          <p className="kicker">{article.category}</p>
          <h1 className="article-title">{article.title}</h1>
          {article.excerpt && <p className="article-deck">{article.excerpt}</p>}
          <div className="article-meta"><strong>{article.authorName ?? "দৈনিক জাহান ডেস্ক"}</strong><span>•</span><span>দৈনিক জাহান</span></div>
          {article.featuredImageUrl && <img className="article-hero" src={article.featuredImageUrl} alt={article.title} />}
          <div className="article-layout">
            <div className="article-content">{article.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            <aside className="article-aside"><div className="aside-title">দৈনিক জাহান</div><p>সত্য, তথ্য ও জনস্বার্থের সংবাদ।</p><Link href="/">প্রচ্ছদে ফিরুন →</Link></aside>
          </div>
        </article>
      </main>
    </>
  );
}
