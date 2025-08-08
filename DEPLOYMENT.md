# 🚀 Vercel Deployment Guide

This guide will help you deploy your Anoma Intent Demo to Vercel in just a few steps.

## 📋 Prerequisites

- GitHub account with your repository
- Vercel account (free)
- Node.js 18+ (for local testing)

## 🎯 Quick Deploy Options

### Option 1: One-Click Deploy (Recommended)

1. **Click the deploy button**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Pratiikpy/anoma-game)

2. **Configure your project**:
   - Project name: `anoma-intent-demo` (or your preferred name)
   - Framework Preset: `Vite`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

3. **Add Environment Variables**:
   ```
   VITE_ANOMA_RPC_ENDPOINT=https://testnet.anoma.network
   VITE_APP_NAME=Anoma Intent Demo
   VITE_APP_VERSION=1.0.0
   VITE_APP_ENVIRONMENT=production
   ```

4. **Deploy!** Click "Deploy" and wait for the build to complete.

### Option 2: Manual Deploy via GitHub

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"

3. **Import your repository**:
   - Select your `anoma-game` repository
   - Vercel will auto-detect it's a Vite project
   - Click "Import"

4. **Configure project settings**:
   - Project name: `anoma-intent-demo`
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add the following:
     ```
     VITE_ANOMA_RPC_ENDPOINT=https://testnet.anoma.network
     VITE_APP_NAME=Anoma Intent Demo
     VITE_APP_VERSION=1.0.0
     VITE_APP_ENVIRONMENT=production
     ```

6. **Deploy**: Click "Deploy" and wait for completion.

### Option 3: Vercel CLI Deploy

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

## 🔧 Configuration Files

Your project includes these Vercel-optimized files:

### `vercel.json`
- Configures build settings
- Sets up routing for SPA
- Adds security headers
- Defines environment variables

### `public/_redirects`
- Handles client-side routing
- Ensures all routes work properly

### `vite.config.ts`
- Optimized for production builds
- Code splitting configuration
- Bundle analysis ready

## 🌐 Custom Domain (Optional)

1. **Add custom domain**:
   - Go to your Vercel project dashboard
   - Click "Settings" → "Domains"
   - Add your custom domain

2. **Configure DNS**:
   - Add CNAME record pointing to your Vercel URL
   - Wait for DNS propagation

## 📊 Performance Optimization

Your deployment includes:

- ✅ **Code Splitting**: Automatic chunk splitting for faster loading
- ✅ **Compression**: Gzip compression for smaller bundle sizes
- ✅ **Caching**: Optimized caching headers for static assets
- ✅ **CDN**: Global CDN for fast worldwide access
- ✅ **HTTPS**: Automatic SSL certificates

## 🔍 Monitoring & Analytics

1. **Vercel Analytics** (Optional):
   - Enable in project settings
   - Track performance metrics
   - Monitor user behavior

2. **Error Monitoring**:
   - Built-in error tracking
   - Performance monitoring
   - Real-time alerts

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**:
   - Ensure all required env vars are set
   - Check variable names (must start with `VITE_`)

3. **Routing Issues**:
   - Verify `_redirects` file is in `public/`
   - Check `vercel.json` routing configuration

4. **Performance Issues**:
   - Enable Vercel Analytics
   - Check bundle size with `npm run analyze`
   - Optimize images and assets

### Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Project Issues**: [github.com/Pratiikpy/anoma-game/issues](https://github.com/Pratiikpy/anoma-game/issues)

## 🎉 Success!

Once deployed, your Anoma dApp will be:

- ✅ **Live on the internet** with a public URL
- ✅ **Optimized for performance** with CDN and compression
- ✅ **Secure** with HTTPS and security headers
- ✅ **Scalable** with automatic scaling
- ✅ **Monitored** with built-in analytics

**Your production-ready Anoma dApp is now live! 🚀** 