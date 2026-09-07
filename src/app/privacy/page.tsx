import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "গোপনীয়তা নীতি", description: "দৈনিক জাহানের গোপনীয়তা ও কুকি নীতি।" };

export default function PrivacyPage() {
  return <><SiteHeader /><main className="container article-page"><article><p className="kicker">নীতি</p><h1 className="article-title">গোপনীয়তা নীতি</h1><div className="article-content"><p>দৈনিক জাহান পাঠকের গোপনীয়তাকে সম্মান করে। ওয়েবসাইটের কার্যকারিতা, নিরাপত্তা, পরিসংখ্যান এবং বৈধ বিজ্ঞাপনসেবার প্রয়োজন অনুযায়ী সীমিত প্রযুক্তিগত তথ্য ব্যবহার করা হতে পারে।</p><p>তৃতীয় পক্ষের বিজ্ঞাপন বা বিশ্লেষণ সেবা ব্যবহার করা হলে তাদের নিজস্ব নীতি প্রযোজ্য হতে পারে। আমরা পাঠকের ব্যক্তিগত তথ্য বিক্রি করার উদ্দেশ্যে সংগ্রহ করি না।</p><p>এই নীতি সাইটের প্রযুক্তিগত পরিবর্তন, নতুন সেবা বা প্রযোজ্য আইন অনুযায়ী সময় সময় হালনাগাদ করা হতে পারে।</p></div></article></main></>;
}
