# Render Deployment Configuration

## Backend Deployment

This directory contains the backend API that will be deployed to Render.

### Service Configuration

- **Type**: Web Service
- **Environment**: Node
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Health Check Path**: `/health`

### Environment Variables Required

Set these in your Render service settings:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `PORT` | Auto | Server port | `10000` (Render sets this) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key | Get from AI Studio |
| `GEMINI_API_URL` | Yes | Gemini endpoint | `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent` |
| `SUPABASE_URL` | Yes | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon key | Your anon key |
| `CORS_ORIGIN` | Yes | Frontend URL | `https://your-app.vercel.app` |
| `MAX_FILE_SIZE` | No | Max upload size | `10485760` (10MB) |
| `UPLOAD_DIR` | Yes | Upload directory | `/tmp/uploads` |

### Deployment Steps

1. **Create New Web Service**:
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure as above

2. **Set Environment Variables**:
   - Go to "Environment" tab
   - Add all required variables
   - Save changes

3. **Deploy**:
   - Click "Create Web Service"
   - Monitor deployment logs
   - Test health endpoint once deployed

### Auto-Deploy

Automatic deployments are enabled by default:
- Push to `main` branch triggers deployment
- Can be disabled in service settings
- Manual deploy option available

### Health Checks

Render automatically monitors the `/health` endpoint:
- Checks every 30 seconds
- 3 failed checks trigger restart
- Customize in service settings

### File Storage

**Important**: Render's free tier has ephemeral storage
- Files stored in `/tmp/` may be deleted
- Not suitable for permanent file storage
- Consider using:
  - AWS S3
  - Cloudinary
  - Supabase Storage

### Scaling

Free Tier Limitations:
- 512 MB RAM
- Shared CPU
- Sleeps after 15 min inactivity (cold starts)

Upgrade for:
- More resources
- No cold starts
- Persistent disk storage

### Monitoring

Monitor your service:
- Real-time logs in Render dashboard
- Metrics: CPU, memory, network usage
- Set up alerts for downtime

### Troubleshooting

Common Issues:

1. **Cold Starts**:
   - Free tier sleeps after inactivity
   - First request after sleep takes ~30s
   - Upgrade to paid plan to prevent sleeping

2. **Environment Variables**:
   - Double-check all variables are set
   - Redeploy after changing variables
   - Check logs for missing variable errors

3. **CORS Errors**:
   - Ensure `CORS_ORIGIN` matches frontend URL exactly
   - Include `https://` protocol
   - No trailing slash

4. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies in `package.json`
   - Review build logs for errors

### Custom Domain

Add custom domain:
1. Go to service settings
2. Click "Custom Domain"
3. Follow DNS configuration instructions
4. SSL certificate auto-provisioned

### Database Connection

Using Supabase:
- Connection handled via environment variables
- No additional configuration needed
- Ensure RLS policies are configured

### Security Best Practices

- Never commit `.env` files
- Use Render's environment variables
- Enable Helmet.js (already configured)
- Keep dependencies updated
- Monitor for security vulnerabilities

### Performance Optimization

- Caching: Implement Redis for session data
- Database: Use connection pooling
- Rate Limiting: Implement for API protection
- Compression: Already enabled via Express

### Logs and Debugging

Access logs:
- Dashboard → Logs tab
- Filter by log level
- Download logs for analysis
- Real-time streaming available

### Backup Strategy

For production:
1. Regular Supabase backups
2. Export environment variables
3. Document deployment configuration
4. Keep deployment scripts in version control
