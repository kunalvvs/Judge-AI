/**
 * Supabase Vector Adapter
 * Adapter for Supabase PostgreSQL with pgvector extension
 */

const { createClient } = require('@supabase/supabase-js');

// ============================================================================
// Configuration
// ============================================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// ============================================================================
// Client Initialization
// ============================================================================

let supabaseClient = null;

/**
 * Initialize Supabase client
 */
function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not configured. Using stub implementation.');
    return null;
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✓ Supabase client initialized');
  }
  
  return supabaseClient;
}

// ============================================================================
// Database Setup Instructions
// ============================================================================

/**
 * To set up Supabase Vector, run these SQL commands in your Supabase SQL Editor:
 * 
 * -- Enable pgvector extension
 * CREATE EXTENSION IF NOT EXISTS vector;
 * 
 * -- Create documents table
 * CREATE TABLE IF NOT EXISTS documents (
 *   id TEXT PRIMARY KEY,
 *   embedding VECTOR(768),
 *   text TEXT NOT NULL,
 *   metadata JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Create index for vector similarity search
 * CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
 *   WITH (lists = 100);
 * 
 * -- Create function for similarity search
 * CREATE OR REPLACE FUNCTION match_documents(
 *   query_embedding VECTOR(768),
 *   match_threshold FLOAT,
 *   match_count INT
 * )
 * RETURNS TABLE (
 *   id TEXT,
 *   text TEXT,
 *   metadata JSONB,
 *   similarity FLOAT
 * )
 * LANGUAGE SQL STABLE
 * AS $$
 *   SELECT
 *     id,
 *     text,
 *     metadata,
 *     1 - (embedding <=> query_embedding) AS similarity
 *   FROM documents
 *   WHERE 1 - (embedding <=> query_embedding) > match_threshold
 *   ORDER BY similarity DESC
 *   LIMIT match_count;
 * $$;
 */

// ============================================================================
// Adapter Methods
// ============================================================================

/**
 * Insert or update a document
 * @param {Object} data - Document data
 * @returns {Promise<Object>} - Upsert result
 */
async function upsert(data) {
  const client = getSupabaseClient();
  
  if (!client) {
    // Stub implementation
    console.log('[STUB] Supabase upsert:', {
      id: data.id,
      textLength: data.text.length,
      embeddingDim: data.embedding.length
    });
    
    return {
      id: data.id,
      success: true
    };
  }
  
  // Actual implementation
  const { data: result, error } = await client
    .from('documents')
    .upsert({
      id: data.id,
      embedding: data.embedding,
      text: data.text,
      metadata: data.metadata || {}
    })
    .select();
  
  if (error) {
    console.error('Supabase upsert error:', error);
    throw new Error(`Supabase upsert error: ${error.message}`);
  }
  
  console.log('✓ Document upserted:', data.id);
  return result[0];
}

/**
 * Query for similar documents
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Matching documents
 */
async function query(params) {
  const client = getSupabaseClient();
  
  if (!client) {
    // Stub implementation
    console.log('[STUB] Supabase query:', {
      embeddingDim: params.embedding.length,
      topK: params.topK
    });
    
    return [];
  }
  
  // Actual implementation using the match_documents function
  const { data, error } = await client.rpc('match_documents', {
    query_embedding: params.embedding,
    match_threshold: params.threshold || 0.5,
    match_count: params.topK || 5
  });
  
  if (error) {
    console.error('Supabase query error:', error);
    throw new Error(`Supabase query error: ${error.message}`);
  }
  
  console.log(`✓ Found ${data.length} similar documents`);
  return data.map(doc => ({
    id: doc.id,
    text: doc.text,
    metadata: doc.metadata,
    score: doc.similarity
  }));
}

/**
 * Delete a document
 * @param {string} id - Document ID
 * @returns {Promise<void>}
 */
async function deleteDoc(id) {
  const client = getSupabaseClient();
  
  if (!client) {
    // Stub implementation
    console.log('[STUB] Supabase delete:', id);
    return;
  }
  
  // Actual implementation
  const { error } = await client
    .from('documents')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error(`Supabase delete error: ${error.message}`);
  }
  
  console.log('✓ Document deleted:', id);
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  upsert,
  query,
  delete: deleteDoc
};
