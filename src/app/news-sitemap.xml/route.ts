import { getPublishedArticles } from "@/lib/articles";

const siteUrl = "https://dainikjahan.com";
const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
export const revalidate = 900;

export async function GET() {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const articles = (await getPublishedArticles(500)).filter((article) => {
    const published = article.publishedAt ? Date.parse(article.publishedAt) : NaN;
    return Number.isFinite(published) && published >= cutoff;
  });
  const items = articles.map((article) => {
    const published = new Date(article.publishedAt as string).toISOString();
    const image = article.featuredImageUrl ? `<image:image><image:loc>${escapeXml(article.featuredImageUrl)}</image:loc><image:caption>${escapeXml(article.title)}</image:caption></image:image>` : "";
    return `<url><loc>${siteUrl}/${encodeURIComponent(article.slug)}</loc><news:news><news:publication><news:name>দৈনিক জাহান</news:name><news:language>bn</news:language></news:publication><news:publication_date>${published}</news:publication_date><news:title>${escapeXml(article.title)}</news:title></news:news>${image}</url>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${items}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
}
