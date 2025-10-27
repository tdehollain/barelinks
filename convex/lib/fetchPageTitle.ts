// Function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  };

  return text.replace(/&[#\w]+;/g, (entity) => {
    return entities[entity] || entity;
  });
}

// Function to fetch page title from URL
export default async function fetchPageTitle(
  url: string
): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Barelinks/1.0)',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn(
        'Failed to fetch page: status',
        response.status,
        response.statusText
      );
      return null;
    }
    const html = await response.text();

    // Extract title using regex (simple approach)
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      const rawTitle = titleMatch[1].trim();
      return decodeHTMLEntities(rawTitle);
    }

    return null;
  } catch (error) {
    console.warn('Failed to fetch page title:', error);
    return null;
  }
}
