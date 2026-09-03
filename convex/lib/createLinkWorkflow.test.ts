import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  createLinkWithPreliminaryTitle,
  getCompletedTitleFields,
} from './createLinkWorkflow.ts';

test('stores the raw title as pending and starts enrichment immediately', async () => {
  const events: string[] = [];

  const linkId = await createLinkWithPreliminaryTitle(
    'https://example.com/article',
    undefined,
    {
      fetchRawTitle: async () => {
        events.push('raw title fetched');
        return 'Raw HTML title';
      },
      insertLink: async ({ title, isTitlePending }) => {
        events.push(`inserted: ${title}, pending: ${isTitlePending}`);
        return 'link-id';
      },
      scheduleEnrichment: async (delayMs) => {
        events.push(`enrichment delay: ${delayMs}`);
        assert.equal(delayMs, 0);
      },
    }
  );

  assert.equal(linkId, 'link-id');
  assert.deepEqual(events.slice(0, 2), [
    'raw title fetched',
    'inserted: Raw HTML title, pending: true',
  ]);
});

test('marks a successful Cloudflare title as complete', () => {
  assert.deepEqual(getCompletedTitleFields(' Rendered title '), {
    title: 'Rendered title',
    isTitlePending: false,
  });
});

test('clears the pending state without replacing the raw title on failure', () => {
  assert.deepEqual(getCompletedTitleFields(null), {
    isTitlePending: false,
  });
});
