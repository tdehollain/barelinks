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

  if (req.method === 'POST') {
    try {
      const { linkId, tagId } = req.body;
      
      if (!linkId || !tagId) {
        return res.status(400).json({ error: 'Link ID and tag ID are required' });
      }

      // Verify that the link belongs to the user
      const linkCheck = await sql`
        SELECT id FROM links 
        WHERE id = ${linkId} AND user_id = ${userId}
      `;

      if (linkCheck.length === 0) {
        return res.status(404).json({ error: 'Link not found or unauthorized' });
      }

      // Verify that the tag belongs to the user
      const tagCheck = await sql`
        SELECT id FROM tags 
        WHERE id = ${tagId} AND user_id = ${userId}
      `;

      if (tagCheck.length === 0) {
        return res.status(404).json({ error: 'Tag not found or unauthorized' });
      }

      // Create link-tag relationship
      const result = await sql`
        INSERT INTO link_tags (link_id, tag_id)
        VALUES (${linkId}, ${tagId})
        RETURNING id, link_id, tag_id, created_at
      `;

      return res.status(201).json({
        message: 'Tag linked to link successfully',
        linkTag: result[0],
      });
    } catch (error) {
      console.error('Error linking tag to link:', error);
      
      // Check for unique constraint violation (tag already linked to link)
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        return res.status(409).json({ error: 'Tag is already linked to this link' });
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { linkId, tagId } = req.body;
      
      if (!linkId || !tagId) {
        return res.status(400).json({ error: 'Link ID and tag ID are required' });
      }

      // Delete link-tag relationship (with user verification via joins)
      const result = await sql`
        DELETE FROM link_tags 
        WHERE link_id = ${linkId} 
          AND tag_id = ${tagId}
          AND EXISTS (SELECT 1 FROM links WHERE id = ${linkId} AND user_id = ${userId})
          AND EXISTS (SELECT 1 FROM tags WHERE id = ${tagId} AND user_id = ${userId})
        RETURNING id
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: 'Link-tag relationship not found or unauthorized' });
      }

      return res.status(200).json({ message: 'Tag unlinked from link successfully' });
    } catch (error) {
      console.error('Error unlinking tag from link:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}