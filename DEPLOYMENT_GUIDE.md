# Deployment Guide for AI Judge

This guide will walk you through deploying the AI Judge application with the frontend on Vercel and the backend on Render.

## Prerequisites

- GitHub account with this repository pushed
- Vercel account (free tier works)
- Render account (free tier works)
- Supabase account (or Pinecone if you prefer)
- Google Gemini API key

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Production

The backend is already configured for Render deployment with the `render.yaml` file.

### Step 2: Create Render Service

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository** (Judge-AI)
4. **Configure the service**:
   - **Name**: `ai-judge-backend` (or your preferred name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root)
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     cd backend && npm install
     ```
   - **Start Command**: 
     ```bash
     cd backend && npm start
     ```
   - **Plan**: Free (or paid if needed)

### Step 3: Configure Environment Variables on Render

Add the following environment variables in the Render dashboard:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `10000` | Render default (auto-assigned) |
| `GEMINI_API_KEY` | Your Gemini API key | **Required** - Get from Google AI Studio |
| `GEMINI_API_URL` | `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent` | Required |
| `SUPABASE_URL` | Your Supabase project URL | **Required** if using Supabase |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | **Required** if using Supabase |
| `CORS_ORIGIN` | Your Vercel frontend URL | **Important** - Update after frontend deployment |
| `MAX_FILE_SIZE` | `10485760` | Optional (10MB) |
| `UPLOAD_DIR` | `/tmp/uploads` | Required for Render |

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the deployment to complete (3-5 minutes)
3. **Note your backend URL**: `https://ai-judge-backend.onrender.com` (or similar)
4. Test the health endpoint: `https://your-backend-url.onrender.com/health`

### Step 5: Update CORS_ORIGIN (After Frontend Deployment)

Once your frontend is deployed on Vercel, you'll need to update the `CORS_ORIGIN` environment variable:
1. Go to your Render service dashboard
2. Navigate to "Environment" tab
3. Update `CORS_ORIGIN` to your Vercel URL (e.g., `https://your-app.vercel.app`)
4. Save and redeploy

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Production

The frontend is configured with `vercel.json` for deployment.

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository** (Judge-AI)
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com` (your Render backend URL)

6. **Click "Deploy"**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: Choose your account
# - Link to existing project: N
# - Project name: ai-judge (or your choice)
# - In which directory is your code located: frontend
# - Want to override settings: Y
# - Build Command: npm run build
# - Output Directory: dist
# - Development Command: npm run dev
```

### Step 3: Configure Environment Variables on Vercel

If not done during setup:

1. Go to your project on Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Variable**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (your Render backend URL)
   - **Environments**: Production, Preview, Development (select all)
4. Click "Save"
5. Redeploy the project

### Step 4: Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test the application functionality
3. Check browser console for any API connection errors

---

## Part 3: Post-Deployment Configuration

### 1. Update Backend CORS

Go back to Render and update the `CORS_ORIGIN` environment variable with your Vercel URL:
```
CORS_ORIGIN=https://your-app.vercel.app
```

Then redeploy the backend service.

### 2. Set Up Custom Domain (Optional)

#### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### For Render (Backend):
1. Go to Service Settings → Custom Domain
2. Add your custom domain
3. Update DNS records as instructed

### 3. Configure Supabase Vector DB

Ensure your Supabase database is properly set up:

```sql
-- Run the setup SQL script
-- Located in: SUPABASE_SETUP.sql
```

Or verify with:
```sql
-- Run the verification script
-- Located in: SUPABASE_VERIFY.sql
```

---

## Part 4: Environment Variables Reference

### Backend (.env on Render)

```bash
# Required
NODE_ENV=production
PORT=10000
GEMINI_API_KEY=your_actual_gemini_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
CORS_ORIGIN=https://your-app.vercel.app

# Optional
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/tmp/uploads
```

### Frontend (.env on Vercel)

```bash
# Required
VITE_API_URL=https://your-backend.onrender.com
```

---

## Part 5: Troubleshooting

### Backend Issues

#### 1. Health Check Failing
- Check if the backend is running: Visit `/health` endpoint
- Verify environment variables are set correctly
- Check Render logs for errors

#### 2. CORS Errors
- Ensure `CORS_ORIGIN` matches your Vercel URL exactly
- Include protocol (https://)
- No trailing slash

#### 3. File Upload Errors
- Render free tier has limited disk space
- Files are stored in `/tmp/` and may be cleared
- Consider using cloud storage (S3, Cloudinary) for production

### Frontend Issues

#### 1. API Connection Failed
- Verify `VITE_API_URL` is set correctly
- Check if backend is running
- Verify CORS is configured properly

#### 2. Build Failures
- Check if all dependencies are in `package.json`
- Verify build command is correct
- Check Vercel build logs

#### 3. Environment Variables Not Working
- Environment variables must start with `VITE_`
- Redeploy after adding new variables
- Clear cache and redeploy if issues persist

---

## Part 6: Monitoring and Logs

### Render Logs
1. Go to your service dashboard
2. Click "Logs" tab
3. Monitor real-time logs or download them

### Vercel Logs
1. Go to your project dashboard
2. Click on a deployment
3. View "Functions" tab for serverless function logs
4. Check "Runtime Logs" for server-side issues

---

## Part 7: Continuous Deployment

Both Vercel and Render support automatic deployments:

### Enable Auto-Deploy
1. **Vercel**: Automatically enabled for connected GitHub repos
2. **Render**: Enabled by default, can be toggled in service settings

### Workflow
1. Push changes to GitHub `main` branch
2. Vercel automatically builds and deploys frontend
3. Render automatically builds and deploys backend
4. Monitor deployment status in respective dashboards

---

## Part 8: Cost Considerations

### Free Tier Limits

**Render (Backend)**:
- 750 hours/month free
- 512 MB RAM
- Sleeps after 15 min of inactivity (cold starts)
- Free SSL certificates

**Vercel (Frontend)**:
- 100 GB bandwidth/month
- Unlimited deployments
- Free SSL certificates
- Edge network (CDN)

### Upgrade Recommendations
- **Backend**: Upgrade if you need:
  - No cold starts
  - More RAM
  - Persistent disk storage
  
- **Frontend**: Upgrade if you need:
  - More bandwidth
  - Team collaboration features
  - Advanced analytics

---

## Part 9: Security Checklist

- [ ] All API keys stored as environment variables (not in code)
- [ ] CORS properly configured with specific origin
- [ ] HTTPS enforced on both frontend and backend
- [ ] File upload size limits configured
- [ ] Helmet.js security headers enabled (backend)
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented (if needed)
- [ ] Supabase Row Level Security (RLS) enabled

---

## Part 10: Quick Reference Commands

### Local Development
```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend

# Run tests
npm test
```

### Deployment
```bash
# Deploy frontend to Vercel (from root)
cd frontend && vercel --prod

# Trigger Render deployment
# Push to GitHub main branch (auto-deploys)
git push origin main

# Manual deploy via Render Dashboard
# Click "Manual Deploy" → "Deploy latest commit"
```

---

## Support

For issues or questions:
1. Check Render documentation: https://render.com/docs
2. Check Vercel documentation: https://vercel.com/docs
3. Review application logs
4. Check GitHub issues

---

## Next Steps After Deployment

1. **Test thoroughly**: Test all features in production
2. **Set up monitoring**: Use Render/Vercel built-in monitoring
3. **Configure alerts**: Set up email alerts for downtime
4. **Document API**: Keep API documentation updated
5. **Backup data**: Regular Supabase backups
6. **Performance optimization**: Monitor and optimize as needed

---

Happy Deploying! 🚀
