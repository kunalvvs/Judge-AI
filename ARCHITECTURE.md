# AI Judge - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                      http://localhost:5173                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   App.jsx (Router)                       │   │
│  └────────────────────┬────────────────────────────────────┘   │
│                       │                                          │
│         ┌─────────────┴─────────────┐                           │
│         │                           │                           │
│    ┌────▼─────┐              ┌─────▼──────┐                    │
│    │ HomePage │              │ CaseView   │                    │
│    └──────────┘              └─────┬──────┘                    │
│                                    │                            │
│                    ┌───────────────┼───────────────┐           │
│                    │               │               │           │
│            ┌───────▼─────┐  ┌─────▼──────┐ ┌─────▼────────┐  │
│            │  ChatBox    │  │ JudgePanel │ │ Verdict      │  │
│            │  (Side A)   │  │            │ │ Timeline     │  │
│            │             │  │            │ │              │  │
│            │  ChatBox    │  │            │ │              │  │
│            │  (Side B)   │  │            │ │              │  │
│            └───────┬─────┘  └─────┬──────┘ └─────┬────────┘  │
│                    │               │               │           │
│                    └───────────────┼───────────────┘           │
│                                    │                            │
│                            ┌───────▼────────┐                  │
│                            │   api.js       │                  │
│                            │  (API Service) │                  │
│                            └───────┬────────┘                  │
└────────────────────────────────────┼───────────────────────────┘
                                     │
                                     │ HTTP REST
                                     │
┌────────────────────────────────────▼───────────────────────────┐
│                        BACKEND (Express)                         │
│                      http://localhost:5000                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    index.js (Server)                      │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│         ┌─────────────┼─────────────┐                           │
│         │             │             │                           │
│    ┌────▼─────┐  ┌───▼──────┐  ┌──▼──────────┐                │
│    │ case.js  │  │upload.js │  │errorHandler │                │
│    │ (Routes) │  │ (Routes) │  │(Middleware) │                │
│    └────┬─────┘  └───┬──────┘  └─────────────┘                │
│         │             │                                          │
│         │             │                                          │
│    ┌────▼─────────────▼──────────────────────┐                 │
│    │          Services Layer                  │                 │
│    │                                          │                 │
│    │  ┌──────────┐  ┌───────────┐  ┌───────┐│                 │
│    │  │ gemini.js│  │ parser.js │  │vector ││                 │
│    │  │          │  │           │  │ db.js ││                 │
│    │  │  (AI)    │  │ PDF/DOCX  │  │       ││                 │
│    │  └────┬─────┘  └─────┬─────┘  └───┬───┘│                 │
│    │       │              │             │    │                 │
│    │       │              │      ┌──────▼─────▼─────┐         │
│    │       │              │      │   vectordb/      │         │
│    │       │              │      │                  │         │
│    │       │              │      │ ┌──────────────┐│         │
│    │       │              │      │ │  supabase.js ││         │
│    │       │              │      │ └──────────────┘│         │
│    │       │              │      │ ┌──────────────┐│         │
│    │       │              │      │ │  pinecone.js ││         │
│    │       │              │      │ └──────────────┘│         │
│    │       │              │      └──────────────────┘         │
│    └───────┼──────────────┼─────────────────────────┘         │
│            │              │                                     │
└────────────┼──────────────┼─────────────────────────────────────┘
             │              │
             │              │
      ┌──────▼──────┐  ┌───▼────────┐
      │   Gemini    │  │  uploads/  │
      │     API     │  │ (PDF/DOCX) │
      │  (Google)   │  └────────────┘
      └──────┬──────┘
             │
      ┌──────▼──────────────────┐
      │    Vector Database      │
      │  (Supabase or Pinecone) │
      └─────────────────────────┘
```

## Component Flow Diagram

### User Interaction Flow

```
User Action                Frontend                Backend                 AI/DB
───────────                ─────────               ─────────              ──────

