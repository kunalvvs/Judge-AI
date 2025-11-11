# 🚀 Quick Start Checklist

Follow this checklist to get your AI Judge project up and running in minutes!

---

## ✅ Pre-requisites

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] npm or yarn installed
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)

---

## 📋 Setup Steps

### 1. Install Dependencies
Choose one method:

**Method A: Automatic (Recommended)**
```bash
# Windows
setup.bat

# Mac/Linux
chmod +x setup.sh
./setup.sh
```

**Method B: Manual**
```bash
npm run install:all
```

- [ ] Root dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed

---

### 2. Get API Keys

#### Gemini API Key (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

- [ ] Gemini API key obtained

#### Vector Database (Choose One)

**Option A: Supabase (Recommended for beginners)**
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy Project URL and anon/public key
5. Go to SQL Editor and run:
   ```sql
   create extension vector;
   ```

- [ ] Supabase project created
- [ ] Supabase vector extension enabled
- [ ] Supabase URL obtained
- [ ] Supabase anon key obtained

**Option B: Pinecone**
1. Go to [Pinecone](https://www.pinecone.io)
2. Create a new index (dimension: 768)
3. Copy API key and environment

- [ ] Pinecone index created
- [ ] Pinecone API key obtained

---

### 3. Configure Environment

#### Backend Configuration
1. Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your keys:
   ```bash
   # Required
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Supabase (Option A)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   
   # OR Pinecone (Option B)
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_ENVIRONMENT=your_environment
   PINECONE_INDEX_NAME=ai-judge-index
   ```

- [ ] `.env` file created
- [ ] Gemini API key added
- [ ] Vector DB credentials added

#### Frontend Configuration
1. Copy `frontend/.env.example` to `frontend/.env`
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Edit if needed (default should work):
   ```bash
   VITE_API_URL=http://localhost:5000
   ```

- [ ] Frontend `.env` file created

---

### 4. Run the Application

Choose one method:

**Method A: Development Mode (Both servers)**
```bash
npm run dev
```

**Method B: Separate Terminals**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

**Method C: Docker**
```bash
docker-compose up --build
```

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173

---

### 5. Verify Installation

1. Open browser to http://localhost:5173
2. You should see the AI Judge homepage

- [ ] Frontend loads successfully
- [ ] No console errors
- [ ] UI displays correctly

---

## 🧪 Test the Application

### Quick Test Flow

1. Click "Start New Case"
2. Enter a case title (e.g., "Test Dispute")
3. In Side A ChatBox:
   - Enter: "I believe I am right because X"
   - Click Submit
4. In Side B ChatBox:
   - Enter: "I disagree because Y"
   - Click Submit
5. Click "Request Verdict" in Judge Panel
6. Wait for AI verdict

- [ ] Case created successfully
- [ ] Arguments submitted from both sides
- [ ] Verdict generated
- [ ] Confidence score displayed

---

## 🎉 Success!

If all checkboxes are checked, your AI Judge is ready to use!

---

## 🐛 Troubleshooting

### Frontend not loading?
```bash
cd frontend
npm install
npm run dev
```

### Backend not starting?
```bash
cd backend
npm install
npm run dev
```

### Port already in use?
Edit `.env`:
```bash
PORT=5001  # Change to different port
```

### Gemini API errors?
- Check API key is correct
- Verify you have quota remaining
- Check [Google AI Studio](https://makersuite.google.com/app/apikey)

### Vector DB connection fails?
- Verify credentials in `.env`
- Check Supabase vector extension is enabled
- Test connection in database dashboard

### Upload fails?
- Check `backend/uploads` directory exists
- Verify file is PDF or DOCX
- Check file size < 10MB

---

## 📚 Next Steps

Once everything is working:

1. **Read the documentation**
   - [ ] Review [README.md](./README.md)
   - [ ] Check [API_REFERENCE.md](./API_REFERENCE.md)
   - [ ] Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

2. **Explore the code**
   - [ ] Frontend components in `frontend/src/components/`
   - [ ] Backend routes in `backend/src/routes/`
   - [ ] AI services in `backend/src/services/`

3. **Customize**
   - [ ] Modify judge personality
   - [ ] Change UI theme colors
   - [ ] Add new features
   - [ ] Adjust re-evaluation limits

4. **Deploy** (optional)
   - [ ] Deploy frontend to Vercel/Netlify
   - [ ] Deploy backend to Railway/Render
   - [ ] Set production environment variables

---

## 🎯 Common Workflows

### Running Tests
```bash
npm test                # All tests
npm run test:backend    # Backend only
npm run test:frontend   # Frontend only
```

### Building for Production
```bash
npm run build           # Build both
npm run build:frontend  # Frontend only
npm run build:backend   # Backend only
```

### Docker Operations
```bash
docker-compose up       # Start
docker-compose down     # Stop
docker-compose logs     # View logs
```

---

## 💡 Tips

- Keep terminal open to see logs
- Check browser console for frontend errors
- Backend logs show API requests
- Cmd/Ctrl + C to stop servers
- Use Postman to test API directly

---

## 🆘 Get Help

- Check [README.md](./README.md) for detailed docs
- Review [API_REFERENCE.md](./API_REFERENCE.md) for endpoint details
- Look at example code in test files
- Check issues on GitHub repository

---

**Happy coding! 🎉**

Your AI Judge is ready to resolve disputes fairly and intelligently!
