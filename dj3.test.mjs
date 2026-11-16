// Executable DJ-3 tests — run with: node --test test/dj3.test.mjs
// These tests use a mock DB, no real D1 needed. They prove the gate blocks unauthorized / under-verified publish.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDJ3 } from '../src/dj3.js';
import { publishDraft } from '../src/publish.js';

function mockDb(sources, verification) {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      return {
        bind(...args) {
          return {
            all: async () => ({ results: sources }),
            first: async () => {
              if (sql.includes('FROM drafts')) return { id: 'd1', claim_id: 'c1', status: 'READY' };
              if (sql.includes('FROM verifications')) return verification;
              return null;
            },
            run: async () => { calls.push(sql); return {}; }
          };
        }
      };
    },
    batch: async (stmts) => { calls.push('batch:' + stmts.length); return []; }
  };
}

test('DJ-3 HOLD with only 1 source', async () => {
  const db = mockDb([{ domain: 'a.com', publisher: 'A', source_kind: 'primary' }]);
  const r = await checkDJ3(db, 'c1');
  assert.equal(r.verdict, 'HOLD');
  assert.equal(r.independentDomains, 1);
});

test('DJ-3 HOLD with 3 sources but same domain', async () => {
  const db = mockDb([
    { domain: 'same.com', publisher: 'A', source_kind: 'primary' },
    { domain: 'same.com', publisher: 'A', source_kind: 'reputable_media' },
    { domain: 'same.com', publisher: 'A', source_kind: 'reputable_media' },
  ]);
  const r = await checkDJ3(db, 'c1');
  assert.equal(r.verdict, 'HOLD');
});

test('DJ-3 READY with 3 independent + primary', async () => {
  const db = mockDb([
    { domain: 'gov.bd', publisher: 'Gov', source_kind: 'official' },
    { domain: 'paper1.com', publisher: 'Paper1', source_kind: 'reputable_media' },
    { domain: 'paper2.com', publisher: 'Paper2', source_kind: 'reputable_media' },
  ]);
  const r = await checkDJ3(db, 'c1');
  assert.equal(r.verdict, 'READY');
});

test('Publish BLOCKED for dj-drafter', async () => {
  const db = mockDb([], { verdict: 'READY' });
  await assert.rejects(() => publishDraft(db, { draftId: 'd1', actor: 'Test Drafter', actorRole: 'dj-drafter' }), /BLOCKED/);
});

test('Publish BLOCKED for AI actor', async () => {
  const db = mockDb([], { verdict: 'READY' });
  await assert.rejects(() => publishDraft(db, { draftId: 'd1', actor: 'AI', actorRole: 'dj-publisher' }), /BLOCKED/);
});

test('Publish BLOCKED when DJ-3 HOLD', async () => {
  const db = mockDb(
    [{ domain: 'a.com', publisher: 'A', source_kind: 'primary' }],
    { verdict: 'HOLD' }
  );
  await assert.rejects(() => publishDraft(db, { draftId: 'd1', actor: 'Sheikh Mehedi Hasan Nadim', actorRole: 'dj-publisher' }), /BLOCKED.*DJ-3/);
});
