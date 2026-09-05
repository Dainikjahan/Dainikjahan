import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Article } from "@/types/article";

export async function getPublishedArticles(limitCount = 20): Promise<Article[]> {
  const articlesQuery = query(
    collection(db, "articles"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
  );

  const snapshot = await getDocs(articlesQuery);
  return snapshot.docs.slice(0, limitCount).map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Article, "id">),
  }));
}
