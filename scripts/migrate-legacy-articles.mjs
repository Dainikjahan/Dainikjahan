import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const SOURCE = process.env.LEGACY_SOURCE_URL || "https://www.dainikjahan.com";
const SITE_URL = process.env.SITE_URL || "https://dainikjahan.com";
const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const DRY_RUN = process.env.DRY_RUN === "true";
const AUTHOR_NAMES = ["শেখ মেহেদী হাসান নাদিম", "শেখ মেহেদী হাসান নাদিম ", "শেখ নাদিম", "Mehedi Hasan Nadim"];

if (!SERVICE_ACCOUNT && !DRY_RUN) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is required unless DRY_RUN=true");

const wp = async (path, params = {}) => {
  const url = new URL(`${SOURCE}/wp-json/wp/v2/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`WordPress API ${response.status}: ${url}`);
  return { data: await response.json(), headers: response.headers };
};

const decode = (text) => text.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;|&#039;/g, "'").replace(/&#8220;|&#8221;/g, '"').replace(/\s+/g, " ").trim();
const slugId = (slug) => `legacy_${slug.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120)}`;

let db;
if (!DRY_RUN) {
  const credentials = JSON.parse(SERVICE_ACCOUNT);
  const app = getApps()[0] || initializeApp({ credential: cert(credentials) });
  db = getFirestore(app);
}

async function discoverAuthorIds() {
  const ids = new Set();
  for (const name of AUTHOR_NAMES) {
    const { data } = await wp("users", { search: name, per_page: 100 });
    for (const user of data) if (AUTHOR_NAMES.some((n) => String(user.name || "").toLowerCase().includes(n.toLowerCase()))) ids.add(user.id);
  }
  return [...ids];
}

async function fetchPosts(authorId) {
  const posts = [];
  for (let page = 1; page <= 100; page++) {
    const { data, headers } = await wp("posts", { author: authorId, per_page: 100, page, _embed: true, orderby: "date", order: "asc", status: "publish" });
    posts.push(...data);
    if (data.length < 100 || Number(headers.get("x-wp-totalpages") || 1) <= page) break;
  }
  return posts;
}

const authorIds = await discoverAuthorIds();
if (!authorIds.length) throw new Error("Could not find the legacy WordPress author. Set AUTHOR_ID manually after checking /wp-json/wp/v2/users.");

const unique = new Map();
for (const authorId of authorIds) for (const post of await fetchPosts(authorId)) unique.set(post.id, post);

console.log(`Found ${unique.size} authored legacy articles.`);
let imported = 0;

for (const post of unique.values()) {
  const authorName = post?._embedded?.author?.[0]?.name || "শেখ মেহেদী হাসান নাদিম";
  const category = post?._embedded?.["wp:term"]?.flat()?.find((term) => term.taxonomy === "category" && term.name !== "Uncategorized")?.name || "সর্বশেষ";
  const featured = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const originalUrl = post.link;
  const canonicalUrl = `${SITE_URL}/${post.slug}`;
  const content = decode(post.content?.rendered || "");
  const excerpt = decode(post.excerpt?.rendered || "");
  const record = {
    id: slugId(post.slug), slug: post.slug, title: decode(post.title?.rendered || ""), excerpt,
    content, category, authorName, featuredImageUrl: featured || null, status: "published",
    publishedAt: post.date_gmt ? new Date(`${post.date_gmt}Z`).toISOString() : new Date(post.date).toISOString(),
    updatedAt: post.modified_gmt ? new Date(`${post.modified_gmt}Z`).toISOString() : new Date(post.modified).toISOString(),
    createdAt: post.date_gmt ? new Date(`${post.date_gmt}Z`).toISOString() : new Date(post.date).toISOString(),
    tags: [], seoTitle: decode(post.title?.rendered || ""), seoDescription: excerpt.slice(0, 155),
    originalUrl, canonicalUrl, legacyUrl: new URL(originalUrl).pathname, source: "dainikjahan.com", importedAt: new Date().toISOString(),
  };
  if (DRY_RUN) { console.log(JSON.stringify({ slug: record.slug, title: record.title, originalUrl }, null, 2)); continue; }
  await db.collection("articles").doc(record.id).set({ ...record, migratedAt: FieldValue.serverTimestamp() }, { merge: true });
  imported++;
}

console.log(DRY_RUN ? "Dry run complete." : `Imported/updated ${imported} articles into Firestore.`);
