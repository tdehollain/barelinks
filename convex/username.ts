import type { QueryCtx } from './_generated/server';
import { query } from './_generated/server';

export const getCurrentUser = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Not authenticated');
    }
    return identity;
  },
});
