-- ============================================================================
-- AI JUDGE - SUPABASE DATABASE SETUP
-- ============================================================================
-- Run these commands in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- ============================================================================

-- Step 1: Enable pgvector extension
-- This allows PostgreSQL to store and query vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Create documents table
-- This table stores document chunks with their vector embeddings
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  embedding VECTOR(768),
  text TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create index for fast vector similarity search
-- This uses IVFFlat algorithm for approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS documents_embedding_idx 
ON documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Step 4: Create function for similarity search
-- This function finds documents similar to a query embedding
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id TEXT,
  text TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    text,
    metadata,
    1 - (embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Step 5: Create index on metadata for faster filtering (optional)
CREATE INDEX IF NOT EXISTS documents_metadata_idx 
ON documents 
USING gin (metadata);

-- Step 6: Create index on created_at for sorting (optional)
CREATE INDEX IF NOT EXISTS documents_created_at_idx 
ON documents (created_at DESC);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify your setup is working

-- Check if pgvector extension is enabled
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check if documents table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'documents';

-- Check table structure (columns and types)
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'documents'
ORDER BY ordinal_position;

-- Check if match_documents function exists
SELECT proname FROM pg_proc WHERE proname = 'match_documents';

-- ============================================================================
-- TEST QUERIES (Optional - for testing)
-- ============================================================================

-- Insert a test document (example)
-- Uncomment to test:
/*
INSERT INTO documents (id, embedding, text, metadata)
VALUES (
  'test-doc-1',
  ARRAY[0.1, 0.2, 0.3]::vector(768),  -- Replace with actual 768-dim vector
  'This is a test document',
  '{"source": "test", "type": "example"}'::jsonb
);
*/

-- Query test document (example)
-- Uncomment to test:
/*
SELECT * FROM match_documents(
  ARRAY[0.1, 0.2, 0.3]::vector(768),  -- Replace with query vector
  0.5,  -- similarity threshold
  5     -- max results
);
*/

-- Count documents in database
SELECT COUNT(*) as total_documents FROM documents;

-- View recent documents
SELECT id, LEFT(text, 100) as text_preview, metadata, created_at 
FROM documents 
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================================================
-- CLEANUP (if needed)
-- ============================================================================
-- Uncomment to drop everything and start fresh:
/*
DROP FUNCTION IF EXISTS match_documents(VECTOR(768), FLOAT, INT);
DROP TABLE IF EXISTS documents;
DROP EXTENSION IF EXISTS vector;
*/

-- ============================================================================
-- DONE! 🎉
-- ============================================================================
-- Your Supabase database is now ready for AI Judge!
-- Next step: Install @supabase/supabase-js in backend
