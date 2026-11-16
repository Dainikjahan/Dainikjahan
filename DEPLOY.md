# Dainik Jahan — Phase 1 — Deployment Checklist (Staging Only)

## 1. D1 Migration — deployable
```bash
wrangler d1 create dainik-jahan-staging
# copy database_id into wrangler.toml
wrangler d1 execute dainik-jahan-staging --file=migrations/0001_init.sql
wrangler d1 execute dainik-jahan-staging --file=migrations/0002_indexes.sql
```

## 2. Cron — deployable
wrangler.toml already has:
[triggers] crons = ["*/5 * * * *"]
This is 5-min ingestion, not per-second. Cloudflare free tier cannot do per-second cron.
Verify in dashboard: Workers > Triggers > Cron shows Next Run.

## 3. Secrets — never in repo
```bash
wrangler secret put DJ_TELEGRAM_BOT_TOKEN
wrangler secret put WP_APP_USER
wrangler secret put WP_APP_PASSWORD
wrangler secret put DJ_EDITORS_JSON
# DJ_EDITORS_JSON example: {"123456":{"name":"Sheikh Mehedi Hasan Nadim","role":"owner"}}
```

## 4. SEO — Google News requirements
- NewsArticle JSON-LD is single source, see src/seo.js
- News sitemap: only articles < 2 days old, max 1000 URLs, title + publication_date + language bn, see src/seo.js buildNewsSitemapEntry
- Publisher name must match Google News: দৈনিক জাহান
- datePublished is original publish time, dateModified only on real edit
- No AI image: image_url is NULL unless camera/permitted source + credit
- Validate: Google Rich Results Test + News sitemap in Search Console, before any prod claim

## 5. Telegram auth
- Bot token in secret, not in code
- Callback checks Telegram user ID against DJ_EDITORS_JSON allowlist, src/auth.js
- Publish requires dj-publisher/owner role + DJ-3 READY + audit_log, src/publish.js
- dj-drafter and AI are technically blocked, proven by test/dj3.test.mjs

## 6. Tests — run before deploy
```bash
npm test
# Must pass: HOLD with 1 source, HOLD with same domain, READY with 3 independent, BLOCKED for dj-drafter, BLOCKED for AI, BLOCKED when DJ-3 HOLD
```

## 7. No live change
Do NOT point wrangler.toml at production, do NOT change DNS, theme, or plugins until owner Level-2 written approval.
