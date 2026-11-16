# GitHub -> Cloudflare — Temporary Deploy on ukaiacademy.org
TARGET: https://dj-staging.ukaiacademy.org
FLOW: Local -> GitHub (staging branch) -> GitHub Actions -> Cloudflare Worker

## 1. Cloudflare — Create API Token (once)
Dashboard > My Profile > API Tokens > Create Token > Use template: Edit Cloudflare Workers
Permissions needed:
- Account / Workers Scripts / Edit
- Account / D1 / Edit
- Zone / DNS / Edit (for ukaiacademy.org zone, for custom domain)
- Zone / Workers Routes / Edit
Account Resources: Include your account
Zone Resources: Include ukaiacademy.org
Copy token once — you will NOT see it again.

Find Account ID: Dashboard > Account Home > right sidebar > Account ID. Copy it.

## 2. GitHub — Add Secrets (once)
Repo dj > Settings > Secrets and variables > Actions > New repository secret
- Name: CLOUDFLARE_API_TOKEN | Value: token from step 1
- Name: CLOUDFLARE_ACCOUNT_ID | Value: account ID from step 1
Never put these in code, never in wrangler.toml.

## 3. Cloudflare — DNS for staging subdomain (once)
Dashboard > ukaiacademy.org > DNS > Add record
Type: CNAME | Name: dj-staging | Target: dainik-jahan-phase1-staging.<your-subdomain>.workers.dev | Proxy: ON (orange)
Do NOT touch root ukaiacademy.org records.

## 4. Cloudflare — Create Staging D1 (once, in Dashboard or CLI)
Dashboard > Storage > D1 > Create > Name: dainik-jahan-staging
Copy Database ID -> put in wrangler.toml where it says REPLACE_WITH_STAGING_D1_ID (both places)

## 5. Local -> GitHub
git checkout -b staging
git add .
git commit -m "staging: ukaiacademy temp deploy"
git push origin staging

## 6. Watch GitHub Actions
Repo > Actions > latest run
- test job must be green (11/11 pass)
- deploy job runs D1 migrations then `deploy --env staging`
If test fails, deploy will NOT run — this is intentional.

## 7. Verify on Cloudflare
Workers & Pages > dainik-jahan-phase1-staging > Custom Domains shows dj-staging.ukaiacademy.org Active
Visit https://dj-staging.ukaiacademy.org — should load staging, NOT academy homepage.
Visit https://ukaiacademy.org — must still be academy homepage.

## 8. Worker Secrets (staging only, in Cloudflare Dashboard)
Workers > dainik-jahan-phase1-staging > Settings > Variables > Add secret
DJ_TELEGRAM_BOT_TOKEN, DJ_EDITORS_JSON, WP_APP_USER, WP_APP_PASSWORD
These are NOT in GitHub Secrets for deploy — they live only in Cloudflare Worker secrets.

## Rollback
GitHub: nothing to revert for Worker delete.
Cloudflare: Workers > Delete dainik-jahan-phase1-staging + DNS > Delete dj-staging CNAME.
