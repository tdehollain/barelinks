import { action } from './_generated/server';
import { makeFunctionReference } from 'convex/server';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import fetchPageTitle from './lib/fetchPageTitle';

const insertLinkRef = makeFunctionReference<
  'mutation',
  { url: string; title?: string | undefined },
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

    const providedTitle = title?.trim();
    const resolvedTitle =
      providedTitle || (await fetchPageTitle(trimmedUrl)) || undefined;

    return ctx.runMutation(insertLinkRef, {
      url: trimmedUrl,
      title: resolvedTitle,
    });
  },
});
