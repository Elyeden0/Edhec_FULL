# 🚀 Deployment Checklist

## Pre-Deployment

### Backend
- [ ] All dependencies in `requirements.txt`
- [ ] Environment variables configured
- [ ] CORS origins updated for production domain
- [ ] Error logging enabled
- [ ] API rate limiting configured (optional)
- [ ] Health check endpoint working
- [ ] Test suite passing

### Frontend
- [ ] API URL updated to production backend
- [ ] Build tested locally (`npm run build`)
- [ ] Environment variables set
- [ ] Analytics configured (optional)
- [ ] Error tracking set up (optional)

### Testing
- [ ] Test with sample images
- [ ] Test with/without location
- [ ] Test on mobile devices
- [ ] Test camera functionality
- [ ] Test product recommendations
- [ ] Load testing completed (optional)

## Deployment Steps

### Backend Deployment (Choose One)

#### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create k18-hair-api

# Set Python version
echo "python-3.10.*" > runtime.txt

# Create Procfile
echo "web: uvicorn main:app --host=0.0.0.0 --port=\${PORT:-8000}" > Procfile

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

#### Option 2: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and init
railway login
railway init

# Deploy
railway up
```

#### Option 3: AWS EC2
```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance

# Install dependencies
sudo apt update
sudo apt install python3-pip
pip3 install -r requirements.txt

# Run with systemd or PM2
```

#### Option 4: Docker
```dockerfile
# Dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t k18-backend .
docker run -p 8000:8000 k18-backend
```

### Frontend Deployment (Choose One)

#### Option 1: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo in Vercel dashboard
```

#### Option 2: Netlify
```bash
# Build
npm run build

# Deploy via Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# Or drag & drop dist/ folder in Netlify dashboard
```

#### Option 3: GitHub Pages
```bash
# Build
npm run build

# Deploy
npx gh-pages -d dist
```

## Post-Deployment

### Configuration Updates

**Frontend (`src/pages/ChatNew.tsx`):**
```typescript
// Replace
const response = await fetch("http://localhost:8000/analyze", {

// With
const response = await fetch("https://your-backend-url.com/analyze", {
```

**Backend (`main.py`):**
```python
# Update CORS origins
allow_origins=[
    "https://your-frontend-url.com",
    "http://localhost:5173"  # Keep for development
]
```

### SSL/HTTPS

- [ ] SSL certificate installed (Let's Encrypt, Cloudflare, etc.)
- [ ] HTTPS redirect configured
- [ ] Mixed content warnings resolved

### Domain Setup

- [ ] Custom domain connected
- [ ] DNS records configured
- [ ] SSL certificate issued

### Monitoring

- [ ] Health checks configured
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Uptime monitoring (UptimeRobot, etc.)
- [ ] Analytics enabled (Google Analytics, etc.)

### Security

- [ ] API keys in environment variables (not hardcoded)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] File upload size limits set
- [ ] HTTPS enforced

## Environment Variables

### Backend (.env)
```bash
# Optional: Add if using paid weather APIs
WEATHER_API_KEY=your_key_here

# Optional: Model paths
MODEL_PATH=/path/to/model.pth

# Production settings
DEBUG=False
ALLOWED_HOSTS=your-domain.com
```

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend-url.com
VITE_ANALYTICS_ID=your_id_here
```

## Performance Optimization

### Backend
- [ ] Enable gzip compression
- [ ] Add caching for weather data
- [ ] Optimize model loading (load once on startup)
- [ ] Use CDN for static assets
- [ ] Database connection pooling (if using DB)

### Frontend
- [ ] Code splitting enabled
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Bundle size analyzed
- [ ] CDN for static assets

## Testing in Production

```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Test products endpoint
curl https://your-backend-url.com/products

# Test analyze endpoint (with image)
curl -X POST https://your-backend-url.com/analyze \
  -F "image=@test.jpg" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060"
```

## Rollback Plan

### If something goes wrong:

**Backend:**
```bash
# Heroku
heroku rollback

# Railway
railway rollback

# Manual
git revert HEAD
git push
```

**Frontend:**
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# Manual
git revert HEAD
npm run build
netlify deploy --prod --dir=dist
```

## Common Issues

### CORS Errors
- Check `allow_origins` in `main.py`
- Ensure protocol matches (http vs https)
- Clear browser cache

### Image Upload Fails
- Check file size limits
- Verify CORS headers include file uploads
- Check Content-Type headers

### Model Not Loading
- Ensure model file exists at path
- Check file permissions
- System will fall back to heuristics

### Camera Not Working
- Must use HTTPS in production
- Check browser permissions
- Provide fallback to file upload

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Update dependencies monthly
- [ ] Review analytics monthly
- [ ] Backup data regularly
- [ ] Test critical paths monthly

### Updates
- [ ] Test in staging first
- [ ] Document changes
- [ ] Notify users of major changes
- [ ] Keep rollback plan ready

## Success Criteria

- [ ] Backend health check returns 200
- [ ] Frontend loads in < 3 seconds
- [ ] Image upload works
- [ ] Analysis completes in < 10 seconds
- [ ] Recommendations display correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] SSL certificate valid

## Support

- Backend logs: Check your hosting provider's logs
- Frontend logs: Browser console (F12)
- API docs: https://your-backend-url.com/docs

## Documentation Links

- [ ] Update README with production URLs
- [ ] Add deployment section to docs
- [ ] Document environment variables
- [ ] Create troubleshooting guide

---

**Last Updated**: [Date]
**Deployed By**: [Name]
**Production URLs**:
- Backend: https://_______________
- Frontend: https://_______________
