import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

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

    // Fetch page title
    const title = (await fetchPageTitle(url)) || url;

    // Database connection
    const sql = neon(
      `postgresql://neondb_owner:${process.env.NEON_DB_PASSWORD}@ep-summer-mode-aga44vze-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
    );

    // Get user ID from middleware (assuming it's set in headers by middleware)
    const userId = req.headers['x-user-id'];
    if (!userId || Array.isArray(userId)) {
      return res.status(401).json({ error: 'userId missing or invalid' });
    }

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
