# TEMPORARY DEPLOY — ukaiacademy.org

TARGET: https://dj-staging.ukaiacademy.org
NOT: https://ukaiacademy.org (root — DO NOT TOUCH)
NOT: https://dainikjahan.com (production — BLOCKED)

## Why subdomain, not root?
- ukaiacademy.org homepage stays live for academy students.
- dj-staging.ukaiacademy.org is isolated, can be deleted any time.
- No SEO confusion, no redirect risk, no WordPress break.

## Steps — 10 minutes, cost 0

1. Cloudflare Dashboard > ukaiacademy.org > DNS > Add record
   Type: CNAME
   Name: dj-staging
   Target: dainik-jahan-phase1-staging.<your-subdomain>.workers.dev
   Proxy: Proxied (orange cloud ON)

   If ukaiacademy.org is NOT yet on Cloudflare, add it as a site first (Free plan).
   Do NOT change existing A / MX / TXT records.

2. In your local dj repo:
   Replace REPLACE_WITH_STAGING_D1_ID in wrangler.toml with staging D1 id
   (from `wrangler d1 list` — use dainik-jahan-staging, NOT production)

3. Deploy:
   wrangler deploy --env staging

4. Verify:
   - https://dj-staging.ukaiacademy.org/health  -> should return ok / staging
   - Cloudflare > Workers > dainik-jahan-phase1-staging > Custom Domains shows dj-staging.ukaiacademy.org as Active

5. Rollback / removal (any time):
   - Workers > dainik-jahan-phase1-staging > Delete Worker
   - DNS > Delete dj-staging CNAME
   - Root ukaiacademy.org is untouched.

## Secrets — staging only
   wrangler secret put DJ_TELEGRAM_BOT_TOKEN --env staging
   wrangler secret put DJ_EDITORS_JSON --env staging
   wrangler secret put WP_APP_USER --env staging
   wrangler secret put WP_APP_PASSWORD --env staging

Never put production secrets in staging.
