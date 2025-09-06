import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

// Convert VercelRequest to standard Request object
function createWebRequest(req: VercelRequest): Request {
  const url = `https://${req.headers.host}${req.url}`;
  const headers = new Headers();

  // Copy headers from VercelRequest to Headers object
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
  });

  return new Request(url, {
    method: req.method || 'GET',
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });
}

async function authenticateUser(req: VercelRequest): Promise<string | null> {
  try {
    const webRequest = createWebRequest(req);
    const authorizedParties: string[] = [];
    if (!process.env.VERCEL_ENV) {
      authorizedParties.push(`http://${process.env.VERCEL_URL}`);
    } else {
      authorizedParties.push(`https://${process.env.VERCEL_URL}`);
      if (process.env.VERCEL_BRANCH_URL) authorizedParties.push(`https://${process.env.VERCEL_BRANCH_URL}`);
      if (process.env.VERCEL_PROJECT_PRODUCTION_URL) authorizedParties.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
    }

    console.log('Authorized Parties:', authorizedParties);

    const requestState = await clerkClient.authenticateRequest(webRequest, {
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: authorizedParties,
    });
    console.log('Request State:', requestState);

    const auth = requestState.toAuth();
    console.log({ auth });

    return auth?.userId || null;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

// Function to fetch page title from URL
async function fetchPageTitle(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Barelinks/1.0)',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.warn('Failed to fetch page: status', response.status, response.statusText);
      return null;
    }
    const html = await response.text();

    // Extract title using regex (simple approach)
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }

    return null;
  } catch (error) {
    console.warn('Failed to fetch page title:', error);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('VERCEL_URL:', process.env.VERCEL_URL);
  console.log('VERCEL_BRANCH_URL:', process.env.VERCEL_BRANCH_URL);
  console.log('VERCEL_PROJECT_PRODUCTION_URL:', process.env.VERCEL_PROJECT_PRODUCTION_URL);

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    // Basic validation
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Authentication check
    const userId = await authenticateUser(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Fetch page title
    const title = (await fetchPageTitle(url)) || url;

    // Database connection
    const sql = neon(
      `postgresql://neondb_owner:${process.env.NEON_DB_PASSWORD}@ep-summer-mode-aga44vze-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
    );

    // Save URL with fetched title
    const result = await sql`
      INSERT INTO links (user_id, url, title, created_at)
      VALUES (${userId}, ${url}, ${title}, NOW())
      RETURNING url, title, created_at
    `;

    return res.status(200).json({
      message: 'Link saved successfully',
      data: result[0],
    });
  } catch (error) {
    console.error('Error saving link:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
