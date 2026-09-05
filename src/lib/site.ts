export const siteConfig = {
  name: "দৈনিক জাহান",
  shortName: "জাহান",
  description: "সত্য, তথ্য ও জনস্বার্থের সংবাদ",
  url: "https://dainikjahan.com",
  locale: "bn-BD",
  language: "bn",
  navigation: [
    { label: "প্রচ্ছদ", href: "/" },
    { label: "জাতীয়", href: "/category/national" },
    { label: "রাজনীতি", href: "/category/politics" },
    { label: "আন্তর্জাতিক", href: "/category/international" },
    { label: "ময়মনসিংহ", href: "/category/mymensingh" },
    { label: "অর্থনীতি", href: "/category/economy" },
    { label: "শিক্ষা", href: "/category/education" },
    { label: "স্বাস্থ্য", href: "/category/health" },
    { label: "খেলা", href: "/category/sports" },
    { label: "সংস্কৃতি", href: "/category/culture" },
  ],
} as const;

export type NavigationItem = (typeof siteConfig.navigation)[number];
