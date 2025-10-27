import { mutation, query } from './_generated/server';
import type { Doc } from './_generated/dataModel';
import { v } from 'convex/values';

const TAG_NAME_MAX_LENGTH = 20;
const ALLOWED_TAG_COLORS = new Set([
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
  'gray',
]);

export const getTagsWithUsage = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const tags = await ctx.db
      .query('tags')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const linkTags = await ctx.db
          .query('linkTags')
          .withIndex('by_tag', (q) => q.eq('tagId', tag._id))
          .collect();

        const linkedDocs = await Promise.all(
          linkTags.map((linkTag) => ctx.db.get(linkTag.linkId))
        );

        const count = linkedDocs.reduce((total, link) => {
          return link?.userId === userId ? total + 1 : total;
        }, 0);

        return { tag, count };
      })
    );

    tagsWithCounts.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.tag.name.localeCompare(b.tag.name);
    });

    return {
      tags: tagsWithCounts,
    } satisfies { tags: Array<{ tag: Doc<'tags'>; count: number }> };
  },
});

export const attachTagToLink = mutation({
  args: {
    linkId: v.id('links'),
    tagId: v.id('tags'),
  },
  handler: async (ctx, { linkId, tagId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const link = await ctx.db.get(linkId);
    if (!link || link.userId !== userId) {
      throw new Error('Link not found');
    }

    const tag = await ctx.db.get(tagId);
    if (!tag || tag.userId !== userId) {
      throw new Error('Tag not found');
    }

    const existingLinkTag = await ctx.db
      .query('linkTags')
      .withIndex('by_link_tag', (q) =>
        q.eq('linkId', linkId).eq('tagId', tagId)
      )
      .unique();

    if (existingLinkTag) {
      return;
    }

    await ctx.db.insert('linkTags', {
      linkId,
      tagId,
      createdAtIso: new Date().toISOString(),
    });
  },
});

export const createTag = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, { name, color }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Tag name is required.');
    }

    if (trimmedName.length > TAG_NAME_MAX_LENGTH) {
      throw new Error(
        `Tag name must be ${TAG_NAME_MAX_LENGTH} characters or fewer.`
      );
    }

    if (!ALLOWED_TAG_COLORS.has(color)) {
      throw new Error('Invalid tag color.');
    }

    const existingTag = await ctx.db
      .query('tags')
      .withIndex('by_user_name', (q) =>
        q.eq('userId', identity.subject).eq('name', trimmedName)
      )
      .unique();

    if (existingTag) {
      throw new Error('A tag with this name already exists.');
    }

    const now = new Date().toISOString();

    const tagId = await ctx.db.insert('tags', {
      userId: identity.subject,
      name: trimmedName,
      color,
      createdAtIso: now,
    });

    return { tagId };
  },
});

export const detachTagFromLink = mutation({
  args: {
    linkId: v.id('links'),
    tagId: v.id('tags'),
  },
  handler: async (ctx, { linkId, tagId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const link = await ctx.db.get(linkId);
    if (!link || link.userId !== userId) {
      throw new Error('Link not found');
    }

    const tag = await ctx.db.get(tagId);
    if (!tag || tag.userId !== userId) {
      throw new Error('Tag not found');
    }

    const linkTag = await ctx.db
      .query('linkTags')
      .withIndex('by_link_tag', (q) =>
        q.eq('linkId', linkId).eq('tagId', tagId)
      )
      .unique();

    if (!linkTag) {
      return;
    }

    await ctx.db.delete(linkTag._id);
  },
});