1. Start Case
   │
   ├─> HomePage
   │    │
   │    └─> api.startCase()
   │         │
   │         └────────────────> POST /api/cases/start
   │                                  │
   │                                  └─> Create case object
   │                                       │
   │                                       └─> Return caseId
   │         ┌────────────────────────────────┘
   │         │
   │    Navigate to CaseView
   │
   │
2. Submit Argument (Side A)
   │
   ├─> ChatBox (Side A)
   │    │
   │    ├─> Upload file? 
   │    │    │
   │    │    ├─> api.uploadFile()
   │    │    │    │
   │    │    │    └──────────> POST /api/upload
   │    │    │                      │
   │    │    │                      └─> multer saves file
   │    │    │                           │
   │    │    │                           └─> parser.js extracts text
   │    │    │                                │
   │    │    │                                └─> Return fileId
   │    │    │    ┌───────────────────────────────┘
   │    │    │    │
   │    │    └─> Get fileId
   │    │
   │    └─> api.submitArgument()
   │         │
   │         └────────────────> POST /api/cases/:id/argue
   │                                  │
   │                                  └─> Store argument
   │                                       │
   │                                       └─> Index in Vector DB ──> Supabase
   │                                                                   /Pinecone
   │         ┌────────────────────────────────┘
   │         │
   │    Update argument list
   │
   │
3. Request Verdict
   │
   ├─> JudgePanel
   │    │
   │    └─> api.requestVerdict()
   │         │
   │         └────────────────> POST /api/cases/:id/verdict
   │                                  │
   │                                  ├─> Get all arguments
   │                                  │
   │                                  ├─> Query Vector DB ────> Search vectors
   │                                  │                             │
   │                                  │    ┌────────────────────────┘
   │                                  │    │
   │                                  └─> gemini.js
   │                                       │
   │                                       └─> Build prompt with RAG
   │                                            │
   │                                            └─> Call Gemini ──> Google AI
   │                                                 │                  │
   │                                                 │ ┌────────────────┘
   │                                                 │ │
   │                                                 └─> Parse response
   │                                                      │
   │                                                      └─> Return verdict
   │         ┌────────────────────────────────────────────────┘
   │         │
   │    Display verdict
   │    │
   │    └─> VerdictTimeline updates
   │
   │
4. Re-evaluate
   │
   └─> JudgePanel (Re-evaluate button)
        │
        └─> (Repeat step 3 with updated context)
```

## Data Flow

### Case Management

```
┌──────────────┐
│   Case       │
├──────────────┤
│ caseId       │
│ title        │
│ status       │
│ maxReeval: 5 │
│ remaining: N │
│              │
│ arguments: { │
│   sideA: []  │────┐
│   sideB: []  │    │
│ }            │    │
│              │    │
│ verdicts: [] │    │
└──────────────┘    │
                    │
        ┌───────────▼──────────┐
        │     Argument         │
        ├──────────────────────┤
        │ id                   │
        │ side: "A" | "B"      │
        │ text                 │
        │ files: [fileId]      │
        │ timestamp            │
        │ vectorIds: []        │
        └───────────┬──────────┘
                    │
        ┌───────────▼──────────┐
        │     Verdict          │
        ├──────────────────────┤
        │ round                │
        │ decision             │
        │ confidence (0-100)   │
        │ reasoning            │
        │ keyPoints: []        │
        │ suggestions          │
        │ timestamp            │
        └──────────────────────┘
