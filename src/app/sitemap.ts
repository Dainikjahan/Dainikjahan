import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";

const siteUrl = "https://dainikjahan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles(500);
  const staticPages = ["", "/latest", "/category/national", "/category/politics", "/category/mymensingh", "/category/economy", "/category/international", "/category/sports", "/category/health", "/category/education", "/category/culture", "/category/opinion", "/category/special-report"];
  const pages = staticPages.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: path === "" ? "hourly" as const : "daily" as const, priority: path === "" ? 1 : 0.7 }));
  return [...pages, ...articles.map((article) => ({ url: `${siteUrl}/${article.slug}`, lastModified: article.updatedAt ? new Date(article.updatedAt) : article.publishedAt ? new Date(article.publishedAt) : undefined, changeFrequency: "daily" as const, priority: article.isFeatured ? 0.9 : 0.7 }))];
}
