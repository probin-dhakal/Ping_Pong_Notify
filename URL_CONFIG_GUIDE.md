# 🎯 Where to Put URLs - Quick Reference

## 📍 Backend Configuration

**File:** `backend/.env`

```env
# MongoDB Atlas connection (get from MongoDB Atlas dashboard)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ping_pong_notify

# Server port (keep as 3000 for GCP deployment)
PORT=3000

# ⭐ IMPORTANT: Your Vercel frontend URL goes here
FRONTEND_URL=https://your-app-name.vercel.app

# Gmail credentials for sending emails
EMAIL=your-email@gmail.com
PASSWORD=your-gmail-app-password

# Generated encryption key (32 characters)
ENCRYPTION_KEY=abcdef1234567890abcdef1234567890
```

### 🔄 When to Update:
- **During Development:** `FRONTEND_URL=http://localhost:5173`
- **After Vercel Deployment:** `FRONTEND_URL=https://your-vercel-url.vercel.app`

### 📝 How to Update on GCP VM:
```bash
ssh into-your-gcp-vm
cd ~/Ping_Pong_Notify/backend
nano .env
# Update FRONTEND_URL
pm2 restart ping-pong-backend
```

---

## 📍 Frontend Configuration

### Local Development

**File:** `frontend/.env` (create this file)

```env
# Your backend API URL (local or GCP)
VITE_API_URL=http://localhost:3000/api
```

### 🚀 Production (Vercel)

**Where:** Vercel Dashboard → Project Settings → Environment Variables

**Add this variable:**
```
Name:  VITE_API_URL
Value: http://YOUR_GCP_VM_IP:3000/api
```

**Example:**
```
Name:  VITE_API_URL
Value: http://34.123.45.67:3000/api
```

### 🔄 How to Add/Update in Vercel:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add/Edit `VITE_API_URL`
5. Value: `http://YOUR_GCP_VM_IP:3000/api`
6. Apply to: **Production**, **Preview**, **Development**
7. Click **Save**
8. **Redeploy** your project for changes to take effect

---

## 🔗 URL Flow Diagram

```
┌─────────────────────────────────────────────────┐
│  User visits:                                    │
│  https://your-app.vercel.app                    │
│                    ↓                             │
│  Frontend loads environment variable:            │
│  VITE_API_URL = http://34.123.45.67:3000/api   │
│                    ↓                             │
│  Makes API calls to:                             │
│  http://34.123.45.67:3000/api/notifications/*   │
│                    ↓                             │
│  Backend checks CORS:                            │
│  FRONTEND_URL = https://your-app.vercel.app     │
│                    ↓                             │
│  If origin matches, request allowed ✅           │
└─────────────────────────────────────────────────┘
```

---

## 📋 Step-by-Step Setup Guide

### Step 1: Get Your GCP VM IP Address
```bash
# In GCP Console → Compute Engine → VM Instances
# Look for "External IP" column
# Example: 34.123.45.67
```
**Save this IP!** You'll need it for:
- Frontend environment variable
- Testing backend

### Step 2: Deploy Backend to GCP
```bash
# SSH into VM and setup backend
# Create backend/.env with:
FRONTEND_URL=http://localhost:5173  # Temporarily
# (Will update after Vercel deployment)
```

### Step 3: Deploy Frontend to Vercel
```bash
# In Vercel dashboard, add environment variable:
VITE_API_URL=http://34.123.45.67:3000/api
# (Use your actual GCP VM IP)
```

### Step 4: Get Vercel URL
```bash
# After deployment, Vercel shows your URL:
# Example: https://ping-pong-notify-abc123.vercel.app
```

### Step 5: Update Backend with Vercel URL
```bash
# SSH back to GCP VM
cd ~/Ping_Pong_Notify/backend
nano .env
# Update: FRONTEND_URL=https://ping-pong-notify-abc123.vercel.app
pm2 restart ping-pong-backend
```

---

## ✅ Verification Checklist

### Backend Check:
- [ ] GCP VM is running
- [ ] Backend .env has correct FRONTEND_URL (Vercel URL)
- [ ] Backend .env has MongoDB Atlas connection
- [ ] Backend is running: `pm2 status`
- [ ] Test endpoint: `curl http://localhost:3000`

### Frontend Check:
- [ ] Vercel deployment successful
- [ ] Environment variable VITE_API_URL is set (GCP VM IP)
- [ ] Can access: `https://your-app.vercel.app`
- [ ] Browser console shows no CORS errors

### Integration Check:
- [ ] Can submit registration form
- [ ] Backend receives request (check `pm2 logs`)
- [ ] Email is sent successfully
- [ ] No CORS errors in browser console

---

## 🐛 Common Issues & Fixes

### Issue: CORS Error in Browser
**Cause:** Backend FRONTEND_URL doesn't match actual Vercel URL

**Fix:**
```bash
# On GCP VM
cd ~/Ping_Pong_Notify/backend
nano .env
# Make sure FRONTEND_URL exactly matches Vercel URL (including https://)
pm2 restart ping-pong-backend
```

### Issue: Frontend can't reach backend
**Cause:** VITE_API_URL not set or incorrect

**Fix:**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Check VITE_API_URL = `http://YOUR_VM_IP:3000/api`
4. Redeploy frontend

### Issue: 404 Not Found
**Cause:** API URL doesn't include `/api` suffix

**Fix:**
- Correct: `http://34.123.45.67:3000/api`
- Wrong: `http://34.123.45.67:3000`

---

## 🔐 Security Notes

### Production Best Practices:

1. **MongoDB IP Whitelist:**
   - After deployment works, restrict MongoDB access
   - Only allow your GCP VM IP

2. **HTTPS for Backend (Optional):**
   - Consider using Cloudflare or Nginx reverse proxy
   - Provides SSL/TLS encryption

3. **Environment Variables:**
   - Never commit `.env` files
   - Use different keys for dev/prod

---

## 📞 Need Help?

1. Check `DEPLOYMENT.md` for detailed instructions
2. Check `QUICK_DEPLOY.md` for quick reference
3. Run `./setup-env.sh` to generate environment templates

---

## 🎉 Success!

When everything works, you should see:
- ✅ Frontend loads at Vercel URL
- ✅ Form submission works
- ✅ Email notifications sent
- ✅ Cron jobs running every 3 hours
- ✅ No errors in browser console
- ✅ No errors in backend logs

**Your app is now live! 🚀**
