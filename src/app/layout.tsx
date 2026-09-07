import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://dainikjahan.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "দৈনিক জাহান | সত্যের সন্ধানে প্রতিদিন",
    template: "%s | দৈনিক জাহান",
  },
  description: "দৈনিক জাহান, সত্য, তথ্য ও জনস্বার্থের সংবাদ। জাতীয়, ময়মনসিংহ, রাজনীতি, আন্তর্জাতিক, অর্থনীতি, শিক্ষা, স্বাস্থ্য ও খেলাধুলার সর্বশেষ খবর।",
  applicationName: "দৈনিক জাহান",
  generator: "Next.js",
  keywords: ["দৈনিক জাহান", "বাংলাদেশ সংবাদ", "ময়মনসিংহ সংবাদ", "জাতীয় সংবাদ", "বাংলা নিউজ"],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: siteUrl,
    siteName: "দৈনিক জাহান",
    title: "দৈনিক জাহান | সত্যের সন্ধানে প্রতিদিন",
    description: "সত্য, তথ্য ও জনস্বার্থের সংবাদ।",
  },
  twitter: {
    card: "summary_large_image",
    title: "দৈনিক জাহান | সত্যের সন্ধানে প্রতিদিন",
    description: "সত্য, তথ্য ও জনস্বার্থের সংবাদ।",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn-BD">
      <body>{children}</body>
    </html>
  );
}
