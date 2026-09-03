import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import fetchRawPageTitle, { extractTitleFromHtml } from './fetchRawPageTitle.ts';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('extracts and normalizes the title from raw HTML', () => {
  const title = extractTitleFromHtml(`
    <!doctype html>
    <html>
      <head><title>  A title\n with &amp; entities &#33; </title></head>
    </html>
  `);

  assert.equal(title, 'A title with & entities !');
});

test('returns null when raw HTML has no title', () => {
  assert.equal(extractTitleFromHtml('<html><head></head></html>'), null);
});

test('fetches the page without running JavaScript', async () => {
  globalThis.fetch = async (_url, options) => {
    assert.equal(options?.redirect, 'follow');
    const headers = new Headers(options?.headers);

    assert.equal(
      headers.get('Accept'),
      'text/html,application/xhtml+xml'
    );
    assert.match(headers.get('User-Agent') ?? '', /^Mozilla\/5\.0 .*Chrome\//);

    return new Response('<title>Preliminary title</title>');
  };

  const title = await fetchRawPageTitle('https://example.com');

  assert.equal(title, 'Preliminary title');
});
