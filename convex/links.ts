import { mutation, query } from './_generated/server';
import type { Doc } from './_generated/dataModel';
import { v } from 'convex/values';

export const getLinks = query({
  args: {
    pageSize: v.number(),
  },
  handler: async (ctx, { pageSize }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const links = await ctx.db
      .query('links')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .take(pageSize);

    const linksWithTags = await Promise.all(
      links.map(
        async (link): Promise<Doc<'links'> & { tags: Doc<'tags'>[] }> => {
          const linkTagRecords = await ctx.db
            .query('linkTags')
            .withIndex('by_link', (q) => q.eq('linkId', link._id))
            .collect();

          const tags = (
            await Promise.all(
              linkTagRecords.map(async (linkTag) => {
                const tag = await ctx.db.get(linkTag.tagId);
                return tag ?? undefined;
              })
            )
          ).filter((tag): tag is Doc<'tags'> => tag !== undefined);

          return { ...link, tags };
        }
      )
    );

    return {
      links: linksWithTags,
    };
  },
});

export const insertLink = mutation({
  args: {
    url: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, { url, title }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const now = new Date().toISOString();

    const linkId = await ctx.db.insert('links', {
      userId: identity.subject,
      url,
      title: title?.trim() || undefined,
      createdAtIso: now,
      updatedAtIso: now,
    });

    return linkId;
  },
});

export const deleteLink = mutation({
  args: {
    linkId: v.id('links'),
  },
  handler: async (ctx, { linkId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const link = await ctx.db.get(linkId);
    if (!link || link.userId !== identity.subject) {
      throw new Error('Link not found');
    }

    const linkTags = await ctx.db
      .query('linkTags')
      .withIndex('by_link', (q) => q.eq('linkId', linkId))
      .collect();

    await Promise.all(linkTags.map((linkTag) => ctx.db.delete(linkTag._id)));

    await ctx.db.delete(linkId);
  },
});
