import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

const labels: Record<string, string> = {
  national: "জাতীয়",
  politics: "রাজনীতি",
  mymensingh: "ময়মনসিংহ",
  economy: "অর্থনীতি",
  international: "আন্তর্জাতিক",
  sports: "খেলা",
  education: "শিক্ষা",
  health: "স্বাস্থ্য",
  technology: "প্রযুক্তি",
  entertainment: "বিনোদন",
  "special-report": "বিশেষ প্রতিবেদন",
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = labels[slug] ?? slug.replaceAll("-", " ");
  const articles = await getPublishedArticles(100);
  const matching = articles.filter((article) => article.category === title || article.category?.toLowerCase() === slug);

  return (
    <>
      <SiteHeader />
      <main className="container">
        <div className="section-heading large"><h1>{title}</h1><span>{matching.length}টি প্রকাশিত সংবাদ</span></div>
        {matching.length ? <div className="story-grid">{matching.map((article) => (
          <article className="story-card" key={article.id}>
            <Link href={`/article/${article.slug}`} className="story-image">
              {article.featuredImageUrl ? <img src={article.featuredImageUrl} alt="" /> : <span>জাহান</span>}
            </Link>
            <div className="story-body"><p className="kicker">{article.category}</p><h3><Link href={`/article/${article.slug}`}>{article.title}</Link></h3>{article.excerpt && <p className="excerpt">{article.excerpt}</p>}</div>
          </article>
        ))}</div> : <div className="empty-state"><h3>এই বিভাগে এখনো প্রকাশিত সংবাদ পাওয়া যায়নি</h3><p>নিউজরুমে নতুন প্রতিবেদন প্রকাশ হলে এই পৃষ্ঠায় স্বয়ংক্রিয়ভাবে যুক্ত হবে।</p></div>}
      </main>
    </>
  );
}
