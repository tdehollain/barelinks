import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  links: defineTable({
    userId: v.string(),
    url: v.string(),
    title: v.optional(v.string()),
    createdAtIso: v.string(),
    updatedAtIso: v.optional(v.string()),
  })
    .index('by_user_createdAt', ['userId', 'createdAtIso']),
  tags: defineTable({
    userId: v.string(),
    name: v.string(),
    color: v.string(),
    createdAtIso: v.string(),
  })
    .index('by_user', ['userId'])
    .index('by_user_name', ['userId', 'name']),
  linkTags: defineTable({
    linkId: v.id('links'),
    tagId: v.id('tags'),
    createdAtIso: v.string(),
  })
    .index('by_link', ['linkId'])
    .index('by_tag', ['tagId'])
    .index('by_link_tag', ['linkId', 'tagId']),
});
