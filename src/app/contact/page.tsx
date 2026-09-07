import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "যোগাযোগ", description: "দৈনিক জাহানের সম্পাদকীয় ও প্রকাশনা যোগাযোগের তথ্য।" };

export default function ContactPage() {
  return <><SiteHeader /><main className="container article-page"><article><p className="kicker">যোগাযোগ</p><h1 className="article-title">দৈনিক জাহানের সঙ্গে যোগাযোগ</h1><p className="article-deck">সংবাদ, নথি, সংশোধন, অধিকার সংরক্ষণ বা সম্পাদকীয় বিষয়ে যোগাযোগ করতে নিচের ঠিকানায় যোগাযোগ করুন।</p><div className="article-content"><p><strong>প্রকাশনা কার্যালয়:</strong> জাহান গ্রুপ অব প্রিন্টিং এন্ড পাবলিকেশন্স লিঃ, প্লট নং-বি/৫, বিসিক শিল্পনগরী, ময়মনসিংহ।</p><p><strong>মোবাইল/WhatsApp:</strong> ০১৮৮৬১৭০৮১৪</p><p><strong>ইমেইল:</strong> dainikjahan@gmail.com</p></div></article></main></>;
}
