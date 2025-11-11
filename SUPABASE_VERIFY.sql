-- ============================================================================
-- VERIFICATION QUERIES - Run these AFTER setup to verify everything works
-- ============================================================================
-- Run each query separately to check your setup
-- ============================================================================

-- 1. Check if pgvector extension is enabled (should return 1 row)
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'vector';

-- 2. Check if documents table exists (should return 'documents')
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'documents';

-- 3. Check table columns (should show 5 columns)
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'documents'
ORDER BY ordinal_position;

-- 4. Check if match_documents function exists (should return 'match_documents')
SELECT 
  proname as function_name,
  pg_get_function_arguments(oid) as arguments
FROM pg_proc 
WHERE proname = 'match_documents';

-- 5. Check all indexes on documents table
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'documents';

-- 6. Count documents (should return 0 initially)
SELECT COUNT(*) as total_documents FROM documents;

-- ============================================================================
-- If all queries above run successfully, your setup is complete! ✅
-- ============================================================================
