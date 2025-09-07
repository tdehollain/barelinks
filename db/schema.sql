-- Create links table for storing user bookmarks
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  title VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table for storing user tags
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(25) NOT NULL,
  color VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name) -- Prevent duplicate tag names per user
);

-- Create junction table for link-tag relationships
CREATE TABLE IF NOT EXISTS link_tags (
  id SERIAL PRIMARY KEY,
  link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(link_id, tag_id) -- Prevent duplicate tag assignments
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_link_tags_link_id ON link_tags(link_id);
CREATE INDEX IF NOT EXISTS idx_link_tags_tag_id ON link_tags(tag_id);