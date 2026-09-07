import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "আমাদের সম্পর্কে", description: "দৈনিক জাহানের পরিচয়, সম্পাদকীয় নীতি ও প্রকাশনা তথ্য।" };

export default function AboutPage() {
  return <><SiteHeader /><main className="container article-page"><article><p className="kicker">দৈনিক জাহান</p><h1 className="article-title">আমাদের সম্পর্কে</h1><p className="article-deck">সত্যের সন্ধানে প্রতিদিন, জনস্বার্থের তথ্যকে সহজ, দ্রুত ও দায়িত্বশীলভাবে পাঠকের কাছে পৌঁছে দেওয়াই দৈনিক জাহানের লক্ষ্য।</p><div className="article-content"><p>দৈনিক জাহান ময়মনসিংহভিত্তিক একটি সংবাদমাধ্যম। জাতীয় ও স্থানীয় সংবাদ, অনুসন্ধান, মতামত, অর্থনীতি, শিক্ষা, স্বাস্থ্য, আন্তর্জাতিক ও খেলাধুলার খবর প্রকাশ করে।</p><p>প্রকাশক: শেখ মেহেদী হাসান নাদিম। প্রতিষ্ঠাতা: হাবিবুর রহমান শেখ। সম্পাদকীয় পর্ষদ ও প্রকাশনা-সংক্রান্ত তথ্য পাঠকের স্বচ্ছতার জন্য প্রকাশ্য রাখা হবে।</p></div></article></main></>;
}
