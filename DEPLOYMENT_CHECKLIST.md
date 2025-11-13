# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to GitHub
- [ ] All tests passing locally
- [ ] No console.logs or debug code in production
- [ ] Dependencies up to date
- [ ] `.env` files NOT committed (in .gitignore)

### 2. API Keys & Credentials
- [ ] Google Gemini API key obtained
- [ ] Supabase project created
- [ ] Supabase URL and keys ready
- [ ] All credentials stored securely (not in code)

### 3. Database Setup
- [ ] Supabase database configured
- [ ] Run `SUPABASE_SETUP.sql` script
- [ ] Verify tables created with `SUPABASE_VERIFY.sql`
- [ ] RLS policies enabled (if needed)

---

## Backend Deployment (Render)

### 4. Render Account Setup
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Payment method added (if using paid tier)

### 5. Create Web Service
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Branch set to `main`
- [ ] Build command: `cd backend && npm install`
- [ ] Start command: `cd backend && npm start`
- [ ] Health check path: `/health`

### 6. Environment Variables on Render
Set the following environment variables:
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `GEMINI_API_KEY=<your-key>`
- [ ] `GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- [ ] `SUPABASE_URL=<your-url>`
- [ ] `SUPABASE_ANON_KEY=<your-key>`
- [ ] `CORS_ORIGIN=<will-add-after-frontend>`
- [ ] `MAX_FILE_SIZE=10485760`
- [ ] `UPLOAD_DIR=/tmp/uploads`

### 7. Initial Backend Deployment
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] Note backend URL: `https://________.onrender.com`
- [ ] Test health endpoint: `/health`
- [ ] Verify API responds correctly

---

## Frontend Deployment (Vercel)

### 8. Vercel Account Setup
- [ ] Vercel account created
- [ ] GitHub repository connected

### 9. Create Vercel Project
- [ ] Import GitHub repository
- [ ] Framework preset: Vite
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm install`

### 10. Environment Variables on Vercel
- [ ] `VITE_API_URL=<your-render-backend-url>`
- [ ] Applied to: Production, Preview, Development

### 11. Initial Frontend Deployment
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Note frontend URL: `https://________.vercel.app`
- [ ] Visit URL and test

---

## Post-Deployment Configuration

### 12. Update Backend CORS
- [ ] Go to Render service settings
- [ ] Update `CORS_ORIGIN` to Vercel frontend URL
- [ ] Save and trigger manual deploy

### 13. Test Integration
- [ ] Open frontend URL
- [ ] Test creating a new case
- [ ] Test uploading files
- [ ] Test argument submission
- [ ] Test verdict generation
- [ ] Check browser console for errors
- [ ] Check Render logs for backend errors

### 14. Performance & Security
- [ ] Verify HTTPS on both services
- [ ] Check page load times
- [ ] Test on different devices/browsers
- [ ] Verify CORS working properly
- [ ] Check API response times

---

## Optional: Custom Domains

### 15. Frontend Custom Domain (Optional)
- [ ] Domain purchased/available
- [ ] Added in Vercel project settings
- [ ] DNS records configured
- [ ] SSL certificate provisioned
- [ ] Update CORS_ORIGIN on backend if needed

### 16. Backend Custom Domain (Optional)
- [ ] Domain purchased/available
- [ ] Added in Render service settings
- [ ] DNS records configured
- [ ] SSL certificate provisioned
- [ ] Update VITE_API_URL on frontend

---

## Monitoring Setup

### 17. Set Up Monitoring
- [ ] Enable Render email alerts
- [ ] Enable Vercel deployment notifications
- [ ] Set up uptime monitoring (optional: UptimeRobot)
- [ ] Configure error tracking (optional: Sentry)

### 18. Documentation
- [ ] Update README with live URLs
- [ ] Document environment variables
- [ ] Update API documentation
- [ ] Create runbook for common issues

---

## Final Verification

### 19. End-to-End Testing
- [ ] Create a new case
- [ ] Upload plaintiff documents
- [ ] Upload defendant documents
- [ ] Submit arguments from both sides
- [ ] Request and receive verdict
- [ ] Verify verdict makes sense
- [ ] Test error handling

### 20. Performance Check
- [ ] Frontend loads in < 3 seconds
- [ ] API responses in < 2 seconds
- [ ] No console errors
- [ ] No 404 errors
- [ ] Mobile responsive
- [ ] Works in Chrome, Firefox, Safari

---

## Maintenance

### 21. Ongoing Tasks
- [ ] Monitor Render logs regularly
- [ ] Check Vercel analytics
- [ ] Update dependencies monthly
- [ ] Backup Supabase data regularly
- [ ] Review and rotate API keys (quarterly)
- [ ] Monitor costs (if on paid tiers)

---

## Rollback Plan

### If Deployment Fails

**Backend (Render)**:
1. Check deployment logs
2. Verify environment variables
3. Rollback to previous deployment (if available)
4. Fix issues locally and redeploy

**Frontend (Vercel)**:
1. Check build logs
2. Verify environment variables
3. Rollback to previous deployment via dashboard
4. Fix issues and redeploy

---

## Quick Reference

### Backend URL
`https://________.onrender.com`

### Frontend URL
`https://________.vercel.app`

### Important Endpoints
- Health Check: `GET /health`
- Create Case: `POST /api/cases/start`
- Upload File: `POST /api/upload`
- Submit Argument: `POST /api/cases/:id/argue`
- Get Verdict: `POST /api/cases/:id/verdict`

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs

---

## Notes

- Free tier Render services sleep after 15 min of inactivity
- First request after sleep can take ~30 seconds
- Consider paid tier for production apps with consistent traffic
- Keep sensitive data in environment variables, never in code
- Regular backups are essential

---

✅ **Deployment Complete!** Your AI Judge application is now live!
