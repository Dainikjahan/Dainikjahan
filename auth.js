// Auth — Telegram + Worker auth, v2.0 §7 + §8
// Telegram callback must be verified. No anonymous publish.
// Allowed editors are allowlisted by Telegram user ID + role in ENV, never in code.

export function verifyTelegramCallback({ callbackData, telegramUserId, allowlist }) {
  // allowlist: Map<telegramUserId, { name, role }>
  // Example ENV: DJ_EDITORS_JSON = '{"123456":{"name":"Sheikh Mehedi Hasan Nadim","role":"owner"}}'
  const editor = allowlist?.[String(telegramUserId)];
  if (!editor) throw new Error('BLOCKED: Telegram user not in editor allowlist');
  if (!editor.name || editor.name === 'AI') throw new Error('BLOCKED: editor must be named human');
  return editor;
}

export function requireRole(editor, allowedRoles) {
  if (!allowedRoles.includes(editor.role)) {
    throw new Error(`BLOCKED: role ${editor.role} not allowed. Need ${allowedRoles.join('/')}`);
  }
  return true;
}

// Worker secret check for WordPress Application Password flow (never in chat, only in wrangler secret)
// This function only checks presence, never logs the secret.
export function hasWpSecrets(env) {
  return Boolean(env.WP_APP_USER && env.WP_APP_PASSWORD && env.DJ_TELEGRAM_BOT_TOKEN);
}
