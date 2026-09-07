import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticleBySlug } from "@/lib/articles";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";
const siteUrl = "https://dainikjahan.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};
  const canonical = `${siteUrl}/${article.slug}`;
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt ?? article.title,
    alternates: { canonical },
    openGraph: { type: "article", url: canonical, title: article.title, description: article.excerpt ?? article.title, publishedTime: article.publishedAt, modifiedTime: article.updatedAt, images: article.featuredImageUrl ? [{ url: article.featuredImageUrl, alt: article.title }] : undefined },
  };
}

export default async function LegacyArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();
  const canonical = `${siteUrl}/${article.slug}`;
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: article.title, description: article.excerpt ?? article.title, datePublished: article.publishedAt, dateModified: article.updatedAt, mainEntityOfPage: canonical, author: { "@type": "Person", name: article.authorName ?? "দৈনিক জাহান ডেস্ক" }, publisher: { "@type": "Organization", name: "দৈনিক জাহান", url: siteUrl }, image: article.featuredImageUrl ? [article.featuredImageUrl] : undefined, isAccessibleForFree: true };
  return (
    <>
      <SiteHeader />
      <main className="container article-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="article-breadcrumb"><Link href="/">প্রচ্ছদ</Link><span>›</span><span>{article.category}</span></div>
        <article>
          <p className="kicker">{article.category}</p><h1 className="article-title">{article.title}</h1>
          {article.excerpt && <p className="article-deck">{article.excerpt}</p>}
          <div className="article-meta"><strong>{article.authorName ?? "দৈনিক জাহান ডেস্ক"}</strong><span>•</span><time dateTime={article.publishedAt}>{new Date(article.publishedAt ?? article.createdAt).toLocaleString("bn-BD", { dateStyle: "long", timeStyle: "short" })}</time></div>
          {article.featuredImageUrl && <img className="article-hero" src={article.featuredImageUrl} alt={article.title} fetchPriority="high" />}
          <div className="article-layout"><div className="article-content">
            {article.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {article.originalUrl && <div className="article-source"><strong>মূল প্রকাশিত প্রতিবেদন</strong><a href={article.originalUrl} target="_blank" rel="noreferrer">পুরোনো মূল লিংকে দেখুন ↗</a></div>}
          </div><aside className="article-aside"><div className="aside-title">দৈনিক জাহান</div><p>সত্যের সন্ধানে প্রতিদিন।</p><Link href="/">প্রচ্ছদে ফিরুন →</Link></aside></div>
        </article>
      </main>
    </>
  );
}
