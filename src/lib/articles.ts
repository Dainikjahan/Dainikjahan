import { collection, getDocs, getDoc, orderBy, query, where, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Article } from "@/types/article";

function mapArticle(id: string, data: Record<string, unknown>): Article {
  return { id, ...(data as Omit<Article, "id">) };
}

export async function getPublishedArticles(limitCount = 20): Promise<Article[]> {
  const articlesQuery = query(
    collection(db, "articles"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
  );

  const snapshot = await getDocs(articlesQuery);
  return snapshot.docs.slice(0, limitCount).map((item) => mapArticle(item.id, item.data()));
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  const articlesQuery = query(
    collection(db, "articles"),
    where("slug", "==", slug),
    where("status", "==", "published"),
  );

  const snapshot = await getDocs(articlesQuery);
  const item = snapshot.docs[0];
  return item ? mapArticle(item.id, item.data()) : null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const snapshot = await getDoc(doc(db, "articles", id));
  return snapshot.exists() ? mapArticle(snapshot.id, snapshot.data()) : null;
}
