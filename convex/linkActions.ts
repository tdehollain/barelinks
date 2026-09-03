import { action, internalAction } from './_generated/server';
import { internal } from './_generated/api';
import { makeFunctionReference } from 'convex/server';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import fetchPageTitle from './lib/fetchPageTitle';
import fetchRawPageTitle from './lib/fetchRawPageTitle';
import { createLinkWithPreliminaryTitle } from './lib/createLinkWorkflow';

const insertLinkRef = makeFunctionReference<
  'mutation',
  { url: string; title?: string | undefined; isTitlePending: boolean },
  Id<'links'>
>('links:insertLink');

export const createLink = action({
  args: {
    url: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, { url, title }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      throw new Error('URL is required');
    }

    return createLinkWithPreliminaryTitle(trimmedUrl, title, {
      fetchRawTitle: fetchRawPageTitle,
      insertLink: (args) => ctx.runMutation(insertLinkRef, args),
      scheduleEnrichment: async (delayMs, args) => {
        await ctx.scheduler.runAfter(
          delayMs,
          internal.linkActions.enrichLinkTitle,
          {
            ...args,
            userId: identity.subject,
          }
        );
      },
    });
  },
});

export const enrichLinkTitle = internalAction({
  args: {
    linkId: v.id('links'),
    url: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, { linkId, url, userId }): Promise<void> => {
    const title = await fetchPageTitle(url);

    await ctx.runMutation(internal.links.updateLinkTitle, {
      linkId,
      title: title ?? undefined,
      userId,
    });
  },
});
