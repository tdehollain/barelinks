import { mutation, query } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';
import type { QueryCtx } from './_generated/server';
import { v } from 'convex/values';

export const getLinks = query({
  args: {
    page: v.number(),
    pageSize: v.number(),
    tagId: v.optional(v.id('tags')),
    term: v.optional(v.string()),
  },
  handler: async (ctx, { page, pageSize, tagId, term }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const safePageSize = Math.max(1, Math.floor(pageSize));
    const currentPage = Math.max(0, Math.floor(page));

    const linksQuery = ctx.db
      .query('links')
      .withIndex('by_user_createdAt', (q) => q.eq('userId', identity.subject))
      .order('desc');

    const links = await linksQuery.collect();

    let filteredLinks: Doc<'links'>[] = links;

    if (tagId) {
      filteredLinks = await filterLinksByTag(
        ctx,
        filteredLinks,
        tagId,
        identity.subject
      );
    }

    const normalizedTerm = term?.trim().toLowerCase() ?? null;
    if (normalizedTerm) {
      filteredLinks = filterLinksByTerm(filteredLinks, normalizedTerm);
    }

    const startIndex = currentPage * safePageSize;
    if (startIndex >= filteredLinks.length) {
      return {
        links: [],
        hasMore: false,
        totalCount: filteredLinks.length,
      };
    }

    const paginatedLinks: Doc<'links'>[] = filteredLinks.slice(
      startIndex,
      startIndex + safePageSize
    );
    const hasMore = startIndex + safePageSize < filteredLinks.length;

    const linksWithTags = await Promise.all(
      paginatedLinks.map(
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
      hasMore,
      totalCount: filteredLinks.length,
    };
  },
});

async function filterLinksByTag(
  ctx: QueryCtx,
  links: Doc<'links'>[],
  tagId: Id<'tags'>,
  userId: string
): Promise<Doc<'links'>[]> {
  const linkTagRecords = await ctx.db
    .query('linkTags')
    .withIndex('by_tag', (q) => q.eq('tagId', tagId))
    .collect();

  const allowedLinkIds = new Set(
    linkTagRecords.map((linkTag) => linkTag.linkId)
  );

  return links.filter(
    (link) => link.userId === userId && allowedLinkIds.has(link._id)
  );
}

function filterLinksByTerm(
  links: Doc<'links'>[],
  normalizedTerm: string
): Doc<'links'>[] {
  return links.filter((link) => {
    const title = link.title?.toLowerCase() ?? '';
    const url = link.url.toLowerCase();

    return title.includes(normalizedTerm) || url.includes(normalizedTerm);
  });
}

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
