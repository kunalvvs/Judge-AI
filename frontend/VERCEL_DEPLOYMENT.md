# Vercel Deployment Configuration

## Frontend Deployment

This directory contains the frontend application that will be deployed to Vercel.

### Build Configuration

- **Framework**: Vite + React
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

### Environment Variables Required

Set these in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.onrender.com` |

### Deployment Steps

1. **Via Vercel Dashboard**:
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Configure environment variables
   - Deploy

2. **Via Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   cd frontend
   vercel --prod
   ```

### Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### Build Optimization

The build is optimized for production:
- Code splitting for faster loads
- Tree shaking to remove unused code
- Minification and compression
- Source maps for debugging

### Troubleshooting

- **Build fails**: Check Node.js version (18.x+)
- **API errors**: Verify `VITE_API_URL` environment variable
- **Routing issues**: Vercel automatically handles SPA routing

### Performance

- Edge Network: Global CDN for fast loading
- Automatic caching of static assets
- HTTP/2 and Brotli compression enabled

### Monitoring

Monitor your deployment:
- Real-time logs in Vercel dashboard
- Analytics for page views and performance
- Error tracking and reporting
