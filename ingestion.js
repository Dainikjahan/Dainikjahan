// Ingestion Worker Skeleton — v2.0 §5 + §6
// Capture EVERY tip / RSS / citizen submission. Never drop silently.
// Deduplicate by SHA-256(title + canonical url). RSS is TIP only, never copy full text.
// Default status HOLD. No publish path in this worker.

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('');
}

export function normalizeForDedup(title, url) {
  return (title||'').trim().toLowerCase().replace(/\s+/g,' ') + '|' + (url||'').trim().toLowerCase().replace(/\/$/,'');
}

export async function ingestItem(db, { sourceType, sourceUrl, sourcePublisher, title, rawBody, district, newsType }) {
  const dedupHash = await sha256Hex(normalizeForDedup(title, sourceUrl));
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  try {
    await db.prepare(
      `INSERT INTO ingestion_items (id, dedup_hash, source_type, source_url, source_publisher, title, raw_body, district, news_type, captured_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'HOLD')`
    ).bind(id, dedupHash, sourceType, sourceUrl, sourcePublisher, title, rawBody||'', district||'', newsType||'', now).run();
  } catch (e) {
    if (String(e.message||'').includes('UNIQUE')) return { deduped: true, dedupHash };
    throw e;
  }
  const claimId = crypto.randomUUID();
  await db.prepare(`INSERT INTO claims (id, ingestion_id, claim_text, district, news_type, created_at, status) VALUES (?, ?, ?, ?, ?, ?, 'HOLD')`)
    .bind(claimId, id, title, district||'', newsType||'', now).run();
  return { deduped: false, id, claimId, dedupHash };
}
