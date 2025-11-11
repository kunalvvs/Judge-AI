# 📚 Supabase Setup Guide for AI Judge

## 🎯 Step-by-Step Instructions

### Step 1: Log into Supabase
1. Go to https://supabase.com
2. Log in to your account
3. Select your project: `vhliumapsxhwonglbmin`

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New Query"** button
3. You'll see an empty SQL editor

### Step 3: Run the Setup SQL
1. Open the file: **`SUPABASE_SETUP_SIMPLE.sql`** (NEW - simplified version)
2. Copy **ALL** the SQL code from the file
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

### Step 4: Verify Setup
1. Open the file: **`SUPABASE_VERIFY.sql`**
2. Run each query **one at a time** to verify:
   - Query 1: Should return `vector` extension
   - Query 2: Should return `documents` table
   - Query 3: Should show 5 columns (id, embedding, text, metadata, created_at)
   - Query 4: Should return `match_documents` function
   - Query 5: Should show 3 indexes
   - Query 6: Should return 0 (no documents yet)

### Step 5: Test Your Connection
The backend will automatically connect when it restarts. Look for these logs:

```
✓ Supabase client initialized
```

---

## ✅ What Was Done

1. ✅ **Created SUPABASE_SETUP.sql** - Complete database setup script
2. ✅ **Installed @supabase/supabase-js** - Supabase client library
3. ✅ **Updated supabase.js** - Uncommented real implementation
4. ✅ **Configured .env** - Your credentials are already set

---

## 🔧 What the Database Will Have

### Table: `documents`
- `id` - Unique document identifier
- `embedding` - 768-dimensional vector for AI similarity search
- `text` - The actual text content
- `metadata` - JSON data (caseId, side, filename, etc.)
- `created_at` - Timestamp

### Function: `match_documents()`
- Finds similar documents using vector similarity
- Returns top K most similar documents
- Used for RAG (Retrieval-Augmented Generation)

### Indexes:
- Vector similarity index (IVFFlat algorithm)
- Metadata index (for filtering)
- Timestamp index (for sorting)

---

## 🧪 Test It Works

After running the SQL setup:

1. **Restart your backend** (if needed)
2. **Submit arguments** in the AI Judge UI
3. **Check backend logs** for:
   ```
   ✓ Supabase client initialized
   ✓ Document upserted: <document-id>
   ✓ Found X similar documents
   ```

4. **In Supabase Dashboard**, go to **Table Editor** > **documents**
   - You should see documents appear as you submit arguments

---

## 🐛 Troubleshooting

### Error: "pgvector extension not found"
**Solution:** Run this first:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Error: "function match_documents does not exist"
**Solution:** Re-run the entire setup SQL script

### Error: "relation 'documents' does not exist"
**Solution:** Run the CREATE TABLE statement again

### Still seeing "[STUB]" in logs?
**Solution:** 
1. Check your `.env` file has correct SUPABASE_URL and SUPABASE_ANON_KEY
2. Restart the backend server
3. The credentials should be loaded

---

## 📊 View Your Data

### Via Supabase Dashboard:
1. Go to **Table Editor**
2. Click **documents** table
3. See all stored document chunks

### Via SQL:
```sql
-- Count total documents
SELECT COUNT(*) FROM documents;

-- View recent documents
SELECT id, LEFT(text, 100) as preview, metadata, created_at 
FROM documents 
ORDER BY created_at DESC 
LIMIT 10;

-- View documents for a specific case
SELECT * FROM documents 
WHERE metadata->>'caseId' = 'your-case-id-here';
```

---

## 🚀 Next Steps

1. ✅ Run the SQL setup in Supabase
2. ✅ Verify tables are created
3. ✅ Restart backend (nodemon should auto-restart)
4. ✅ Test by submitting arguments in UI
5. ✅ Check Supabase Table Editor to see data

---

## 📝 Important Notes

- The vector dimension is **768** (standard for many embedding models)
- Similarity threshold is **0.5** (50% similarity minimum)
- Default returns top **5** most similar documents
- Embeddings are currently **mocked** (see next step below)

---

## 🔮 Future Enhancement: Real Embeddings

Currently using mock embeddings. To use real embeddings:

1. Install an embedding service (OpenAI, Cohere, or local model)
2. Update `backend/src/services/vectordb.js`
3. Replace `generateMockEmbedding()` with real embedding API call

Example with OpenAI:
```javascript
const response = await openai.embeddings.create({
  model: "text-embedding-ada-002",
  input: text,
});
return response.data[0].embedding;
```

---

**Ready to set up? Go to Supabase SQL Editor and run SUPABASE_SETUP.sql!** 🎉
