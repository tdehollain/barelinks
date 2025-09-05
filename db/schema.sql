-- Create links table for storing user bookmarks
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  title VARCHAR(500),
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for efficient queries
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);

-- Create index on created_at for sorting by most recent
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);