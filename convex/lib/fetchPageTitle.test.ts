import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import fetchPageTitle from './fetchPageTitle.ts';

const originalFetch = globalThis.fetch;
const originalAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const originalApiToken = process.env.CLOUDFLARE_API_TOKEN;
const hasCloudflareCredentials = Boolean(originalAccountId && originalApiToken);

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (originalAccountId === undefined) {
    delete process.env.CLOUDFLARE_ACCOUNT_ID;
  } else {
    process.env.CLOUDFLARE_ACCOUNT_ID = originalAccountId;
  }

  if (originalApiToken === undefined) {
    delete process.env.CLOUDFLARE_API_TOKEN;
  } else {
    process.env.CLOUDFLARE_API_TOKEN = originalApiToken;
  }
});

test('returns the title computed by the browser', async () => {
  process.env.CLOUDFLARE_ACCOUNT_ID = 'account-id';
  process.env.CLOUDFLARE_API_TOKEN = 'api-token';
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        success: true,
        meta: { title: 'Title set by JavaScript' },
        result: '<html><head></head><body></body></html>',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  const title = await fetchPageTitle('https://example.com/dynamic-page');

  assert.equal(title, 'Title set by JavaScript');
});

test(
  'gets the rendered title from the Brussels Times article',
  { skip: !hasCloudflareCredentials },
  async () => {
    const title = await fetchPageTitle(
      'https://www.brusselstimes.com/belgium/2295884/from-zombies-to-red-tape-belgiums-ability-to-afford-higher-wages-is-in-danger'
    );

    assert.match(title ?? '', /^From zombies to red tape:/);
  }
);
