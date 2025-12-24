# 🚀 Railway Deployment Guide

Deploy your Ping Pong Notify app on Railway with Node.js backend + Python scraper!

**Current Frontend URL:** https://ping-pong-notify.vercel.app/

---

## 📋 Prerequisites

1. **Railway Account** - [railway.app](https://railway.app)
2. **Code pushed to GitHub** - [github.com/probin-dhakal/Ping_Pong_Notify](https://github.com/probin-dhakal/Ping_Pong_Notify)
3. **MongoDB Atlas Connection String** - Already set up
4. **GitHub Connected to Railway** - For auto-deploy

---

## ✅ Step 1: Connect GitHub Repository

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Authorize Railway to access your GitHub
5. Select `Ping_Pong_Notify` repository
6. Click **Deploy Now**

---

## ✅ Step 2: Create Backend Service (Node.js)

1. In Railway Dashboard → Click **New Service**
2. Select **GitHub Repo**
3. Choose `Ping_Pong_Notify` repo
4. **Root Directory:** `/backend`
5. Click **Deploy**

---

## ✅ Step 3: Create Scraper Service (Python)

1. In Railway Dashboard → Click **New Service**
2. Select **GitHub Repo**
3. Choose `Ping_Pong_Notify` repo
4. **Root Directory:** `/scraper`
5. Click **Deploy**

---

## ✅ Step 4: Configure Environment Variables

### For Backend Service:

1. Click **Backend Service** → **Variables**
2. Add these environment variables:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ping_pong_notify
PORT=3000
FRONTEND_URL=https://ping-pong-notify.vercel.app
EMAIL=your-email@gmail.com
PASSWORD=your-gmail-app-password
ENCRYPTION_KEY=your-32-character-random-key
```

**To get your Railway Backend URL:**
- Backend Service → Settings → Public URL (copy this)
- Update frontend `.env` if needed

### For Scraper Service:

1. Click **Scraper Service** → **Variables**
2. Add any required variables:

```env
# Add if scraper needs any specific config
# (chromium is auto-installed on Railway Python tier)
```

---

## ✅ Step 5: Update Frontend (Already Deployed)

If your frontend needs the backend API URL:

1. Go to **Vercel Dashboard** → Your project
2. Go to **Settings** → **Environment Variables**
3. Update `VITE_API_URL`:

```env
VITE_API_URL=https://YOUR_RAILWAY_BACKEND_URL/api
```

Replace `YOUR_RAILWAY_BACKEND_URL` with the public URL from Railway backend service.

---

## 🔧 How Services Work

### Backend Service (Node.js)
- **Status:** `web` process type
- **Port:** 3000 (Railway assigns public URL)
- **Purpose:** API server, handles requests from frontend
- **Auto-restarts:** On failure
- **Scaling:** Automatic

### Scraper Service (Python)
- **Status:** `worker` process type
- **Purpose:** Runs LinkedIn scraper logic
- **Runs:** Once, or can be triggered by backend
- **Memory:** 512MB (Railway Python tier)

### Communication Between Services

**Option A: Backend triggers Scraper via HTTP**
```javascript
// In backend/routes/notification.route.js
const scraperURL = process.env.SCRAPER_URL;
fetch(`${scraperURL}/scrape`, { method: 'POST' })
```

**Option B: Scraper runs independently**
- Set up scheduled jobs in scraper
- Backend just uses the data from MongoDB

---

## 📊 Railway Pricing & Free Tier

- **$5/month free credit** (shared across all services)
- Backend (Node.js): ~$0.50/month (lightweight)
- Scraper (Python): ~$0.50/month (lightweight)
- **Total: Well within free tier!**

---

## 🧪 Testing Deployment

### Check Backend Health
```bash
curl https://YOUR_RAILWAY_BACKEND_URL/
```
Should return: `{ "message": "Backend is running" }`

### Monitor Logs
- Railway Dashboard → Service → Logs
- Watch for errors in real-time

---

## 🚨 Troubleshooting

### Backend won't start
- Check `MONGODB_URI` is correct
- Check `FRONTEND_URL` matches exactly
- Check all `.env` variables are set
- View logs in Railway dashboard

### Scraper won't run
- Check `requirements.txt` has all dependencies
- Check `linkedin_scraper.py` doesn't have hardcoded paths
- Ensure Chromium compatibility

### MongoDB connection fails
- Whitelist Railway IP: Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` or Railway's specific IP

---

## 📝 Files Changed for Railway

- `backend/Procfile` - Added (tells Railway to run Node.js server)
- `scraper/Procfile` - Added (tells Railway to run Python scraper)
- This file - Created

No other changes needed! Your code is already Railway-compatible. ✨

---

## 🎉 You're Live!

Your app is now deployed on Railway! 🚀
- Frontend: https://ping-pong-notify.vercel.app/
- Backend: https://YOUR_RAILWAY_BACKEND_URL/
- Scraper: Running as background worker

Monitor and scale from Railway Dashboard anytime.