```

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  React 18 ──┬──> Component Library                          │
│             │                                                 │
│             ├──> JSX Syntax                                  │
│             │                                                 │
│             └──> Hooks (useState, useEffect, etc.)           │
│                                                               │
│  Vite ──────┬──> Fast HMR (Hot Module Replacement)          │
│             │                                                 │
│             └──> Build Tool                                  │
│                                                               │
│  Tailwind ──┬──> Utility-First CSS                          │
│             │                                                 │
│             └──> Custom Theme                                │
│                                                               │
│  React Router ──> Client-Side Routing                       │
│                                                               │
│  Lucide React ──> Icon Library                              │
│                                                               │
│  Vitest ────────> Testing Framework                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      BACKEND STACK                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Node.js ───────> Runtime Environment                       │
│                                                               │
│  Express ───┬──> Web Framework                              │
│             │                                                 │
│             ├──> Middleware System                           │
│             │                                                 │
│             └──> Routing                                     │
│                                                               │
│  Multer ────────> File Upload Handler                       │
│                                                               │
│  pdf-parse ─────> PDF Text Extraction                       │
│                                                               │
│  mammoth ───────> DOCX Text Extraction                      │
│                                                               │
│  Jest ──────────> Testing Framework                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Gemini API ────┬──> LLM for Verdicts                       │
│                 │                                             │
│                 └──> Natural Language Processing             │
│                                                               │
│  Supabase ──────┬──> PostgreSQL + Vector Extension          │
│  (Option A)     │                                             │
│                 └──> Semantic Search                         │
│                                                               │
│  Pinecone ──────┬──> Vector Database                        │
│  (Option B)     │                                             │
│                 └──> Similarity Search                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      DEVOPS STACK                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Docker ────────┬──> Containerization                       │
│                 │                                             │
│                 └──> Portable Deployment                     │
│                                                               │
│  docker-compose ────> Multi-Container Orchestration         │
│                                                               │
│  Nginx ─────────────> Production Web Server                 │
│                                                               │
│  npm workspaces ────> Monorepo Management                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Sequence Diagram: Complete Case Flow

```
User       Frontend      Backend       VectorDB      Gemini
 │            │             │             │            │
 │  1. Start Case          │             │            │
 ├──────────>│             │             │            │
 │            │  startCase  │             │            │
 │            ├───────────>│             │            │
 │            │             │ Create      │            │
 │            │             │ case obj    │            │
 │            │<───────────┤             │            │
 │<──────────┤             │             │            │
 │            │             │             │            │
 │  2. Upload File (Side A)│             │            │
 ├──────────>│             │             │            │
 │            │  uploadFile │             │            │
 │            ├───────────>│             │            │
 │            │             │ Save file   │            │
 │            │             │ Parse PDF   │            │
 │            │<───────────┤             │            │
 │<──────────┤             │             │            │
 │            │             │             │            │
 │  3. Submit Argument A   │             │            │
 ├──────────>│             │             │            │
 │            │  argue()    │             │            │
 │            ├───────────>│             │            │
 │            │             │ Index text  │            │
 │            │             ├───────────>│            │
 │            │             │             │ Store      │
 │            │             │             │ vectors    │
 │            │             │<───────────┤            │
 │            │<───────────┤             │            │
 │<──────────┤             │             │            │
 │            │             │             │            │
 │  4. Submit Argument B   │             │            │
 ├──────────>│             │             │            │
 │            │  argue()    │             │            │
 │            ├───────────>│             │            │
 │            │             ├───────────>│            │
 │            │             │<───────────┤            │
 │            │<───────────┤             │            │
 │<──────────┤             │             │            │
 │            │             │             │            │
 │  5. Request Verdict     │             │            │
 ├──────────>│             │             │            │
 │            │  verdict()  │             │            │
 │            ├───────────>│             │            │
 │            │             │ Query RAG   │            │
 │            │             ├───────────>│            │
 │            │             │             │ Similarity │
 │            │             │             │ search     │
 │            │             │<───────────┤            │
 │            │             │             │            │
 │            │             │ Build       │            │
 │            │             │ prompt      │            │
 │            │             │             │            │
 │            │             │ Generate    │            │
 │            │             │ verdict     │            │
 │            │             ├────────────────────────>│
 │            │             │             │            │
 │            │             │             │   Process  │
 │            │             │             │   LLM call │
 │            │             │<────────────────────────┤
 │            │             │             │            │
 │            │             │ Parse &     │            │
 │            │             │ validate    │            │
 │            │<───────────┤             │            │
 │<──────────┤             │             │            │
 │            │             │             │            │
 │  Display verdict        │             │            │
 │            │             │             │            │
