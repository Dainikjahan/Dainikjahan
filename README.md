# Dainik Jahan — Phase 1 Starter Kit (Staging Only)

Master Prompt v2.0 is the constitution. This kit implements it in code, not in promises.

## What this is
- schema.sql — D1 tables for ingestion, claims, sources, DJ-3 verifications, drafts, audit_log
- src/dj3.js — DJ-3 gate: COUNT query in code. Publish only if 3 independent domains/publishers + primary.
- src/ingestion.js — Capture everything, dedup by SHA-256, default HOLD, never publish, RSS is tip only.
- src/seo.js — Single-source NewsArticle JSON-LD, SEO validation at publish, news-sitemap entry builder.
- src/telegram.js — Editor card: green/yellow/red claim list, sources, Publish/Hold/Reject/Edit.
- wrangler.toml — Staging Worker, D1, Queue, 5-min cron.

## What this is NOT
- No live change. No DNS change. No theme/plugin change. No auto-publish.
- No AI image/video. Image is NULL unless camera/permitted source.
- No password/token in repo. Secrets via wrangler secret put only.
- No ranking guarantee. SEO is code-bound checks, not #1 promise.

## How to use (owner, Level 2 for any live step)
1. wrangler d1 create dainik-jahan-staging → put ID in wrangler.toml
2. wrangler d1 execute dainik-jahan-staging --file=schema.sql
3. Deploy to staging subdomain only
4. Test DJ-3: 1 source → HOLD, 3 independent → READY, publish still requires named human + dj-publisher tap.
5. Only after owner written approval: point production, migrate, set Cloudflare DNS.

## Acceptance (§16)
- Every tip appears in HOLD, never silently dropped.
- DJ-3 COUNT query blocks publish when <3 independent.
- JSON-LD validates, datePublished/dateModified handled, single NewsArticle per page.
- Telegram card shows sources and buttons, publish writes audit_log.

## Two clarifications on your last instruction
- No news missed = capture all into HOLD + DJ-3, not auto-publish all. Unverified stays HOLD.
- Strongest SEO every second = SEO tasks forced in code at publish + 5-min ingestion + sitemap regen + cache purge/warm + IndexNow, not literal per-second polling and not a #1 ranking guarantee. Google spam policy forbids scaled auto-publish, so volume is capped by human verification.
