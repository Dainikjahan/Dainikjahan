// SEO Template — v2.0 §11
// Single source of truth: WordPress post -> JSON-LD. No second source, no duplicate markup.
// Enforces editor title/description, datePublished/dateModified, author Person, publisher Org.
// Does NOT guarantee ranking. Guarantees code-bound checks at publish.

export function buildNewsArticleLD({ title, description, slug, canonicalUrl, imageUrl, imageCredit, authorName, authorUrl, datePublished, dateModified, section, keywords }) {
  if (!title || !description || !slug || !canonicalUrl || !datePublished) throw new Error('Missing required SEO fields');
  if (!authorName) throw new Error('Author required — no anonymous publish');
  const ld = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description,
    "url": canonicalUrl,
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "inLanguage": "bn",
    "isAccessibleForFree": true,
    "articleSection": section || "বাংলাদেশ",
    "keywords": keywords || "",
    "author": { "@type": "Person", "name": authorName, "url": authorUrl || undefined },
    "publisher": {
      "@type": "Organization",
      "name": "দৈনিক জাহান",
      "url": "https://www.dainikjahan.com",
      "logo": { "@type": "ImageObject", "url": "https://www.dainikjahan.com/wp-content/uploads/logo.png" }
    },
    "citation": []
  };
  if (imageUrl) {
    ld.image = [{ "@type": "ImageObject", "url": imageUrl, "creditText": imageCredit || "" }];
  }
  return ld;
}

export function validateSeoBeforePublish(draft, ld) {
  const errors = [];
  if (!draft.title || draft.title.length < 10) errors.push('Title too short');
  if (!draft.seo_description || draft.seo_description.length < 50) errors.push('Meta description too short (<50)');
  if (!draft.seo_description || draft.seo_description.length > 160) errors.push('Meta description too long (>160)');
  if (!ld.datePublished) errors.push('datePublished missing');
  return { ok: errors.length === 0, errors };
}

export function buildNewsSitemapEntry({ loc, title, publicationDate, language = 'bn' }) {
  return `  <url><loc>${loc}</loc><news:news><news:publication><news:name>দৈনিক জাহান</news:name><news:language>${language}</news:language></news:publication><news:publication_date>${publicationDate}</news:publication_date><news:title>${title}</news:title></news:news></url>`;
}
