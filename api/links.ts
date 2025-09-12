import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

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
    '&trade;': '™'
  };

  return text.replace(/&[#\w]+;/g, (entity) => {
    return entities[entity] || entity;
  });
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
      const rawTitle = titleMatch[1].trim();
      return decodeHTMLEntities(rawTitle);
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
      // Get pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      
      // Get search parameters
      const keyword = req.query.keyword as string || '';
      const tagIds = req.query.tagIds as string || '';
      const tagIdArray = tagIds ? tagIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id)) : [];

      // Build dynamic query conditions
      let links, totalResult;

      if (!keyword.trim() && tagIdArray.length === 0) {
        // No search filters - use original query
        links = await sql`
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
          LIMIT ${limit} OFFSET ${offset}
        `;

        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM links
          WHERE user_id = ${userId}
        `;
      } else if (keyword.trim() && tagIdArray.length === 0) {
        // Keyword search only
        const keywordPattern = `%${keyword.trim()}%`;
        links = await sql`
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
            AND (l.title ILIKE ${keywordPattern} OR l.url ILIKE ${keywordPattern})
          GROUP BY l.id, l.url, l.title, l.created_at
          ORDER BY l.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

        totalResult = await sql`
          SELECT COUNT(*) as total
          FROM links l
          WHERE l.user_id = ${userId} 
            AND (l.title ILIKE ${keywordPattern} OR l.url ILIKE ${keywordPattern})
        `;
      } else if (!keyword.trim() && tagIdArray.length > 0) {
        // Tag filtering only
        links = await sql`
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
            AND l.id IN (
              SELECT DISTINCT lt.link_id 
              FROM link_tags lt 
              WHERE lt.tag_id = ANY(${tagIdArray})
            )
          GROUP BY l.id, l.url, l.title, l.created_at
          ORDER BY l.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

        totalResult = await sql`
          SELECT COUNT(DISTINCT l.id) as total
          FROM links l
          INNER JOIN link_tags lt ON l.id = lt.link_id
          WHERE l.user_id = ${userId} 
            AND lt.tag_id = ANY(${tagIdArray})
        `;
      } else {
        // Both keyword and tag filtering
        const keywordPattern = `%${keyword.trim()}%`;
        links = await sql`
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
            AND (l.title ILIKE ${keywordPattern} OR l.url ILIKE ${keywordPattern})
            AND l.id IN (
              SELECT DISTINCT lt.link_id 
              FROM link_tags lt 
              WHERE lt.tag_id = ANY(${tagIdArray})
            )
          GROUP BY l.id, l.url, l.title, l.created_at
          ORDER BY l.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

        totalResult = await sql`
          SELECT COUNT(DISTINCT l.id) as total
          FROM links l
          INNER JOIN link_tags lt ON l.id = lt.link_id
          WHERE l.user_id = ${userId} 
            AND (l.title ILIKE ${keywordPattern} OR l.url ILIKE ${keywordPattern})
            AND lt.tag_id = ANY(${tagIdArray})
        `;
      }
      const total = parseInt(totalResult[0].total);
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({ 
        links,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
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
