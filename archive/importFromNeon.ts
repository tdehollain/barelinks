import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';

export const importBatch = mutation({
  args: {
    tags: v.array(
      v.object({
        neonId: v.number(),
        userId: v.string(),
        name: v.string(),
        color: v.string(),
        createdAtIso: v.string(),
      })
    ),
    links: v.array(
      v.object({
        neonId: v.number(),
        userId: v.string(),
        url: v.string(),
        title: v.optional(v.string()),
        createdAtIso: v.string(),
        updatedAtIso: v.optional(v.string()),
      })
    ),
    linkTags: v.array(
      v.object({
        neonId: v.number(),
        linkNeonId: v.number(),
        tagNeonId: v.number(),
        createdAtIso: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const tagIdByNeon = new Map<number, Id<'tags'>>();
    for (const tag of args.tags) {
      const existing = await ctx.db
        .query('tags')
        .withIndex('by_user_name', (q) =>
          q.eq('userId', tag.userId).eq('name', tag.name)
        )
        .unique();
      const tagId =
        existing?._id ??
        (await ctx.db.insert('tags', {
          userId: tag.userId,
          name: tag.name,
          color: tag.color,
          createdAtIso: tag.createdAtIso,
        }));
      tagIdByNeon.set(tag.neonId, tagId);
    }

    const linkIdByNeon = new Map<number, Id<'links'>>();
    for (const link of args.links) {
      const linkId = await ctx.db.insert('links', {
        userId: link.userId,
        url: link.url,
        title: link.title,
        createdAtIso: link.createdAtIso,
        updatedAtIso: link.updatedAtIso,
      });
      linkIdByNeon.set(link.neonId, linkId);
    }

    let linkTagsInserted = 0;
    for (const linkTag of args.linkTags) {
      const linkId = linkIdByNeon.get(linkTag.linkNeonId);
      const tagId = tagIdByNeon.get(linkTag.tagNeonId);
      if (!linkId || !tagId) {
        continue;
      }

      const existing = await ctx.db
        .query('linkTags')
        .withIndex('by_link_tag', (q) =>
          q.eq('linkId', linkId).eq('tagId', tagId)
        )
        .unique();
      if (existing) {
        continue;
      }

      await ctx.db.insert('linkTags', {
        linkId,
        tagId,
        createdAtIso: linkTag.createdAtIso,
      });
      linkTagsInserted += 1;
    }

    return {
      insertedTags: tagIdByNeon.size,
      insertedLinks: linkIdByNeon.size,
      insertedLinkTags: linkTagsInserted,
    };
  },
});
