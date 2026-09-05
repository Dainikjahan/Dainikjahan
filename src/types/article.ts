export const ARTICLE_STATUSES = ["draft", "review", "published", "archived"] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  authorId?: string;
  authorName?: string;
  featuredImageUrl?: string;
  status: ArticleStatus;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
}
