import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getPublishedArticles } from "@/lib/articles";
import type { Article } from "@/types/article";

const fallbackStories = [
  { category: "জাতীয়", title: "দেশের গুরুত্বপূর্ণ খবর, সিদ্ধান্ত ও জনজীবনের প্রভাব একসঙ্গে", href: "/category/national" },
  { category: "ময়মনসিংহ", title: "ময়মনসিংহের মাঠের খবরকে আরও দ্রুত ও গুরুত্বের সঙ্গে তুলে ধরা", href: "/category/mymensingh" },
  { category: "বিশেষ প্রতিবেদন", title: "তথ্য, নথি ও অনুসন্ধানের ভিত্তিতে জনস্বার্থের প্রতিবেদন", href: "/category/special-report" },
  { category: "অর্থনীতি", title: "বাজার, ব্যবসা ও অর্থনীতির খবর সহজ ভাষায়", href: "/category/economy" },
];

const categories = [
  ["জাতীয়", "/category/national"],
  ["রাজনীতি", "/category/politics"],
  ["ময়মনসিংহ", "/category/mymensingh"],
  ["অর্থনীতি", "/category/economy"],
  ["আন্তর্জাতিক", "/category/international"],
  ["খেলা", "/category/sports"],
];

async function loadArticles(): Promise<Article[]> {
  try {
    return await getPublishedArticles(12);
  } catch {
    return [];
  }
}

function StoryCard({ article }: { article: Article }) {
  return (
    <article className="story-card">
      <div className="story-image">
        {article.featuredImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.featuredImageUrl} alt="" />
        ) : (
          <span>জাহান</span>
        )}
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
  const secondary = articles.filter((article) => article.id !== featured?.id).slice(0, 4);
  const latest = articles.slice(0, 8);

  return (
    <>
      <SiteHeader />

      <div className="breaking-bar">
        <div className="container breaking-inner">
          <span className="breaking-label">ব্রেকিং</span>
          <p>দৈনিক জাহান: সত্য, তথ্য ও জনস্বার্থের সংবাদ</p>
          <span className="live-dot" aria-label="লাইভ"></span>
        </div>
      </div>

      <main className="container">
        <section className="lead-section" aria-label="প্রধান সংবাদ">
          <div className="lead-story">
            <div className="lead-image">
              {featured?.featuredImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.featuredImageUrl} alt="" />
              ) : <span>প্রধান সংবাদ</span>}
            </div>
            <div className="lead-copy">
              <p className="kicker">{featured?.category ?? "সম্পাদকীয়"}</p>
              <h2>
                {featured ? <Link href={`/article/${featured.slug}`}>{featured.title}</Link> : "তথ্যনির্ভর সাংবাদিকতার জন্য নতুন ডিজিটাল জাহান"}
              </h2>
              <p className="lead-excerpt">
                {featured?.excerpt ?? "দ্রুত সংবাদ, গভীর অনুসন্ধান এবং যাচাইকৃত তথ্যকে সামনে রেখে দৈনিক জাহানের ডিজিটাল নিউজরুম।"}
              </p>
              <div className="meta-row"><span>দৈনিক জাহান</span><span>•</span><span>সম্পাদকীয় ডেস্ক</span></div>
            </div>
          </div>

          <aside className="top-stories">
            <div className="section-heading"><h2>সর্বশেষ</h2><Link href="/latest">সব খবর →</Link></div>
            {secondary.length > 0 ? secondary.map((article) => (
              <article className="headline-item" key={article.id}>
                <p className="kicker">{article.category}</p>
                <h3><Link href={`/article/${article.slug}`}>{article.title}</Link></h3>
              </article>
            )) : fallbackStories.map((item) => (
              <article className="headline-item" key={item.href}>
                <p className="kicker">{item.category}</p>
                <h3><Link href={item.href}>{item.title}</Link></h3>
              </article>
            ))}
          </aside>
        </section>

        <section className="category-strip" aria-label="বিভাগ">
          {categories.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </section>

        <section className="content-section">
          <div className="section-heading large"><h2>আজকের গুরুত্বপূর্ণ খবর</h2><span>সম্পাদিত ও যাচাইকৃত</span></div>
          {latest.length > 0 ? (
            <div className="story-grid">{latest.map((article) => <StoryCard key={article.id} article={article} />)}</div>
          ) : (
            <div className="empty-state">
              <h3>নিউজরুম প্রস্তুত</h3>
              <p>Firebase-এর প্রকাশিত সংবাদ যুক্ত হলে এই অংশে স্বয়ংক্রিয়ভাবে সর্বশেষ প্রতিবেদন প্রদর্শিত হবে।</p>
            </div>
          )}
        </section>

        <section className="three-column">
          <div>
            <div className="section-heading"><h2>ময়মনসিংহ</h2><Link href="/category/mymensingh">আরও →</Link></div>
            <article className="feature-panel"><span>মাঠের সংবাদ</span><h3><Link href="/category/mymensingh">স্থানীয় মানুষের জীবন, প্রশাসন ও জনস্বার্থের খবর এক জায়গায়</Link></h3><p>জেলা ও উপজেলার খবরকে কেন্দ্র করে দ্রুত আপডেট এবং অনুসন্ধানী প্রতিবেদন।</p></article>
          </div>
          <div>
            <div className="section-heading"><h2>বিশেষ প্রতিবেদন</h2><Link href="/category/special-report">আরও →</Link></div>
            <article className="feature-panel dark-panel"><span>অনুসন্ধান</span><h3><Link href="/category/special-report">নথি, তথ্য ও প্রমাণের ভিত্তিতে জনস্বার্থের সাংবাদিকতা</Link></h3><p>দাবির সঙ্গে প্রমাণ, বক্তব্যের সঙ্গে নথি, আর প্রশ্নের সঙ্গে উত্তর।</p></article>
          </div>
          <div>
            <div className="section-heading"><h2>জনতার কথা</h2><Link href="/contact">যোগাযোগ →</Link></div>
            <article className="feature-panel"><span>আপনার সংবাদ</span><h3><Link href="/contact">তথ্য, ছবি বা নথি পাঠান</Link></h3><p>জনস্বার্থের গুরুত্বপূর্ণ তথ্য সম্পাদকীয় যাচাইয়ের জন্য পাঠাতে পারেন।</p></article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div><div className="footer-brand">দৈনিক জাহান</div><p>সত্য, তথ্য ও জনস্বার্থের সংবাদ</p></div>
          <div><strong>বিভাগ</strong><Link href="/category/national">জাতীয়</Link><Link href="/category/mymensingh">ময়মনসিংহ</Link><Link href="/category/politics">রাজনীতি</Link></div>
          <div><strong>সম্পাদকীয়</strong><Link href="/about">আমাদের সম্পর্কে</Link><Link href="/contact">যোগাযোগ</Link><Link href="/privacy">গোপনীয়তা</Link></div>
        </div>
        <div className="container copyright">© {new Date().getFullYear()} দৈনিক জাহান। সর্বস্বত্ব সংরক্ষিত।</div>
      </footer>
    </>
  );
}
