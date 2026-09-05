import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const sections = [
  {
    category: "জাতীয়",
    title: "যাচাইকৃত সংবাদ প্রকাশের জন্য নতুন কাঠামো প্রস্তুত",
    href: "/category/national",
  },
  {
    category: "ময়মনসিংহ",
    title: "স্থানীয় সংবাদকে অগ্রাধিকার দিয়ে আর্কাইভ গড়ে তোলা হবে",
    href: "/category/mymensingh",
  },
  {
    category: "বিশেষ প্রতিবেদন",
    title: "তথ্য, অনুসন্ধান ও সম্পাদকীয় যাচাই থাকবে নিউজরুমের কেন্দ্রে",
    href: "/category/special-report",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="container">
        <h2 className="section-label">সর্বশেষ সংবাদ</h2>

        <section className="hero" aria-label="প্রধান সংবাদ">
          <article className="hero-card">
            <div className="placeholder" aria-hidden="true">
              প্রধান প্রতিবেদনের ছবি
            </div>
            <p className="kicker">প্রধান সংবাদ</p>
            <h2>দৈনিক জাহানের নতুন ডিজিটাল নিউজরুমের ভিত্তি তৈরি হচ্ছে</h2>
            <p className="muted">
              এই ডেমো কনটেন্টটি প্রকাশিত সংবাদ নয়। প্রকৃত সম্পাদকীয় কনটেন্ট ও
              যাচাইকৃত সংবাদ কনটেন্ট সিস্টেম যুক্ত হওয়ার পর এখানে প্রদর্শিত হবে।
            </p>
          </article>

          <div>
            {sections.map((item) => (
              <article className="side-card" key={item.href}>
                <p className="kicker">{item.category}</p>
                <h3>
                  <Link href={item.href}>{item.title}</Link>
                </h3>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
