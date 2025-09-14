/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { neon } from '@neondatabase/serverless';

// Constants - Update these with your actual values
const AWS_REGION = 'eu-west-1'; // Update with your region
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const DYNAMODB_TABLE_NAME = 'barelinks-production'; // Update with your DynamoDB table name
const NEON_DB_URL = process.env.NEON_DB_PASSWORD
  ? `postgresql://neondb_owner:${process.env.NEON_DB_PASSWORD}@ep-summer-mode-aga44vze-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
  : 'your-neon-db-connection-string';

// Default color for tags without color (first color from constants)
const DEFAULT_TAG_COLOR = 'red';

const dynamoDB_tagColors = [
  {
    '#B0BEC5': 'Gray',
    '#FFF59D': 'Yellow',
    '#80CBC4': 'Teal',
    '#C5E1A5': 'Green',
    '#81D4FA': 'Blue',
    '#9FA8DA': 'Purple',
    '#FFCC80': 'Orange',
    '#CE93D8': 'Pink',
    '#BCAAA4': 'Indigo',
    '#EF9A9A': 'Red',
  },
];

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

/**
 * Retrieve all items from DynamoDB table
 */
async function retrieveDataFromDynamoDB() {
  try {
    console.log(`🔍 Scanning DynamoDB table: ${DYNAMODB_TABLE_NAME}`);

    const command = new ScanCommand({
      TableName: DYNAMODB_TABLE_NAME,
    });

    const response = await docClient.send(command);
    const items = response.Items || [];

    console.log(`✅ Retrieved ${items.length} items from DynamoDB`);
    console.log('📊 Sample item structure:', items[0] ? JSON.stringify(items[0], null, 2) : 'No items found');

    return items;
  } catch (error) {
    console.error('❌ Error retrieving data from DynamoDB:', error);
    throw error;
  }
}

/**
 * Transform DynamoDB data to Neon DB structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformDynamoDataToNeon(dynamoItems: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dynamoItems.map((item: any, index: number) => {
    // Log the first few items to understand the structure
    if (index < 3) {
      console.log(`🔍 DynamoDB item ${index + 1}:`, JSON.stringify(item, null, 2));
    }

    // Transform based on common DynamoDB patterns
    // Adjust these field mappings based on your actual DynamoDB structure
    const transformed = {
      // Generate a UUID-like ID if DynamoDB doesn't have one
      id: item.id || item.pk || item.linkId || `migrated-${Date.now()}-${index}`,

      // URL field
      url: item.url || '',

      // Title field - use URL as fallback if no title
      title: item.title || item.url,

      // User ID - adjust this based on how you store user IDs in DynamoDB
      user_id: 'user_31kjoTIHlb88LuzN40OSWVd7Dzt',

      // Created date - handle different DynamoDB date formats
      created_at: formatDateForNeon(item.date),
    };

    return transformed;
  });
}

/**
 * Extract all distinct tags from DynamoDB data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDistinctTags(dynamoItems: any[]) {
  const tagSet = new Set<string>();
  const tagDetails = new Map<string, { name: string; color?: string; count: number }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dynamoItems.forEach((item: any) => {
    // Check different possible tag field names in DynamoDB
    const tags = item.tags || item.categories || item.labels || [];

    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        let tagName: string;
        let tagColor: string | undefined;

        if (typeof tag === 'string') {
          // Simple string tag
          tagName = tag.toLowerCase().trim();
        } else if (typeof tag === 'object' && tag !== null) {
          // Object with name/color properties
          tagName = (tag.name || tag.label || tag.value || '').toLowerCase().trim();
          tagColor = tag.color || tag.colour;
        } else {
          return; // Skip invalid tags
        }

        if (tagName && !tagSet.has(tagName)) {
          tagSet.add(tagName);
          tagDetails.set(tagName, {
            name: tagName,
            color: tagColor,
            count: 1,
          });
        } else if (tagName && tagDetails.has(tagName)) {
          // Increment count if we've seen this tag before
          const existing = tagDetails.get(tagName)!;
          existing.count += 1;
        }
      });
    }
  });

  const distinctTags = Array.from(tagDetails.values());
  console.log(`🏷️  Found ${distinctTags.length} distinct tags`);

  if (distinctTags.length > 0) {
    console.log(
      '📊 Sample tags:',
      distinctTags.slice(0, 5).map((t) => `${t.name} (${t.count} uses)`),
    );
  }

  return distinctTags;
}

/**
 * Check for tags with the same name (case-insensitive duplicates)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkForDuplicateTagNames(distinctTags: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nameGroups = new Map<string, any[]>();

  // Group tags by normalized name
  distinctTags.forEach((tag) => {
    const normalizedName = tag.name.toLowerCase().trim();
    if (!nameGroups.has(normalizedName)) {
      nameGroups.set(normalizedName, []);
    }
    nameGroups.get(normalizedName)!.push(tag);
  });

  // Find groups with multiple entries (duplicates)
  const duplicates = Array.from(nameGroups.entries()).filter(([_, tags]) => tags.length > 1);

  if (duplicates.length > 0) {
    console.log(`⚠️  Found ${duplicates.length} tag names with duplicates:`);
    duplicates.forEach(([name, tags]) => {
      console.log(`  "${name}": ${tags.length} variations`);
      tags.forEach((tag, index) => {
        console.log(`    ${index + 1}. "${tag.name}" (used ${tag.count} times)${tag.color ? ` - color: ${tag.color}` : ''}`);
      });
    });
    return duplicates;
  } else {
    console.log('✅ No duplicate tag names found');
    return [];
  }
}

/**
 * Format date for Neon DB (PostgreSQL format)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDateForNeon(date: any): string {
  if (!date) {
    return new Date().toISOString();
  }

  // Handle different date formats from DynamoDB
  if (typeof date === 'number') {
    // Unix timestamp (seconds or milliseconds)
    const timestamp = date > 1e10 ? date : date * 1000; // Convert seconds to milliseconds if needed
    return new Date(timestamp).toISOString();
  }

  if (typeof date === 'string') {
    // ISO string or other string format
    return new Date(date).toISOString();
  }

  // If it's already a Date object
  return new Date(date).toISOString();
}

/**
 * Step 1: Insert tags into Neon DB and return tag ID mappings
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function insertTagsIntoNeon(distinctTags: any[]) {
  const sql = neon(NEON_DB_URL);
  const tagIdMap = new Map<string, number>();

  console.log(`📝 Inserting ${distinctTags.length} tags into Neon DB...`);

  try {
    // Insert tags one by one to handle conflicts properly
    for (const tag of distinctTags) {
      // Map hex color to tag color name using the mapping
      let color = DEFAULT_TAG_COLOR;
      if (tag.color && dynamoDB_tagColors[0][tag.color]) {
        color = dynamoDB_tagColors[0][tag.color].toLowerCase();
      }

      const userId = 'user_31kjoTIHlb88LuzN40OSWVd7Dzt';

      // First try to find existing tag
      let result = await sql`
        SELECT id, name FROM tags WHERE name = ${tag.name} AND user_id = ${userId}
      `;

      if (result.length > 0) {
        // Tag exists, update it
        await sql`
          UPDATE tags 
          SET color = ${color}
          WHERE name = ${tag.name} AND user_id = ${userId}
        `;
        // console.log(`  🔄 Updated existing tag "${tag.name}"`);
      } else {
        // Tag doesn't exist, insert it with original created_at
        // For tags, we'll use NOW() since tags don't have individual creation dates in DynamoDB
        result = await sql`
          INSERT INTO tags (name, color, user_id, created_at)
          VALUES (${tag.name}, ${color}, ${userId}, NOW())
          RETURNING id, name
        `;
        // console.log(`  ✅ Inserted new tag "${tag.name}"`);
      }

      if (result.length > 0) {
        tagIdMap.set(tag.name, result[0].id);
        // console.log(`  ✅ Tag "${tag.name}" -> ID ${result[0].id}`);
      }
    }

    // console.log(`✅ Successfully inserted/updated ${distinctTags.length} tags`);
    return tagIdMap;
  } catch (error) {
    console.error('❌ Error inserting tags:', error);
    throw error;
  }
}

/**
 * Step 2: Insert links into Neon DB and return link ID mappings
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function insertLinksIntoNeon(transformedData: any[]) {
  const sql = neon(NEON_DB_URL);
  const linkIdMap = new Map<string, string>();

  console.log(`📝 Inserting ${transformedData.length} links into Neon DB...`);

  try {
    for (const link of transformedData) {
      // console.log({ link });
      // First try to find existing link by URL and user_id (since DynamoDB ID won't match serial ID)
      let result = await sql`
        SELECT id, title FROM links WHERE url = ${link.url} AND user_id = ${link.user_id}
      `;

      if (result.length > 0) {
        // Link exists, update it with DynamoDB created_at
        await sql`
          UPDATE links 
          SET title = ${link.title}, created_at = ${link.created_at}
          WHERE url = ${link.url} AND user_id = ${link.user_id}
        `;
        // console.log(`  🔄 Updated existing link "${result[0].title}"`);
      } else {
        // Link doesn't exist, insert it (let Neon generate the ID)
        result = await sql`
          INSERT INTO links (url, title, user_id, created_at)
          VALUES (${link.url}, ${link.title}, ${link.user_id}, ${link.created_at})
          RETURNING id, title
        `;
        // console.log(`  ✅ Inserted new link "${result[0].title}"`);
      }

      if (result.length > 0) {
        // Map DynamoDB ID to Neon ID
        linkIdMap.set(link.id, result[0].id.toString());
        // console.log(`  ✅ Link "${result[0].title}" -> DynamoDB ID: ${link.id} -> Neon ID: ${result[0].id}`);
      }
    }

    console.log(`✅ Successfully inserted/updated ${transformedData.length} links`);
    return linkIdMap;
  } catch (error) {
    console.error('❌ Error inserting links:', error);
    throw error;
  }
}

/**
 * Gather existing data from Neon DB to create inputs for relationship insertion
 */
async function gatherExistingNeonData() {
  const sql = neon(NEON_DB_URL);
  const userId = 'user_31kjoTIHlb88LuzN40OSWVd7Dzt';

  console.log('🔍 Gathering existing data from Neon DB...');

  try {
    // Get all existing tags for the user
    const tags = await sql`
      SELECT id, name FROM tags WHERE user_id = ${userId}
    `;

    // Create tag name -> ID mapping
    const tagIdMap = new Map<string, number>();
    tags.forEach((tag) => {
      tagIdMap.set(tag.name, tag.id);
    });

    // Get all existing links for the user
    const links = await sql`
      SELECT id, url FROM links WHERE user_id = ${userId}
    `;

    console.log(`📊 Found ${tags.length} existing tags and ${links.length} existing links`);

    return { tagIdMap, links };
  } catch (error) {
    console.error('❌ Error gathering existing data:', error);
    throw error;
  }
}

/**
 * Create linkIdMap by matching DynamoDB data to existing Neon links
 */
async function createLinkIdMapping(dynamoData: any[], existingLinks: any[]) {
  const linkIdMap = new Map<string, string>();

  console.log('🔗 Creating DynamoDB -> Neon link ID mapping...');

  for (const item of dynamoData) {
    const dynamoId = item.id || item.pk || item.linkId || `migrated-${Date.now()}`;
    const url = item.url || '';

    // Find matching Neon link by URL
    const matchingLink = existingLinks.find((link) => link.url === url);

    if (matchingLink) {
      linkIdMap.set(dynamoId, matchingLink.id.toString());
      console.log(`  ✅ Mapped DynamoDB ID: ${dynamoId} -> Neon ID: ${matchingLink.id}`);
    } else {
      console.log(`  ⚠️  No matching Neon link found for DynamoDB ID: ${dynamoId} (URL: ${url})`);
    }
  }

  console.log(`📊 Successfully mapped ${linkIdMap.size} link IDs`);
  return linkIdMap;
}

/**
 * Step 3: Create link-tag relationships
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function insertLinkTagRelationships(dynamoData: any[], tagIdMap: Map<string, number>, linkIdMap: Map<string, string>) {
  const sql = neon(NEON_DB_URL);
  let relationshipCount = 0;

  console.log(`📝 Creating link-tag relationships...`);

  try {
    for (const item of dynamoData) {
      const linkId = item.id || item.pk || item.linkId || `migrated-${Date.now()}`;
      const tags = item.tags || item.categories || item.labels || [];

      if (Array.isArray(tags) && tags.length > 0) {
        for (const tag of tags) {
          let tagName: string;

          if (typeof tag === 'string') {
            tagName = tag.toLowerCase().trim();
          } else if (typeof tag === 'object' && tag !== null) {
            tagName = (tag.name || tag.label || tag.value || '').toLowerCase().trim();
          } else {
            continue;
          }

          const tagId = tagIdMap.get(tagName);
          const neonLinkId = linkIdMap.get(linkId);

          if (tagId && neonLinkId) {
            // Convert both IDs to integers
            const tagIdInt = parseInt(tagId.toString(), 10);
            const linkIdInt = parseInt(neonLinkId, 10);

            // Check if relationship already exists
            const existing = await sql`
              SELECT 1 FROM link_tags WHERE link_id = ${linkIdInt} AND tag_id = ${tagIdInt}
            `;

            if (existing.length === 0) {
              // Insert relationship with the same created_at as the original link
              const linkCreatedAt = new Date(item.date || Date.now()).toISOString();
              await sql`
                INSERT INTO link_tags (link_id, tag_id, created_at)
                VALUES (${linkIdInt}, ${tagIdInt}, ${linkCreatedAt})
              `;
              relationshipCount++;
              console.log(`  ✅ Created relationship: Link ${linkIdInt} <-> Tag ${tagIdInt} (${tagName})`);
            }
          } else {
            console.log(`  ⚠️  Skipping tag "${tagName}" for DynamoDB link ${linkId} - missing mapping`);
          }
        }
      }
    }

    console.log(`✅ Successfully created ${relationshipCount} link-tag relationships`);
  } catch (error) {
    console.error('❌ Error creating link-tag relationships:', error);
    throw error;
  }
}

/**
 * Standalone function to insert only link-tag relationships (for when links and tags already exist)
 */
async function insertOnlyRelationships() {
  try {
    console.log('🚀 Starting relationships-only migration...');

    // Step 1: Get DynamoDB data
    const dynamoData = await retrieveDataFromDynamoDB();

    // Step 2: Gather existing Neon data
    const { tagIdMap, links } = await gatherExistingNeonData();

    // Step 3: Create link ID mapping
    const linkIdMap = await createLinkIdMapping(dynamoData, links);

    // Step 4: Insert relationships only
    console.log('🔗 Inserting link-tag relationships...');
    const sql = neon(NEON_DB_URL);

    await sql`BEGIN`;
    await insertLinkTagRelationships(dynamoData, tagIdMap, linkIdMap);
    await sql`COMMIT`;

    console.log('✅ Relationships-only migration completed successfully!');
  } catch (error) {
    console.error('❌ Relationships migration failed:', error);
    const sql = neon(NEON_DB_URL);
    await sql`ROLLBACK`;
    throw error;
  }
}

/**
 * Main migration function with transaction support
 */
async function migrateToNeonDB(distinctTags: any[], transformedData: any[], dynamoData: any[]) {
  const sql = neon(NEON_DB_URL);

  console.log('🚀 Starting migration to Neon DB with transaction...');

  try {
    // Begin transaction
    await sql`BEGIN`;

    // Step 1: Insert tags
    const tagIdMap = await insertTagsIntoNeon(distinctTags);

    // Step 2: Insert links
    const linkIdMap = await insertLinksIntoNeon(transformedData);

    // Step 3: Create relationships
    await insertLinkTagRelationships(dynamoData, tagIdMap, linkIdMap);

    // Commit transaction
    await sql`COMMIT`;

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Summary: ${distinctTags.length} tags, ${transformedData.length} links migrated`);
  } catch (error) {
    console.error('❌ Migration failed, rolling back...');
    await sql`ROLLBACK`;
    throw error;
  }
}

/**
 * Main function to run the migration
 */
async function main() {
  try {
    console.log('🚀 Starting DynamoDB data retrieval...');

    // Step 1: Retrieve data from DynamoDB
    const dynamoData = await retrieveDataFromDynamoDB();

    console.log(`📋 Migration preview - found ${dynamoData.length} items to migrate`);

    // Step 2: Extract distinct tags
    const distinctTags = extractDistinctTags(dynamoData);

    // Step 2.1: Check for duplicate tag names
    const duplicates = checkForDuplicateTagNames(distinctTags);
    if (duplicates.length > 0) {
      console.log('💡 Consider consolidating duplicate tags before migration');
    }

    // Step 3: Transform data
    const transformedData = transformDynamoDataToNeon(dynamoData);
    console.log('🔄 Data transformed for Neon DB');
    console.log('📊 Sample transformed item:', transformedData[0] ? JSON.stringify(transformedData[0], null, 2) : 'No items to transform');

    // Step 4: Choose migration type
    // Uncomment one of these lines:

    // Full migration (tags, links, and relationships)
    await migrateToNeonDB(distinctTags, transformedData, dynamoData);

    // Relationships only (when tags and links already exist)
    // await insertOnlyRelationships();
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { retrieveDataFromDynamoDB };
