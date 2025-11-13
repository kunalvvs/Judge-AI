# 🚀 Quick Deployment Reference Card

A one-page reference for deploying AI Judge to Vercel and Render.

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `.env` file configured locally (not committed)
- [ ] Gemini API key obtained
- [ ] Supabase project created and configured

---

## 🎯 Deployment Flow

```
1. Push to GitHub
   ↓
2. Deploy Backend to Render (15 min)
   ↓
3. Deploy Frontend to Vercel (10 min)
   ↓
4. Connect services via environment variables
   ↓
5. Test live application
```

---

## 🔧 Backend: Render Configuration

### Service Settings
| Setting | Value |
|---------|-------|
| Type | Web Service |
| Environment | Node |
| Build Command | `cd backend && npm install` |
| Start Command | `cd backend && npm start` |
| Health Check | `/health` |

### Environment Variables (8 required)
```env
NODE_ENV=production
PORT=10000
GEMINI_API_KEY=<your-gemini-key>
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-key>
CORS_ORIGIN=<your-vercel-url>
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/tmp/uploads
```

### URLs
- **Dashboard**: https://dashboard.render.com
- **Your Service**: `https://your-app.onrender.com`

---

## 🎨 Frontend: Vercel Configuration

### Project Settings
| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Environment Variables (1 required)
```env
VITE_API_URL=<your-render-backend-url>
```

### URLs
- **Dashboard**: https://vercel.com/dashboard
- **Your App**: `https://your-app.vercel.app`

---

## 🔗 Connect Services

### Step 1: Update Backend CORS
On Render, update environment variable:
```env
CORS_ORIGIN=https://your-app.vercel.app
```
Then **redeploy** the backend.

### Step 2: Verify Connection
Visit your Vercel URL and test:
- Create new case
- Upload files
- Submit arguments
- Generate verdict

Check browser console for errors.

---

## 🧪 Testing Commands

### Test Backend Health
```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","uptime":123.45}
```

### Test Frontend
Open in browser: `https://your-app.vercel.app`

Check Developer Console (F12) for:
- ✅ No CORS errors
- ✅ Successful API calls (Network tab)
- ✅ No 404 errors

---

## ⚡ Quick Commands

### Git Push
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### Vercel CLI Deploy
```bash
cd frontend
vercel --prod
```

### Check Render Logs
```bash
# In Render dashboard
Services → Your Service → Logs
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **CORS Error** | Update `CORS_ORIGIN` on Render, redeploy |
| **API Not Found** | Verify `VITE_API_URL` on Vercel |
| **Cold Start (30s)** | Expected on free tier, upgrade to fix |
| **Upload Fails** | Check `MAX_FILE_SIZE` and `UPLOAD_DIR` |
| **Build Fails** | Check logs, verify env variables |

---

## 💰 Cost: $0/month (Free Tier)

| Service | Free Tier Limits |
|---------|------------------|
| **Render** | 750 hours/month, sleeps after 15 min |
| **Vercel** | 100 GB bandwidth, unlimited deploys |
| **Supabase** | 500 MB DB, 1 GB storage |
| **Gemini API** | 60 req/min free tier |

---

## 📱 Important URLs

### Documentation
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Overview

### Platform Dashboards
- **Render**: https://dashboard.render.com
- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://app.supabase.com
- **Gemini API**: https://makersuite.google.com

---

## ✅ Success Criteria

Your deployment is successful when:
- [ ] Backend `/health` endpoint returns 200 OK
- [ ] Frontend loads without errors
- [ ] Can create a case and submit arguments
- [ ] Can upload files successfully
- [ ] Can generate verdicts
- [ ] No CORS errors in console
- [ ] Both services use HTTPS

---

## 🔄 Update Workflow

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Render auto-deploys backend (3-5 min)
5. Vercel auto-deploys frontend (2-3 min)
6. Verify changes in production

---

## 📞 Need Help?

1. Check troubleshooting section
2. Review Render/Vercel logs
3. Verify all environment variables
4. Test backend health endpoint directly
5. Check browser console for frontend errors

---

**Ready to deploy?** Run `./deploy-setup.sh` (Linux/Mac) or `deploy-setup.bat` (Windows) to get started!

---

*Keep this card handy for quick reference during deployment!* 📌
