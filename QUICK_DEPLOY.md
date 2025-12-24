# 🚀 Quick Deployment Checklist

## Before Deployment

### 1. Create MongoDB Atlas Database
- [ ] Sign up at mongodb.com/cloud/atlas
- [ ] Create free cluster (M0)
- [ ] Create database user and save password
- [ ] Whitelist IP: 0.0.0.0/0 (temporarily)
- [ ] Copy connection string

### 2. Prepare Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ping_pong_notify
PORT=3000
FRONTEND_URL=https://your-app.vercel.app
EMAIL=your-email@gmail.com
PASSWORD=your-gmail-app-password
ENCRYPTION_KEY=your-32-char-random-key
```

**Frontend (Vercel Environment Variable):**
```env
VITE_API_URL=http://YOUR_VM_IP:3000/api
```

---

## Deployment Steps

### Step 1: Deploy Backend to GCP

```bash
# On GCP VM (after SSH)
git clone https://github.com/probin-dhakal/Ping_Pong_Notify.git
cd Ping_Pong_Notify/backend
npm install
nano .env  # Add your environment variables
cd ../scraper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
deactivate
cd ../backend
pm2 start server.js --name ping-pong-backend
pm2 save
pm2 startup
```

**Your Backend URL:** `http://YOUR_VM_IP:3000`

### Step 2: Deploy Frontend to Vercel

```bash
# Option 1: Via Vercel Dashboard
1. Go to vercel.com
2. Import GitHub repo
3. Root Directory: frontend
4. Add env var: VITE_API_URL = http://YOUR_VM_IP:3000/api
5. Deploy

# Option 2: Via CLI
cd frontend
vercel login
vercel
vercel env add VITE_API_URL
# Enter: http://YOUR_VM_IP:3000/api
vercel --prod
```

**Your Frontend URL:** `https://your-app.vercel.app`

### Step 3: Update Backend CORS

```bash
# SSH to GCP VM
cd ~/Ping_Pong_Notify/backend
nano .env
# Update: FRONTEND_URL=https://your-app.vercel.app
pm2 restart ping-pong-backend
```

---

## Testing

1. Visit: `https://your-app.vercel.app`
2. Register a test account
3. Check email for notification
4. Check logs: `pm2 logs ping-pong-backend`

---

## Useful Commands

```bash
# Backend management
pm2 status
pm2 logs ping-pong-backend
pm2 restart ping-pong-backend
pm2 stop ping-pong-backend

# Update code
cd ~/Ping_Pong_Notify
git pull
cd backend
npm install
pm2 restart ping-pong-backend

# Check if server is running
curl http://localhost:3000
```

---

## URLs to Save

- **Frontend:** https://your-app.vercel.app
- **Backend:** http://YOUR_VM_IP:3000
- **GCP Console:** console.cloud.google.com
- **Vercel Dashboard:** vercel.com/dashboard
- **MongoDB Atlas:** cloud.mongodb.com

---

## ⚠️ Important Notes

1. **Gmail App Password:**
   - Go to Google Account → Security → 2-Step Verification
   - App Passwords → Generate for "Mail"
   - Use this password in backend .env

2. **Encryption Key:**
   - Generate 32 random characters
   - Never share or commit to Git
   - Example: `openssl rand -hex 16`

3. **GCP Free Tier:**
   - Use e2-micro in us-west1, us-central1, or us-east1
   - Always free: 30GB storage + 1GB network

4. **Cron Jobs:**
   - Run every 3 hours automatically
   - Check logs: `pm2 logs ping-pong-backend | grep cron`

---

**Need Help?** Check DEPLOYMENT.md for detailed instructions.
