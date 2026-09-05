import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const today = new Intl.DateTimeFormat(siteConfig.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="site-header">
      <div className="container">
        <div className="topline">
          <span>{today}</span>
        </div>

        <div className="masthead">
          <Link href="/" aria-label={`${siteConfig.name} প্রচ্ছদ`}>
            <h1>{siteConfig.name}</h1>
          </Link>
          <p>{siteConfig.description}</p>
        </div>

        <nav className="nav" aria-label="প্রধান নেভিগেশন">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
