-- Comic Tracker Database Schema
-- Run these commands in your Supabase SQL Editor

-- 1. Comics table - stores comic metadata from ComicVine
CREATE TABLE IF NOT EXISTS comics (
  id BIGSERIAL PRIMARY KEY,
  comicvine_id INTEGER UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  publisher VARCHAR(255),
  start_year INTEGER,
  issue_count INTEGER,
  description TEXT,
  image_url TEXT,
  api_detail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Comics table - tracks user's comic collection
CREATE TABLE IF NOT EXISTS user_comics (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comic_id BIGINT REFERENCES comics(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('reading', 'completed', 'planned', 'dropped')),
  personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5),
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_reading_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, comic_id)
);

-- 3. User Issues table - tracks individual issue reading progress
CREATE TABLE IF NOT EXISTS user_issues (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comic_id BIGINT REFERENCES comics(id) ON DELETE CASCADE,
  issue_number INTEGER NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comic_id, issue_number)
);

-- 4. User Wishlist table - comics user wants to read
CREATE TABLE IF NOT EXISTS user_wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comic_id BIGINT REFERENCES comics(id) ON DELETE CASCADE,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  notes TEXT,
  UNIQUE(user_id, comic_id)
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_comics_user_id ON user_comics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_comics_status ON user_comics(status);
CREATE INDEX IF NOT EXISTS idx_user_issues_user_comic ON user_issues(user_id, comic_id);
CREATE INDEX IF NOT EXISTS idx_user_wishlist_user_id ON user_wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_comics_comicvine_id ON comics(comicvine_id);

-- 6. Create updated_at trigger for comics table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comics_updated_at 
    BEFORE UPDATE ON comics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE user_comics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wishlist ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
-- User Comics policies
CREATE POLICY "Users can view their own comics" ON user_comics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comics" ON user_comics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comics" ON user_comics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comics" ON user_comics
    FOR DELETE USING (auth.uid() = user_id);

-- User Issues policies
CREATE POLICY "Users can view their own issues" ON user_issues
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own issues" ON user_issues
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issues" ON user_issues
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own issues" ON user_issues
    FOR DELETE USING (auth.uid() = user_id);

-- User Wishlist policies
CREATE POLICY "Users can view their own wishlist" ON user_wishlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to their own wishlist" ON user_wishlist
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlist" ON user_wishlist
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist" ON user_wishlist
    FOR DELETE USING (auth.uid() = user_id);

-- Comics table is public read (no RLS needed for basic comic info)