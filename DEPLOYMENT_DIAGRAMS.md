# AI Judge - Deployment Architecture Diagrams

## 1. Overall System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         User's Browser                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  AI Judge Web Interface                                     │ │
│  │  - Case management UI                                       │ │
│  │  - File upload interface                                    │ │
│  │  - Chat interface for arguments                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network (CDN)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Frontend (React + Vite)                                    │ │
│  │  ├── Static Assets (HTML, CSS, JS)                          │ │
│  │  ├── React Router (Client-side routing)                     │ │
│  │  ├── Tailwind CSS                                           │ │
│  │  └── API Client (Axios)                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Features:                                                        │
│  ✓ Global CDN distribution                                       │
│  ✓ Automatic SSL/TLS                                             │
│  ✓ Instant deployment from GitHub                               │
│  ✓ Zero configuration needed                                     │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ REST API Calls (HTTPS)
                             │ CORS: Vercel domain whitelisted
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                         Render Web Service                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Backend API (Node.js + Express)                            │ │
│  │  ├── /api/cases/* - Case management                         │ │
│  │  ├── /api/upload - File handling                            │ │
│  │  ├── /health - Health check endpoint                        │ │
│  │  └── Middleware (CORS, Helmet, Morgan)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Features:                                                        │
│  ✓ Auto-deploy from GitHub                                       │
│  ✓ Health check monitoring                                       │
│  ✓ Auto SSL certificates                                         │
│  ✓ Environment variables management                              │
└──────┬────────────────────┬───────────────────┬──────────────────┘
       │                    │                   │
       │                    │                   │
       ▼                    ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  Supabase   │    │ Google AI    │    │ File Storage │
│  Vector DB  │    │ Gemini API   │    │ /tmp/uploads │
│             │    │              │    │              │
│ ✓ Postgres  │    │ ✓ LLM        │    │ ✓ Ephemeral  │
│ ✓ pgvector  │    │ ✓ Analysis   │    │ ✓ Temporary  │
│ ✓ Embeddings│    │ ✓ Verdicts   │    │              │
└─────────────┘    └──────────────┘    └──────────────┘
```

## 2. Deployment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Code Repository (GitHub)                            │
│                                                             │
│  Developer                                                  │
│      │                                                      │
│      │ git push                                             │
│      ▼                                                      │
│  ┌─────────┐                                               │
│  │ GitHub  │                                               │
│  │  Repo   │                                               │
│  └─────────┘                                               │
└───────┬──────────────────────────┬──────────────────────────┘
        │                          │
        │ Auto-deploy              │ Auto-deploy
        ▼                          ▼
┌──────────────────────┐  ┌──────────────────────┐
│ Step 2a: Render      │  │ Step 2b: Vercel      │
│                      │  │                      │
│ 1. Detect push       │  │ 1. Detect push       │
│ 2. Install deps      │  │ 2. Install deps      │
│ 3. Start server      │  │ 3. Build app         │
│ 4. Health check      │  │ 4. Deploy to CDN     │
│ 5. Go live! ✓        │  │ 5. Go live! ✓        │
└──────────────────────┘  └──────────────────────┘
        │                          │
        │                          │
        ▼                          ▼
┌──────────────────────┐  ┌──────────────────────┐
│ Backend Live         │  │ Frontend Live        │
│ your-app.onrender    │  │ your-app.vercel.app  │
└──────────────────────┘  └──────────────────────┘
        │                          │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌────────────────────┐
        │ Step 3: Configure  │
        │ - Set CORS_ORIGIN  │
        │ - Set VITE_API_URL │
        │ - Test connection  │
        └────────────────────┘
```

## 3. Request Flow

```
User Action: Submit Argument
     │
     ▼
┌────────────────────────────────────┐
│ 1. Frontend (Browser)              │
│    - Validate input                │
│    - Show loading state            │
└────────────┬───────────────────────┘
             │
             │ POST /api/cases/:id/argue
             │ {side: "A", argument: "..."}
             ▼
┌────────────────────────────────────┐
│ 2. Vercel Edge Network             │
│    - Route to backend API          │
└────────────┬───────────────────────┘
             │
             │ Forward request
             ▼
┌────────────────────────────────────┐
│ 3. Render Backend                  │
│    - Verify CORS                   │
│    - Validate request              │
│    - Process argument              │
└────────────┬───────────────────────┘
             │
             ├─────────────────┐
             │                 │
             ▼                 ▼
┌──────────────────┐  ┌───────────────┐
│ 4a. Supabase     │  │ 4b. Gemini    │
│ - Store data     │  │ - Analyze     │
│ - Vector search  │  │ - Generate    │
└──────────────────┘  └───────────────┘
             │                 │
             └────────┬────────┘
                      │
                      ▼
┌────────────────────────────────────┐
│ 5. Response                        │
│    - Success status                │
│    - Updated case data             │
└────────────┬───────────────────────┘
             │
             │ JSON response
             ▼
┌────────────────────────────────────┐
│ 6. Frontend Updates                │
│    - Update UI                     │
│    - Show new argument             │
│    - Clear input                   │
└────────────────────────────────────┘
```

## 4. Environment Variables Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Development (.env file - NOT COMMITTED)                     │
├─────────────────────────────────────────────────────────────┤
│ GEMINI_API_KEY=xxx                                          │
│ SUPABASE_URL=https://xxx.supabase.co                        │
│ SUPABASE_ANON_KEY=xxx                                       │
│ CORS_ORIGIN=http://localhost:5173                           │
│ VITE_API_URL=http://localhost:5000                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Deploy
                              ▼
        ┌─────────────────────────────────────┐
        │                                     │
        ▼                                     ▼
┌────────────────────────┐      ┌────────────────────────┐
│ Render (Backend)       │      │ Vercel (Frontend)      │
├────────────────────────┤      ├────────────────────────┤
│ NODE_ENV=production    │      │ VITE_API_URL=          │
│ PORT=10000             │      │   https://your-app.    │
│ GEMINI_API_KEY=xxx     │      │   onrender.com         │
│ SUPABASE_URL=xxx       │      └────────────────────────┘
│ SUPABASE_ANON_KEY=xxx  │               │
│ CORS_ORIGIN=           │               │
│   https://your-app.    │◄──────────────┘
│   vercel.app           │      Must match!
│ MAX_FILE_SIZE=...      │
│ UPLOAD_DIR=/tmp/...    │
└────────────────────────┘
```

## 5. File Upload Flow

```
User selects PDF file
     │
     ▼
┌────────────────────────────────────┐
│ 1. Frontend Validation             │
│    - Check file type (PDF/DOCX)    │
│    - Check file size (<10MB)       │
│    - Create FormData               │
└────────────┬───────────────────────┘
             │
             │ POST /api/upload
             │ Content-Type: multipart/form-data
             ▼
┌────────────────────────────────────┐
│ 2. Backend (Multer)                │
│    - Receive multipart data        │
│    - Save to /tmp/uploads          │
│    - Generate unique filename      │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ 3. Parser Service                  │
│    - Detect file type              │
│    - Extract text content          │
│    - Clean and format              │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ 4. Vector DB (Supabase)            │
│    - Generate embeddings           │
│    - Store in vector table         │
│    - Index for search              │
└────────────┬───────────────────────┘
             │
             │ Success response
             ▼
┌────────────────────────────────────┐
│ 5. Frontend Updates                │
│    - Show file in chat             │
│    - Display success message       │
│    - Enable next actions           │
└────────────────────────────────────┘
```

## 6. Verdict Generation Flow

```
User requests verdict
     │
     ▼
┌────────────────────────────────────┐
│ 1. Frontend Request                │
│    POST /api/cases/:id/verdict     │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ 2. Backend Preparation             │
│    - Fetch all arguments           │
│    - Retrieve case context         │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ 3. Vector Search (Supabase)        │
│    - Search relevant precedents    │
│    - Find similar cases            │
│    - Retrieve evidence             │
└────────────┬───────────────────────┘
             │
             │ Context + Arguments
             ▼
┌────────────────────────────────────┐
│ 4. Gemini API                      │
│    - Build prompt with context     │
│    - Analyze arguments             │
│    - Generate verdict              │
│    - Calculate confidence          │
└────────────┬───────────────────────┘
             │
             │ Verdict + Confidence
             ▼
┌────────────────────────────────────┐
│ 5. Backend Processing              │
│    - Format verdict                │
│    - Store in database             │
│    - Update case status            │
└────────────┬───────────────────────┘
             │
             │ JSON response
             ▼
┌────────────────────────────────────┐
│ 6. Frontend Display                │
│    - Show verdict card             │
│    - Display confidence            │
│    - Update timeline               │
│    - Enable re-evaluation          │
└────────────────────────────────────┘
```

## 7. Security Architecture

```
┌────────────────────────────────────────────────────────────┐
│ Security Layers                                            │
└────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
┌────────────────────────────────────┐
│ HTTPS (TLS 1.3)                    │
│ - Auto SSL certificates            │
│ - Enforced on both platforms       │
└────────────────────────────────────┘

Layer 2: CORS Protection
┌────────────────────────────────────┐
│ Backend CORS Middleware            │
│ - Whitelist Vercel domain only     │
│ - Credentials support              │
└────────────────────────────────────┘

Layer 3: Input Validation
┌────────────────────────────────────┐
│ Express Validator                  │
│ - Validate all inputs              │
│ - Sanitize file names              │
│ - Type checking                    │
└────────────────────────────────────┘

Layer 4: Security Headers
┌────────────────────────────────────┐
│ Helmet.js                          │
│ - XSS protection                   │
│ - CSRF prevention                  │
│ - Content Security Policy          │
└────────────────────────────────────┘

Layer 5: File Upload Security
┌────────────────────────────────────┐
│ Multer Configuration               │
│ - File type restrictions           │
│ - Size limits (10MB)               │
│ - Unique filename generation       │
└────────────────────────────────────┘

Layer 6: API Security
┌────────────────────────────────────┐
│ Environment Variables              │
│ - API keys in env vars only        │
│ - Never committed to repo          │
│ - Platform-managed secrets         │
└────────────────────────────────────┘
```

## 8. Scalability Considerations

```
Current Setup (Free Tier):
┌─────────────────────────────────────┐
│ Frontend (Vercel)                   │
│ ✓ Global CDN                        │
│ ✓ Unlimited requests                │
│ ✓ 100 GB bandwidth/month            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Backend (Render)                    │
│ ⚠ 512 MB RAM                        │
│ ⚠ Shared CPU                        │
│ ⚠ Sleeps after 15 min               │
│ ⚠ Cold start: ~30s                  │
└─────────────────────────────────────┘

Upgrade Path for Growth:
┌─────────────────────────────────────┐
│ 1. Upgrade Render ($7/month)        │
│    - No cold starts                 │
│    - More RAM/CPU                   │
│                                     │
│ 2. Add Redis caching                │
│    - Session management             │
│    - API response caching           │
│                                     │
│ 3. CDN for file uploads             │
│    - AWS S3 / Cloudinary            │
│    - Persistent storage             │
│                                     │
│ 4. Database optimization            │
│    - Connection pooling             │
│    - Query optimization             │
│    - Indexes on frequent queries    │
│                                     │
│ 5. Load balancing                   │
│    - Multiple backend instances     │
│    - Auto-scaling                   │
└─────────────────────────────────────┘
```

---

These diagrams provide a comprehensive visual understanding of the AI Judge deployment architecture!
