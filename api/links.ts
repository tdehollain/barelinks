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
  // Get user ID from middleware
  const userId = req.headers['x-user-id'];
  if (!userId || Array.isArray(userId)) {
    return res.status(401).json({ error: 'userId missing or invalid' });
  }

  // Database connection
  const sql = neon(
    `postgresql://neondb_owner:${process.env.NEON_DB_PASSWORD}@ep-summer-mode-aga44vze-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
  );

  if (req.method === 'GET') {
    try {
      // Fetch user's links with their tags
      const links = await sql`
        SELECT 
          l.id, 
          l.url, 
          l.title, 
          l.created_at,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'color', t.color)
              ORDER BY t.created_at
            ) FILTER (WHERE t.id IS NOT NULL), 
            '[]'
          ) as tags
        FROM links l
        LEFT JOIN link_tags lt ON l.id = lt.link_id
        LEFT JOIN tags t ON lt.tag_id = t.id
        WHERE l.user_id = ${userId}
        GROUP BY l.id, l.url, l.title, l.created_at
        ORDER BY l.created_at DESC
      `;

      return res.status(200).json({ links });
    } catch (error) {
      console.error('Error fetching links:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: 'URL is required' });

      // Fetch page title
      const title = (await fetchPageTitle(url)) || url;

      // Save URL with fetched title
      const result = await sql`
        INSERT INTO links (user_id, url, title, created_at)
        VALUES (${userId}, ${url}, ${title}, NOW())
        RETURNING id, url, title, created_at
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

  if (req.method === 'DELETE') {
    try {
      // Try to get ID from query params first, then body
      const id = req.query.id || req.body?.id;
      if (!id) return res.status(400).json({ error: 'Link ID is required' });

      console.log('DELETE request:', { id, userId, query: req.query, body: req.body });

      // Delete link (only if it belongs to the authenticated user)
      const result = await sql`
        DELETE FROM links 
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: 'Link not found or unauthorized' });
      }

      return res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Error deleting link:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
