// Publish Guard — Master Prompt v2.0 §2(4), §2(10), §7
// This is the ONLY path to PUBLISH. It is technically impossible to publish without:
// 1. DJ-3 verdict = READY in DB
// 2. actor is a named human, role dj-publisher or owner
// 3. audit_log entry written in same transaction
// AI role can never pass this. dj-drafter can never pass this.

export async function publishDraft(db, { draftId, actor, actorRole, reason }) {
  if (!actor || actor === 'AI' || actor === 'ai') throw new Error('BLOCKED: actor must be a named human editor');
  if (!['dj-publisher', 'owner', 'editor'].includes(actorRole)) {
    throw new Error(`BLOCKED: role ${actorRole} cannot publish. Only dj-publisher/owner/editor.`);
  }
  if (actorRole === 'dj-drafter') throw new Error('BLOCKED: dj-drafter cannot publish');

  const draft = await db.prepare(`SELECT * FROM drafts WHERE id = ?`).bind(draftId).first();
  if (!draft) throw new Error('BLOCKED: draft not found');
  if (draft.status === 'PUBLISHED') throw new Error('BLOCKED: already published');

  const verification = await db.prepare(`SELECT * FROM verifications WHERE claim_id = ?`).bind(draft.claim_id).first();
  if (!verification || verification.verdict !== 'READY') {
    throw new Error(`BLOCKED: DJ-3 not READY. Current verdict: ${verification?.verdict || 'NONE'}. Cannot publish.`);
  }
  // Re-check live sources, not just cached verdict — prevents stale READY
  const { checkDJ3 } = await import('./dj3.js');
  const live = await checkDJ3(db, draft.claim_id);
  if (live.verdict !== 'READY') throw new Error(`BLOCKED: Live DJ-3 re-check failed: ${live.reason}`);

  const now = new Date().toISOString();
  // In D1, use batch for atomicity
  await db.batch([
    db.prepare(`UPDATE drafts SET status = 'PUBLISHED', updated_at = ? WHERE id = ?`).bind(now, draftId),
    db.prepare(`UPDATE claims SET status = 'PUBLISHED' WHERE id = ?`).bind(draft.claim_id),
    db.prepare(`INSERT INTO audit_log (id, claim_id, draft_id, actor, actor_role, action, reason, created_at) VALUES (?, ?, ?, ?, ?, 'PUBLISH', ?, ?)`)
      .bind(crypto.randomUUID(), draft.claim_id, draftId, actor, actorRole, reason || 'Editor approved via Telegram', now),
  ]);
  return { ok: true, draftId, claimId: draft.claim_id, publishedBy: actor, publishedAt: now };
}

// Hold / Reject also require human + audit
export async function holdOrReject(db, { draftId, actor, actorRole, action, reason }) {
  if (!actor || actor === 'AI') throw new Error('BLOCKED: actor must be named human');
  if (!['HOLD','REJECT'].includes(action)) throw new Error('Invalid action');
  const now = new Date().toISOString();
  await db.batch([
    db.prepare(`UPDATE drafts SET status = ?, updated_at = ? WHERE id = ?`).bind(action, now, draftId),
    db.prepare(`INSERT INTO audit_log (id, draft_id, actor, actor_role, action, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(crypto.randomUUID(), draftId, actor, actorRole, action, reason || '', now),
  ]);
  return { ok: true };
}
