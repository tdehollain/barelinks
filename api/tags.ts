import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

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
      // Fetch user's tags with link counts
      const tags = await sql`
        SELECT 
          t.id, 
          t.name, 
          t.color, 
          t.created_at,
          COUNT(lt.link_id) as link_count
        FROM tags t
        LEFT JOIN link_tags lt ON t.id = lt.tag_id
        WHERE t.user_id = ${userId}
        GROUP BY t.id, t.name, t.color, t.created_at
        ORDER BY COUNT(lt.link_id) DESC, t.created_at DESC
      `;

      return res.status(200).json({ tags });
    } catch (error) {
      console.error('Error fetching tags:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, color } = req.body;
      
      if (!name || !color) {
        return res.status(400).json({ error: 'Name and color are required' });
      }

      if (name.length > 25) {
        return res.status(400).json({ error: 'Tag name cannot exceed 25 characters' });
      }

      // Create new tag
      const result = await sql`
        INSERT INTO tags (user_id, name, color)
        VALUES (${userId}, ${name}, ${color})
        RETURNING id, name, color, created_at
      `;

      return res.status(201).json({
        message: 'Tag created successfully',
        tag: result[0],
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      
      // Check for unique constraint violation (duplicate tag name)
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        return res.status(409).json({ error: 'Tag name already exists' });
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Tag ID is required' });

      // Delete tag (only if it belongs to the authenticated user)
      const result = await sql`
        DELETE FROM tags 
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: 'Tag not found or unauthorized' });
      }

      return res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
      console.error('Error deleting tag:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}