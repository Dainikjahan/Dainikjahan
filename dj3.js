// DJ-3 Gate — Master Prompt v2.0 §2(4) + §6
// Publish ONLY if >=3 independent sources (distinct domain + publisher) + at least 1 primary/official/document OR 2 reputable media.
// Otherwise HOLD. Never silently delete, never auto-publish.

export async function checkDJ3(db, claimId) {
  const rows = await db.prepare(`SELECT domain, publisher, source_kind FROM sources WHERE claim_id = ?`).bind(claimId).all();
  const sources = rows.results || [];
  const domains = new Set(sources.map(s => (s.domain || '').toLowerCase().trim()));
  const publishers = new Set(sources.map(s => (s.publisher || '').toLowerCase().trim()));
  const hasPrimary = sources.some(s => ['primary','official','document'].includes(s.source_kind));
  const reputableCount = sources.filter(s => s.source_kind === 'reputable_media').length;
  const passes = domains.size >= 3 && publishers.size >= 3 && (hasPrimary || reputableCount >= 2);
  const verdict = passes ? 'READY' : 'HOLD';
  const reason = passes
    ? `DJ-3 passed: ${sources.length} sources, ${domains.size} domains`
    : `DJ-3 HOLD: need 3 independent domains/publishers + primary. Got ${sources.length} sources, ${domains.size} domains, hasPrimary=${hasPrimary}`;
  return { sourceCount: sources.length, independentDomains: domains.size, independentPublishers: publishers.size, hasPrimary, verdict, reason };
}

export async function recordVerification(db, claimId, check, verifiedBy) {
  if (!verifiedBy || verifiedBy === 'AI') throw new Error('verified_by must be a named human editor');
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO verifications (claim_id, source_count, independent_publishers, has_primary, verdict, reason, verified_by, verified_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(claim_id) DO UPDATE SET source_count=excluded.source_count, independent_publishers=excluded.independent_publishers, has_primary=excluded.has_primary, verdict=excluded.verdict, reason=excluded.reason, verified_by=excluded.verified_by, verified_at=excluded.verified_at, updated_at=excluded.updated_at`
  ).bind(claimId, check.sourceCount, check.independentPublishers, check.hasPrimary ? 1 : 0, check.verdict, check.reason, verifiedBy, now, now).run();
  await db.prepare(`UPDATE claims SET status = ? WHERE id = ?`).bind(check.verdict, claimId).run();
  return check;
}
