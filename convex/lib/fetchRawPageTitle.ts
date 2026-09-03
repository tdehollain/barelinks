const TITLE_PATTERN = /<title\b[^>]*>([\s\S]*?)<\/title\s*>/i;
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/140.0.0.0 Safari/537.36';

function decodeHtmlEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value.replace(
    /&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi,
    (entity, name: string) => {
      if (name.startsWith('#')) {
        const isHex = name[1]?.toLowerCase() === 'x';
        const codePoint = Number.parseInt(name.slice(isHex ? 2 : 1), isHex ? 16 : 10);

        if (Number.isInteger(codePoint)) {
          try {
            return String.fromCodePoint(codePoint);
          } catch {
            return entity;
          }
        }
      }

      return namedEntities[name.toLowerCase()] ?? entity;
    }
  );
}

export function extractTitleFromHtml(html: string): string | null {
  const rawTitle = html.match(TITLE_PATTERN)?.[1];
  if (!rawTitle) {
    return null;
  }

  const title = decodeHtmlEntities(rawTitle).replace(/\s+/g, ' ').trim();
  return title || null;
}

export default async function fetchRawPageTitle(
  url: string
): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': BROWSER_USER_AGENT,
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.warn(
        'Raw page fetch failed:',
        response.status,
        response.statusText
      );
      return null;
    }

    return extractTitleFromHtml(await response.text());
  } catch (error) {
    console.warn('Failed to fetch title from raw HTML:', error);
    return null;
  }
}
