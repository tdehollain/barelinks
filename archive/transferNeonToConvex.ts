import { fileURLToPath } from 'url';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
import { ConvexError } from 'convex/values';
import { Pool } from 'pg';

type NeonLinkRow = {
  id: number;
  user_id: string;
  url: string;
  title: string | null;
  created_at: Date;
  updated_at: Date | null;
};

type NeonTagRow = {
  id: number;
  user_id: string;
  name: string;
  color: string;
  created_at: Date;
};

type NeonLinkTagRow = {
  id: number;
  link_id: number;
  tag_id: number;
  created_at: Date;
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

const toIso = (value: Date) => value.toISOString();
const toIsoOptional = (value: Date | null) => value?.toISOString();

const loadEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var ${key}`);
  }
  return value;
};

const fetchNeonData = async (pool: Pool) => {
  const [linksResult, tagsResult, linkTagsResult] = await Promise.all([
    pool.query<NeonLinkRow>(
      'SELECT id, user_id, url, title, created_at, updated_at FROM links ORDER BY id'
    ),
    pool.query<NeonTagRow>(
      'SELECT id, user_id, name, color, created_at FROM tags ORDER BY id'
    ),
    pool.query<NeonLinkTagRow>(
      'SELECT id, link_id, tag_id, created_at FROM link_tags ORDER BY id'
    ),
  ]);

  const payload: ImportPayload = {
    links: linksResult.rows.map((row: NeonLinkRow) => ({
      neonId: row.id,
      userId: row.user_id,
      url: row.url,
      title: row.title ?? undefined,
      createdAtIso: toIso(row.created_at),
      updatedAtIso: toIsoOptional(row.updated_at),
    })),
    tags: tagsResult.rows.map((row: NeonTagRow) => ({
      neonId: row.id,
      userId: row.user_id,
      name: row.name,
      color: row.color,
      createdAtIso: toIso(row.created_at),
    })),
    linkTags: linkTagsResult.rows.map((row: NeonLinkTagRow) => ({
      neonId: row.id,
      linkNeonId: row.link_id,
      tagNeonId: row.tag_id,
      createdAtIso: toIso(row.created_at),
    })),
  };

  return payload;
};

export const transferNeonToConvex = async () => {
  const neonUrl = loadEnv('NEON_DATABASE_URL');
  const convexUrl = loadEnv('VITE_CONVEX_URL');

  const pool = new Pool({ connectionString: neonUrl });
  try {
    const payload = await fetchNeonData(pool);
    const client = new ConvexHttpClient(convexUrl);
    const result = await client.mutation(
      api.importFromNeon.importBatch,
      payload
    );
    return result;
  } finally {
    await pool.end();
  }
};

const runIfInvokedDirectly = async () => {
  const resolvedPath = fileURLToPath(import.meta.url);
  if (process.argv[1] !== resolvedPath) {
    return;
  }

  try {
    const result = await transferNeonToConvex();
    console.log('Transfer complete', result);
  } catch (error) {
    if (error instanceof ConvexError) {
      console.error('Convex error data:', JSON.stringify(error.data, null, 2));
    } else {
      console.error('Transfer failed', error);
    }
    process.exitCode = 1;
  }
};

void runIfInvokedDirectly();