```

## File Upload Flow

```
┌──────────┐
│  User    │
│ selects  │
│   file   │
└────┬─────┘
     │
     ▼
┌────────────────┐
│   ChatBox      │
│  Component     │
│                │
│ - Validates    │
│ - Shows preview│
└────┬───────────┘
     │
     ▼
┌────────────────┐
│  api.js        │
│  uploadFile()  │
│                │
│ - FormData     │
│ - fetch POST   │
└────┬───────────┘
     │
     ▼
┌────────────────┐
│  Backend       │
│  upload.js     │
│                │
│ - Multer       │
│ - Validate     │
└────┬───────────┘
     │
     ├────────────────┐
     │                │
     ▼                ▼
┌─────────┐    ┌──────────┐
│  Save   │    │  Parse   │
│  File   │    │  Content │
│         │    │          │
│uploads/ │    │parser.js │
└─────────┘    └────┬─────┘
                    │
                    ▼
             ┌──────────────┐
             │  Extract     │
             │  Text        │
             │              │
             │ PDF: pdf-parse
             │ DOCX: mammoth
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │  Index in    │
             │  Vector DB   │
             │              │
             │ vectordb.js  │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │  Return      │
             │  fileId      │
             └──────────────┘
```

## RAG (Retrieval-Augmented Generation) Flow

```
Step 1: Document Ingestion
───────────────────────────
Upload → Parse → Chunk → Embed → Store in Vector DB

Step 2: Query Time
──────────────────
User Query → Embed Query → Search Vectors → Retrieve Top K

Step 3: Augmented Generation
─────────────────────────────
Relevant Docs + Query → Build Prompt → LLM → Response


Detailed Flow:
──────────────

1. Index Phase:
   Document Text
        │
        ▼
   Split into chunks (512 tokens)
        │
        ▼
   Generate embeddings (Gemini/OpenAI)
        │
        ▼
   Store in Vector DB
   (Supabase/Pinecone)

2. Retrieval Phase:
   User Argument
        │
        ▼
   Generate query embedding
        │
        ▼
   Cosine similarity search
        │
        ▼
   Top 5 relevant chunks
        │
        ▼
   Context for LLM

3. Generation Phase:
   Context + Arguments
        │
        ▼
   Build structured prompt:
   - System role (Judge)
   - Side A arguments + context
   - Side B arguments + context
   - Instructions
        │
        ▼
   Send to Gemini API
        │
        ▼
   Parse JSON response
        │
        ▼
   Validate and return verdict
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                     │
└─────────────────────────────────────────────────────────────┘

Frontend (Vercel/Netlify)
─────────────────────────
┌──────────────────┐
│  CDN Edge Nodes  │ ──> Global distribution
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Static Files    │
│  - HTML          │
│  - JS Bundle     │
│  - CSS           │
└──────────────────┘

Backend (Railway/Render)
────────────────────────
┌──────────────────┐
│  Load Balancer   │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Node   │ │ Node   │ ──> Auto-scaling
│ Server │ │ Server │
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         │
         ▼
┌──────────────────┐
│  Persistent      │
│  Storage         │
│  - Uploads       │
│  - Logs          │
└──────────────────┘

External Services
─────────────────
┌──────────────────┐
│  Gemini API      │ ──> Google Cloud
└──────────────────┘

┌──────────────────┐
│  Supabase        │ ──> Managed PostgreSQL
│  or              │     + Vector search
│  Pinecone        │
└──────────────────┘
```

---

This architecture provides:
✅ Scalability
✅ Maintainability
✅ Security
✅ Performance
✅ Developer Experience
