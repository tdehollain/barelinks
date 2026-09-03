/// <reference types="node" />

type BrowserRunContentResponse = {
  success: boolean;
  meta?: {
    title?: string;
  };
  errors?: Array<{
    code: number;
    message: string;
  }>;
};

export default async function fetchPageTitle(
  url: string
): Promise<string | null> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    console.warn('Cloudflare Browser Run credentials are not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/browser-rendering/content`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          gotoOptions: {
            waitUntil: 'domcontentloaded',
            timeout: 30_000,
          },
          waitForTimeout: 1_000,
        }),
      },
    );

    if (!response.ok) {
      console.warn(
        'Cloudflare Browser Run failed:',
        response.status,
        response.statusText
      );
      return null;
    }

    const result = (await response.json()) as BrowserRunContentResponse;
    const title = result.meta?.title?.trim();

    if (!result.success || !title) {
      console.warn('Cloudflare Browser Run did not return a page title');
      return null;
    }

    return title;
  } catch (error) {
    console.warn(
      'Failed to fetch page title with Cloudflare Browser Run:',
      error
    );
    return null;
  }
}
