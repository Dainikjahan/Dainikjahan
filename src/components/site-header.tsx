import Link from "next/link";
import { siteConfig } from "@/lib/site";

const ORIGINAL_LOGO = "https://www.dainikjahan.com/wp-content/uploads/2026/02/cropped-cropped-Gemini_Generated_Image_cs4zjycs4zjycs4z.png";

export function SiteHeader() {
  const today = new Intl.DateTimeFormat(siteConfig.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return (
    <header className="site-header">
      <div className="container">
        <div className="topline"><div>{today}</div><div className="topline-right"><span>ময়মনসিংহ</span><span>ঢাকা</span><span>সারাদেশ</span><span>আবহাওয়া</span></div></div>
        <div className="masthead">
          <div className="masthead-side masthead-side-left"><span className="edition-badge">ডিজিটাল সংস্করণ</span><span>সত্যের সন্ধানে প্রতিদিন</span></div>
          <Link className="brand-lockup" href="/" aria-label={`${siteConfig.name} প্রচ্ছদ`}><img className="brand-logo" src={ORIGINAL_LOGO} alt="দৈনিক জাহান" /></Link>
          <div className="masthead-side masthead-side-right"><Link href="/search" className="header-action">খুঁজুন <span aria-hidden="true">⌕</span></Link><span>জনস্বার্থে সংবাদ</span></div>
        </div>
        <div className="mobile-brand-row"><div className="round-logo" aria-hidden="true"><img src={ORIGINAL_LOGO} alt="" style={{ width: "52px", height: "52px", objectFit: "contain" }} /></div><div><strong>দৈনিক জাহান</strong><small>সত্যের সন্ধানে প্রতিদিন</small></div></div>
        <nav className="nav" aria-label="প্রধান নেভিগেশন">
          <Link className="home-link" href="/" aria-label="প্রচ্ছদ">⌂</Link>
          {siteConfig.navigation.filter((item) => item.href !== "/").slice(0, 8).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          <Link href="/category/special-report">বিশেষ প্রতিবেদন</Link><Link href="/category/opinion">মতামত</Link><Link href="/latest">সর্বশেষ</Link>
        </nav>
      </div>
    </header>
  );
}
