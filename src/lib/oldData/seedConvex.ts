import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ConvexError } from 'convex/values';
import { ConvexHttpClient } from 'convex/browser';

import { api } from '../../../convex/_generated/api';

type LegacyLink = {
  id: number;
  user_id: string;
  url: string;
  title: string | null;
  created_at: string;
  updated_at: string | null;
};

type LegacyTag = {
  id: number;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

type LegacyLinkTag = {
  id: number;
  link_id: number;
  tag_id: number;
  created_at: string;
};

type ImportPayload = {
  links: Array<{
    neonId: number;
    userId: string;
    url: string;
    title?: string;
    createdAtIso: string;
    updatedAtIso?: string;
  }>;
  tags: Array<{
    neonId: number;
    userId: string;
    name: string;
    color: string;
    createdAtIso: string;
  }>;
  linkTags: Array<{
    neonId: number;
    linkNeonId: number;
    tagNeonId: number;
    createdAtIso: string;
  }>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readJsonFile = async <T>(relativePath: string): Promise<T> => {
  const absolutePath = path.join(__dirname, relativePath);
  const raw = await readFile(absolutePath, 'utf-8');
  return JSON.parse(raw) as T;
};

const parseTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp: ${value}`);
  }
  return date.toISOString();
};

const optionalTimestamp = (value: string | null) =>
  value ? parseTimestamp(value) : undefined;

const sanitizeTitle = (value: string | null) => value?.trim() || undefined;

const loadEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var ${key}`);
  }
  return value;
};

export const seedConvexFromOldData = async () => {
  const convexUrl = loadEnv('VITE_CONVEX_URL');
  // const convexAdminKey = process.env.CONVEX_ADMIN_KEY;

  const [legacyLinks, legacyTags, legacyLinkTags] = await Promise.all([
    readJsonFile<LegacyLink[]>('links.json'),
    readJsonFile<LegacyTag[]>('tags.json'),
    readJsonFile<LegacyLinkTag[]>('link_tags.json'),
  ]);

  const payload: ImportPayload = {
    links: legacyLinks.map((link) => ({
      neonId: link.id,
      userId: link.user_id,
      url: link.url,
      title: sanitizeTitle(link.title),
      createdAtIso: parseTimestamp(link.created_at),
      updatedAtIso: optionalTimestamp(link.updated_at),
    })),
    tags: legacyTags.map((tag) => ({
      neonId: tag.id,
      userId: tag.user_id,
      name: tag.name,
      color: tag.color,
      createdAtIso: parseTimestamp(tag.created_at),
    })),
    linkTags: legacyLinkTags.map((linkTag) => ({
      neonId: linkTag.id,
      linkNeonId: linkTag.link_id,
      tagNeonId: linkTag.tag_id,
      createdAtIso: parseTimestamp(linkTag.created_at),
    })),
  };

  const client = new ConvexHttpClient(convexUrl);
  // if (convexAdminKey) {
  //   client.setAdminAuth(convexAdminKey);
  // }

  return await client.mutation(api.importFromNeon.importBatch, payload);
};

const runIfInvokedDirectly = async () => {
  const resolvedPath = fileURLToPath(import.meta.url);
  if (process.argv[1] !== resolvedPath) {
    return;
  }

  try {
    const result = await seedConvexFromOldData();
    console.log('Seed complete', result);
  } catch (error) {
    if (error instanceof ConvexError) {
      console.error('Convex error code:', error.message);
      console.error('Convex error data:', JSON.stringify(error.data, null, 2));
    } else {
      console.error('Seeding failed', error);
    }
    process.exitCode = 1;
  }
};

void runIfInvokedDirectly();
