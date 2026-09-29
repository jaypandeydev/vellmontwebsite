# Deployment Guide - Vellmont Services Website

This guide covers deploying the Vellmont Services website to Hostinger VPS using Coolify.

## 🚀 Quick Deployment Summary

✅ **Repository**: https://github.com/jaypandeydev/vellmontwebsite  
✅ **Containerized**: Docker + Nginx production setup  
✅ **Coolify Ready**: Pre-configured for automatic deployment  
✅ **Health Checks**: Built-in monitoring and health endpoints  

## 📋 Prerequisites

1. **Hostinger VPS** with Coolify installed
2. **Domain** (optional, can use IP address)
3. **GitHub** repository access
4. **SSL Certificate** (Coolify can handle this automatically)

## 🔧 Coolify Deployment Steps

### Step 1: Connect Repository
1. Log into your Coolify dashboard
2. Click "New Application"
3. Select "GitHub Repository"
4. Connect: `https://github.com/jaypandeydev/vellmontwebsite`
5. Select branch: `main`

### Step 2: Configure Build Settings
Coolify will automatically detect:
- ✅ **Dockerfile** (production build)
- ✅ **Build context** (root directory)
- ✅ **Port mapping** (80)
- ✅ **Health checks** (/health endpoint)

### Step 3: Environment Configuration
Set these environment variables in Coolify:
```env
NODE_ENV=production
PORT=80
```

### Step 4: Domain Configuration (Optional)
- Add your domain in Coolify settings
- Enable SSL (Let's Encrypt automatic)
- Configure DNS to point to your VPS IP

### Step 5: Deploy
1. Click "Deploy" in Coolify
2. Monitor build logs
3. Wait for deployment completion
4. Access your website!

## 🐳 Docker Configuration Details

### Production Build Process
```dockerfile
# Multi-stage build
1. Node.js build stage (dependencies + build)
2. Nginx production stage (serve static files)
```

### Key Features
- **Optimized Build**: Multi-stage Docker build
- **Nginx Configuration**: Custom config for SPA routing
- **Health Checks**: `/health` endpoint for monitoring
- **Security Headers**: XSS protection, CSRF, etc.
- **Gzip Compression**: Optimized asset delivery
- **Static Asset Caching**: 1-year cache for assets

### Ports
- **Production**: Port 80 (HTTP)
- **Development**: Port 5173 (Vite dev server)

## 💼 Careers API (separate service)

`/careers` submits applications to a small Node + Postgres service in
[`server/`](server/README.md). The static site deploy does **not** deploy it.
It runs as the `vellmont-careers` systemd unit on port 4010 and Caddy proxies
`/api/careers/*` and `/careers/review*` to it (see the `@careers` block in
`Caddyfile`). Setup, required environment variables and the release steps are
in `server/README.md`. Until it is configured, the form shows an honest error
and stores nothing.

## 🔍 Health Monitoring

### Health Check Endpoint
```
GET /health
Response: "healthy"
```

### Docker Health Check
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3
- **Start Period**: 40 seconds

## 🛠️ Local Testing (Optional)

If you want to test locally before deployment:

```bash
# Build and run production container
docker build -t vellmont-website .
docker run -p 3000:80 vellmont-website

# Or use docker-compose
docker-compose up

# Development mode
docker-compose --profile dev up
```

## 📊 Performance Optimizations

### Nginx Optimizations
- **Gzip Compression**: Enabled for all text assets
- **Static Caching**: 1-year cache for images, fonts, etc.
- **Security Headers**: Full security header suite
- **SPA Routing**: Proper React Router support

### Build Optimizations
- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Minified CSS/JS
- **Image Optimization**: Responsive images

## 🔒 Security Features

### Nginx Security Headers
```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self' http: https: data: blob: 'unsafe-inline'
```

### Container Security
- **Non-root user**: Nginx runs as nginx user
- **Minimal base image**: Alpine Linux
- **No unnecessary packages**: Production-only dependencies

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (requires 18+)
   - Verify all dependencies in package.json
   - Check build logs in Coolify

2. **Health Check Fails**
   - Verify `/health` endpoint responds
   - Check nginx configuration
   - Ensure port 80 is accessible

3. **Static Assets Not Loading**
   - Check nginx configuration
   - Verify build output in `/dist` folder
   - Check asset paths in built files

4. **React Router Not Working**
   - Verify nginx `try_files` configuration
   - Check SPA routing setup
   - Ensure all routes fall back to `index.html`

### Debug Commands
```bash
# Check container logs
docker logs <container-id>

# Access container shell
docker exec -it <container-id> /bin/sh

# Test health endpoint
curl http://localhost/health

# Check nginx config
docker exec <container-id> nginx -t
```

## 📞 Support

For deployment issues:
1. Check Coolify logs
2. Verify GitHub repository access
3. Test Docker build locally
4. Contact support@vellmontservices.com for assistance
5. Contact Hostinger support for VPS issues

## 🎉 Post-Deployment

After successful deployment:
1. ✅ Test all pages and functionality
2. ✅ Verify mobile responsiveness
3. ✅ Check loading speeds
4. ✅ Test contact forms
5. ✅ Verify SEO meta tags
6. ✅ Set up monitoring/analytics

---

**Deployment Complete!** 🚀  
Your Vellmont Services website is now live and ready to serve customers.

**Repository**: https://github.com/jaypandeydev/vellmontwebsite
