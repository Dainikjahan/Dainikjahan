import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getPublishedArticles } from "@/lib/articles";
import type { Article } from "@/types/article";

const categories = [
  ["জাতীয়", "/category/national"], ["রাজনীতি", "/category/politics"], ["ময়মনসিংহ", "/category/mymensingh"],
  ["অর্থনীতি", "/category/economy"], ["আন্তর্জাতিক", "/category/international"], ["খেলা", "/category/sports"],
];

async function loadArticles(): Promise<Article[]> {
  try { return await getPublishedArticles(24); } catch { return []; }
}

function StoryCard({ article }: { article: Article }) {
  return (
    <article className="story-card">
      <div className="story-image">
        {article.featuredImageUrl ? <img src={article.featuredImageUrl} alt={article.title} loading="lazy" /> : <span>জাহান</span>}
      </div>
      <div className="story-body">
        <p className="kicker">{article.category}</p>
        <h3><Link href={`/article/${article.slug}`}>{article.title}</Link></h3>
        {article.excerpt && <p className="excerpt">{article.excerpt}</p>}
      </div>
    </article>
  );
}

export default async function Home() {
  const articles = await loadArticles();
  const featured = articles.find((article) => article.isFeatured) ?? articles[0];
  const secondary = articles.filter((article) => article.id !== featured?.id).slice(0, 5);
  const latest = articles.filter((article) => article.id !== featured?.id).slice(0, 8);
  const special = articles.find((a) => /বিশেষ|অনুসন্ধান|investig/i.test(`${a.category} ${a.title}`));
  const local = articles.find((a) => /ময়মনসিংহ/i.test(`${a.category} ${a.title}`));

  return (
    <>
      <SiteHeader />
      <div className="breaking-bar"><div className="container breaking-inner"><span className="breaking-label">ব্রেকিং</span><p>{featured?.title ?? "দৈনিক জাহান, সত্যের সন্ধানে প্রতিদিন"}</p><span className="live-dot" aria-label="লাইভ" /></div></div>

      <main className="container">
        <section className="signature-hero" aria-label="প্রধান সংবাদ">
          <div className="lead-story">
            <div className="lead-image">{featured?.featuredImageUrl ? <img src={featured.featuredImageUrl} alt={featured.title} fetchPriority="high" /> : <span>প্রধান সংবাদ</span>}</div>
            <div className="lead-copy">
              <p className="kicker">{featured?.category ?? "প্রধান সংবাদ"}</p>
              <h1>{featured ? <Link href={`/article/${featured.slug}`}>{featured.title}</Link> : "সত্যের সন্ধানে প্রতিদিন"}</h1>
              <p className="lead-excerpt">{featured?.excerpt ?? "দ্রুত সংবাদ, গভীর অনুসন্ধান এবং যাচাইকৃত তথ্যকে সামনে রেখে দৈনিক জাহানের ডিজিটাল নিউজরুম।"}</p>
              <div className="meta-row"><span>{featured?.authorName ?? "দৈনিক জাহান ডেস্ক"}</span><span>•</span><span>দৈনিক জাহান</span></div>
            </div>
          </div>
          <aside className="top-stories">
            <div className="section-heading"><h2>সর্বশেষ</h2><Link href="/latest">সব খবর →</Link></div>
            {secondary.map((article) => <article className="headline-item" key={article.id}><p className="kicker">{article.category}</p><h2><Link href={`/article/${article.slug}`}>{article.title}</Link></h2></article>)}
          </aside>
        </section>

        <nav className="category-strip" aria-label="সংবাদ বিভাগ">{categories.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>

        <section className="content-section">
          <div className="section-heading large"><h2>সর্বশেষ সংবাদ</h2><span>রিয়েল-টাইম নিউজরুম</span></div>
          {latest.length ? <div className="story-grid">{latest.map((article) => <StoryCard key={article.id} article={article} />)}</div> : <div className="empty-state"><h3>নিউজরুম প্রস্তুত</h3><p>Firebase-এর প্রকাশিত সংবাদ যুক্ত হলে এই অংশটি স্বয়ংক্রিয়ভাবে পূর্ণ হবে।</p></div>}
        </section>

        <section className="signature-grid">
          <div>
            <div className="section-heading"><h2>ময়মনসিংহ</h2><Link href="/category/mymensingh">আরও →</Link></div>
            {local ? <StoryCard article={local} /> : <article className="feature-panel"><span>মাঠের সংবাদ</span><h3><Link href="/category/mymensingh">ময়মনসিংহের মানুষের খবর, প্রশাসন ও জনস্বার্থ</Link></h3><p>জেলা ও উপজেলার খবরকে অগ্রাধিকার দিয়ে দ্রুত আপডেট।</p></article>}
          </div>
          <div>
            <div className="section-heading"><h2>বিশেষ প্রতিবেদন</h2><Link href="/category/special-report">আরও →</Link></div>
            {special ? <StoryCard article={special} /> : <article className="feature-panel"><span>অনুসন্ধান</span><h3><Link href="/category/special-report">নথি, তথ্য ও প্রমাণের ভিত্তিতে জনস্বার্থের সাংবাদিকতা</Link></h3><p>দাবির সঙ্গে প্রমাণ, বক্তব্যের সঙ্গে নথি, প্রশ্নের সঙ্গে উত্তর।</p></article>}
          </div>
          <div>
            <div className="section-heading"><h2>মতামত</h2><Link href="/category/opinion">আরও →</Link></div>
            <article className="feature-panel"><span>জনস্বার্থ</span><h3><Link href="/category/opinion">সময়ের গুরুত্বপূর্ণ প্রশ্নে যুক্তিনির্ভর মতামত</Link></h3><p>সাংবাদিকতার স্বাধীনতা, স্বচ্ছতা ও জনজীবনের প্রশ্নকে গুরুত্ব।</p></article>
          </div>
        </section>

        <section className="lower-sections">
          {[['আন্তর্জাতিক','/category/international'],['অর্থনীতি','/category/economy'],['স্বাস্থ্য','/category/health'],['শিক্ষা','/category/education']].map(([label, href]) => (
            <Link className="lower-link" key={href} href={href}><span>{label}</span><strong>সর্বশেষ প্রতিবেদন দেখুন</strong><b>→</b></Link>
          ))}
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid"><div><div className="footer-brand">দৈনিক জাহান</div><p>সত্যের সন্ধানে প্রতিদিন</p></div><div><strong>বিভাগ</strong><Link href="/category/national">জাতীয়</Link><Link href="/category/mymensingh">ময়মনসিংহ</Link><Link href="/category/politics">রাজনীতি</Link></div><div><strong>সম্পাদকীয়</strong><Link href="/about">আমাদের সম্পর্কে</Link><Link href="/contact">যোগাযোগ</Link><Link href="/privacy">গোপনীয়তা</Link></div></div>
        <div className="container copyright">© {new Date().getFullYear()} দৈনিক জাহান। সর্বস্বত্ব সংরক্ষিত।</div>
      </footer>
    </>
  );
}
