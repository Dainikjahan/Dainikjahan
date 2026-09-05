const navItems = [
  "প্রচ্ছদ",
  "জাতীয়",
  "রাজনীতি",
  "আন্তর্জাতিক",
  "ময়মনসিংহ",
  "অর্থনীতি",
  "শিক্ষা",
  "স্বাস্থ্য",
  "খেলা",
  "সংস্কৃতি",
];

export default function Home() {
  const today = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="topline">{today}</div>
          <div className="masthead">
            <h1>দৈনিক জাহান</h1>
            <p>সত্য, তথ্য ও জনস্বার্থের সংবাদ</p>
          </div>
          <nav className="nav" aria-label="প্রধান নেভিগেশন">
            {navItems.map((item) => (
              <a href="#" key={item}>
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="container">
        <h2 className="section-label">সর্বশেষ সংবাদ</h2>

        <section className="hero" aria-label="প্রধান সংবাদ">
          <article className="hero-card">
            <div className="placeholder">প্রধান প্রতিবেদনের ছবি</div>
            <p className="kicker">প্রধান সংবাদ</p>
            <h2>দৈনিক জাহানের নতুন ডিজিটাল নিউজরুমের ভিত্তি তৈরি হচ্ছে</h2>
            <p className="muted">
              এই অংশটি প্রকৃত সম্পাদকীয় কনটেন্ট ও যাচাইকৃত সংবাদ দিয়ে প্রতিস্থাপিত হবে।
            </p>
          </article>

          <div>
            <article className="side-card">
              <p className="kicker">জাতীয়</p>
              <h3>যাচাইকৃত সংবাদ প্রকাশের জন্য নতুন কাঠামো প্রস্তুত</h3>
            </article>
            <article className="side-card">
              <p className="kicker">ময়মনসিংহ</p>
              <h3>স্থানীয় সংবাদকে অগ্রাধিকার দিয়ে আর্কাইভ গড়ে তোলা হবে</h3>
            </article>
            <article className="side-card">
              <p className="kicker">বিশেষ প্রতিবেদন</p>
              <h3>তথ্য, অনুসন্ধান ও সম্পাদকীয় যাচাই থাকবে নিউজরুমের কেন্দ্রে</h3>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
