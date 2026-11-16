-- Migration 0003 — Source independence + Telegram replay protection (Fix 1/2/3)
-- Sources now carry ownership / syndication so DJ-3 cannot be gamed by domain count alone.
ALTER TABLE sources ADD COLUMN owner_group TEXT;
ALTER TABLE sources ADD COLUMN syndication_id TEXT;
ALTER TABLE sources ADD COLUMN canonical_original_url TEXT;
CREATE INDEX IF NOT EXISTS idx_sources_owner ON sources(owner_group);
CREATE INDEX IF NOT EXISTS idx_sources_synd ON sources(syndication_id);

-- Replay / idempotency guard for Telegram publish
CREATE TABLE IF NOT EXISTS telegram_nonces (
  idempotency_key TEXT PRIMARY KEY,
  telegram_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_nonces_user ON telegram_nonces(telegram_user_id);
