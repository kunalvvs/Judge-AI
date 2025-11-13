# AI Judge - Intelligent Dispute Resolution System

An AI-powered dispute resolution platform that uses RAG (Retrieval-Augmented Generation) and LLMs to analyze arguments from two sides and provide fair, evidence-based verdicts.

## 🌟 Features

- **Dual-Side Arguments**: Two parties can present their cases with text and file uploads
- **Document Intelligence**: Supports PDF and DOCX parsing for evidence
- **RAG Integration**: Vector database indexing for contextual retrieval
- **AI-Powered Verdicts**: Uses Gemini API for intelligent case analysis
- **Re-evaluation System**: Up to 5 chained re-evaluations per case
- **Verdict Confidence**: Shows AI confidence levels for each decision
- **Timeline View**: Track the full argument and verdict history

## 🏗️ Architecture

### Frontend
- **React 18** with JSX
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for client-side routing
- **Lucide React** for icons

### Backend
- **Node.js + Express** REST API
- **Multer** for file uploads
- **PDF.js** and **Mammoth** for document parsing
- **Vector DB** adapters (Supabase Vector / Pinecone)
- **Gemini API** integration for LLM inference

## 📁 Project Structure

```
ai-judge/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   ├── Dockerfile
│   └── package.json
├── backend/               # Node.js backend API
│   ├── src/
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   └── index.js      # Server entry point
│   ├── uploads/          # File upload directory
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker composition
├── .env.example          # Environment variables template
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (optional)
- Gemini API key
- Vector DB account (Supabase or Pinecone)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-judge
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys
```

Required environment variables:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` (if using Supabase)
- `PINECONE_API_KEY` and `PINECONE_ENVIRONMENT` (if using Pinecone)

### Running Locally

#### Option 1: npm (Development)

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately
npm run dev:backend  # Backend on http://localhost:5000
npm run dev:frontend # Frontend on http://localhost:5173
```

#### Option 2: Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

## 🔧 API Endpoints

### Cases
- `POST /api/cases/start` - Start a new case
- `GET /api/cases/:caseId` - Get case details
- `POST /api/cases/:caseId/argue` - Submit an argument
- `POST /api/cases/:caseId/verdict` - Request AI verdict

### Document Management
- `POST /api/upload` - Upload a document
- `POST /api/parse` - Parse uploaded document
- `POST /api/index` - Index document in vector DB

## 🎨 Frontend Components

### ChatBox
Handles text input and file uploads for each side (A or B). Features:
- Real-time text input
- File upload (PDF/DOCX)
- Argument history
- Character/file size limits

### JudgePanel
Central panel displaying AI judge state:
- Judge avatar and name
- Current verdict card
- Confidence score
- Re-evaluation button
- Remaining re-evaluations counter

### VerdictTimeline
Shows the complete history:
- All arguments from both sides
- All verdicts with timestamps
- Confidence progression
- Cross-reply indicators

## 🔐 Security Considerations

- API keys stored in environment variables
- File upload size limits (10MB default)
- CORS configured for specific origins
- Input validation on all endpoints
- Sanitized file names

## 📦 Building for Production

```bash
# Build both frontend and backend
npm run build

# Build separately
npm run build:frontend
npm run build:backend
```

## 🚢 Deployment

This project is optimized for deployment on **Vercel** (frontend) and **Render** (backend).

### Quick Deployment Guide

For detailed step-by-step instructions, see:
- **📖 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **✅ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Interactive deployment checklist
- **📊 [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Architecture and overview

### Frontend on Vercel

**Recommended Platform**: [Vercel](https://vercel.com) - Free tier available

1. **Connect your GitHub repository** to Vercel
2. **Configure project**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Set environment variable**:
   - `VITE_API_URL`: Your Render backend URL
4. **Deploy** and get your live URL

See [frontend/VERCEL_DEPLOYMENT.md](frontend/VERCEL_DEPLOYMENT.md) for details.

### Backend on Render

**Recommended Platform**: [Render](https://render.com) - Free tier available

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure service**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Health Check Path: `/health`
4. **Set environment variables**:
   - `NODE_ENV=production`
   - `GEMINI_API_KEY=<your-key>`
   - `SUPABASE_URL=<your-url>`
   - `SUPABASE_ANON_KEY=<your-key>`
   - `CORS_ORIGIN=<your-vercel-url>`
   - More variables listed in deployment guide
5. **Deploy** and get your API URL

See [backend/RENDER_DEPLOYMENT.md](backend/RENDER_DEPLOYMENT.md) for details.

### Post-Deployment

After both deployments:
1. Update `CORS_ORIGIN` on Render with your Vercel URL
2. Update `VITE_API_URL` on Vercel with your Render URL
3. Redeploy both services
4. Test the live application

### Alternative Deployment Options

#### Docker Deployment
```bash
# Build images
docker-compose build

# Push to container registry
docker tag ai-judge-backend:latest <registry>/ai-judge-backend
docker push <registry>/ai-judge-backend
```

#### Other Platforms
- **Frontend**: Netlify, GitHub Pages, AWS Amplify
- **Backend**: Railway, Heroku, DigitalOcean App Platform

### Deployment Configuration Files

- **`vercel.json`** - Vercel configuration
- **`render.yaml`** - Render service definition
- **`.env.production.template`** - Production environment variables template
- **`verify-deployment.sh`** - Deployment verification script

## 🛠️ Configuration

### Vector Database Setup

#### Supabase
1. Create a Supabase project
2. Enable Vector extension in SQL editor:
```sql
create extension vector;
```
3. Create embeddings table (see `backend/src/services/vectordb.js`)

#### Pinecone
1. Create a Pinecone account
2. Create an index with dimension 768 (or your model's dimension)
3. Set environment variables

### Gemini API Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set `GEMINI_API_KEY` in `.env`
3. Adjust `GEMINI_API_URL` if using different model

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

**Upload fails:**
- Check `MAX_FILE_SIZE` in `.env`
- Ensure `uploads` directory exists and is writable

**Gemini API errors:**
- Verify API key is correct
- Check API quota limits
- Ensure `GEMINI_API_URL` matches your region

**Vector DB connection:**
- Verify credentials in `.env`
- Check network connectivity
- Ensure vector extension is enabled (Supabase)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API logs for error details

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Voice argument input
- [ ] Advanced analytics dashboard
- [ ] Judge personality customization
- [ ] Export verdicts to PDF
- [ ] Mobile app version

---

Built with ❤️ using React, Node.js, and AI
