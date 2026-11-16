// Telegram Editor Card — v2.0 §7
// Editor-only. Card shows claim list green/yellow/red, sources, buttons.
// Publish requires dj-publisher role + DJ-3 READY. This file only renders card.

export function renderEditorCard({ draft, claim, sources, verification }) {
  const green = sources.filter(s => ['primary','official','document'].includes(s.source_kind));
  const yellow = sources.filter(s => s.source_kind === 'reputable_media');
  const red = sources.filter(s => s.source_kind === 'eyewitness_verified');
  const lines = [];
  lines.push(`📰 *${draft.title}*`);
  lines.push(`Claim: ${claim.claim_text}`);
  lines.push(`District: ${claim.district||'-'} | Type: ${claim.news_type||'-'}`);
  lines.push(`DJ-3: *${verification?.verdict||'HOLD'}* — ${verification?.reason||'Not verified'}`);
  lines.push(``);
  lines.push(`🟢 Primary/Official (${green.length}):`);
  green.forEach(s => lines.push(`• ${s.publisher} — ${s.url}`));
  lines.push(`🟡 Reputable media (${yellow.length}):`);
  yellow.forEach(s => lines.push(`• ${s.publisher} — ${s.url}`));
  lines.push(`🔴 Eyewitness verified (${red.length}):`);
  red.forEach(s => lines.push(`• ${s.publisher} — ${s.url}`));
  lines.push(``);
  lines.push(`Image: ${draft.image_url ? draft.image_url + ' (credit: ' + (draft.image_credit||'') + ')' : 'No image — typographic card or no image (§10)'}`);
  return lines.join('\n');
}

export function editorKeyboard(draftId) {
  return { inline_keyboard: [[
    { text: '✅ Publish (dj-publisher only)', callback_data: `publish:${draftId}` },
    { text: '⏸️ Hold', callback_data: `hold:${draftId}` },
  ],[
    { text: '❌ Reject', callback_data: `reject:${draftId}` },
    { text: '✏️ Edit', callback_data: `edit:${draftId}` },
  ]]};
}
