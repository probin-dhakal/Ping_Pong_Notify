# 🚀 Deployment Guide

This guide covers deploying your Ping Pong Notify application to production.

**Architecture:**
- Frontend: Vercel
- Backend: GCP Compute Engine (f1-micro free tier)
- Database: MongoDB Atlas (free tier)

---

## 📋 Prerequisites

1. **GCP Account** - [console.cloud.google.com](https://console.cloud.google.com)
2. **Vercel Account** - [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **GitHub Account** - Code pushed to GitHub

---

## 1️⃣ Setup MongoDB Atlas (Database)

### Create Free Cluster:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project: `Ping_Pong_Notify`
3. Build a Database → Free Shared Cluster (M0)
4. Choose region closest to your GCP VM region
5. Cluster Name: `ping-pong-cluster`

### Configure Security:
1. **Database Access:**
   - Create a database user
   - Username: `pingpong_user`
   - Password: Generate a strong password
   - Save this password securely!

2. **Network Access:**
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - ⚠️ Note: In production, restrict to your GCP VM IP only

### Get Connection String:
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://pingpong_user:<password>@ping-pong-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `ping_pong_notify`
   ```
   mongodb+srv://pingpong_user:YOUR_PASSWORD@ping-pong-cluster.xxxxx.mongodb.net/ping_pong_notify?retryWrites=true&w=majority
   ```

---

## 2️⃣ Deploy Backend to GCP Compute Engine

### Create VM Instance:

1. **Go to GCP Console** → Compute Engine → VM Instances
2. **Create Instance:**
   - **Name:** `ping-pong-backend`
   - **Region:** `us-west1`, `us-central1`, or `us-east1` (free tier eligible)
   - **Machine type:** `e2-micro` (free tier)
   - **Boot disk:** 
     - OS: Ubuntu 22.04 LTS
     - Size: 30 GB (free tier)
   - **Firewall:** 
     - ✅ Allow HTTP traffic
     - ✅ Allow HTTPS traffic
   - Click **Create**

3. **Note your External IP address** (e.g., `34.123.456.78`)

### Configure Firewall Rules:

1. Go to **VPC Network → Firewall**
2. **Create Firewall Rule:**
   - Name: `allow-node-app`
   - Direction: Ingress
   - Targets: All instances in the network
   - Source IP ranges: `0.0.0.0/0`
   - Protocols and ports: `tcp:3000`
   - Click **Create**

### SSH into VM:

Click **SSH** button in VM instances list to open a terminal.

### Install Node.js, Python, and Dependencies:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3 and pip
sudo apt install -y python3 python3-pip python3-venv

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Verify installations
node --version
npm --version
python3 --version
```

### Clone and Setup Backend:

```bash
# Clone your repository
git clone https://github.com/probin-dhakal/Ping_Pong_Notify.git
cd Ping_Pong_Notify

# Setup backend
cd backend
npm install

# Create .env file
nano .env
```

### Backend .env Configuration:

```env
# Database (MongoDB Atlas connection string)
MONGODB_URI=mongodb+srv://pingpong_user:YOUR_PASSWORD@ping-pong-cluster.xxxxx.mongodb.net/ping_pong_notify?retryWrites=true&w=majority

# Server
PORT=3000

# Frontend URL (Vercel URL - update after frontend deployment)
FRONTEND_URL=https://your-app.vercel.app

# Email Configuration (Gmail)
EMAIL=your-email@gmail.com
PASSWORD=your-gmail-app-password

# Encryption Key (generate 32 random characters)
ENCRYPTION_KEY=abcdef1234567890abcdef1234567890
```

**Important Notes:**
- Replace MongoDB connection string with your actual Atlas connection
- Replace Gmail credentials (use App Password, not regular password)
- Generate a random 32-character encryption key
- `FRONTEND_URL` will be updated after Vercel deployment

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

### Setup Python Scraper:

```bash
# Navigate to scraper directory
cd ../scraper

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium
playwright install-deps chromium

# Deactivate virtual environment
deactivate

# Return to backend directory
cd ../backend
```

### Start Backend with PM2:

```bash
# Start the application
pm2 start server.js --name ping-pong-backend

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs ping-pong-backend
```

### Test Backend:

```bash
# Test from VM
curl http://localhost:3000/

# Test from your computer (replace with your VM IP)
curl http://34.123.456.78:3000/
```

You should see: `{"message":"Backend is running"}`

### Your Backend URL is:
```
http://YOUR_VM_EXTERNAL_IP:3000
```

Example: `http://34.123.456.78:3000`

---

## 3️⃣ Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Push code to GitHub** (if not already done)
2. Go to [vercel.com](https://vercel.com) → Sign in
3. Click **"Add New" → "Project"**
4. Import your GitHub repository: `Ping_Pong_Notify`
5. **Configure Project:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Environment Variables:**
   - Click "Environment Variables"
   - Add variable:
     - **Name:** `VITE_API_URL`
     - **Value:** `http://YOUR_VM_IP:3000/api`
     - Example: `http://34.123.456.78:3000/api`

7. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: ping-pong-notify
# - Directory: ./
# - Override settings? N

# Add environment variable
vercel env add VITE_API_URL

# When prompted, enter: http://YOUR_VM_IP:3000/api

# Deploy to production
vercel --prod
```

### Get Your Frontend URL:

After deployment completes, Vercel will give you a URL like:
```
https://ping-pong-notify-xyz123.vercel.app
```

---

## 4️⃣ Update Backend with Frontend URL

Now that you have your Vercel URL, update the backend:

### SSH back into GCP VM:

```bash
cd ~/Ping_Pong_Notify/backend
nano .env
```

### Update FRONTEND_URL:

```env
FRONTEND_URL=https://your-app.vercel.app
```

Replace with your actual Vercel URL.

**Save:** `Ctrl+X`, `Y`, `Enter`

### Restart Backend:

```bash
pm2 restart ping-pong-backend
pm2 logs ping-pong-backend
```

---

## 5️⃣ Testing Your Deployment

### Test Backend API:
```bash
curl https://your-backend-ip:3000/
```

### Test Frontend:
Open browser: `https://your-app.vercel.app`

### Test Full Flow:
1. Open your Vercel frontend URL
2. Fill in the registration form
3. Submit and check if you receive an email
4. Check backend logs: `pm2 logs ping-pong-backend`

---

## 🔒 Post-Deployment Security

### 1. Restrict MongoDB Access:
- Go to MongoDB Atlas → Network Access
- Remove `0.0.0.0/0`
- Add only your GCP VM external IP

### 2. Setup HTTPS (Optional but Recommended):
- Use Cloudflare or Nginx with Let's Encrypt SSL
- This protects your API communication

### 3. Environment Variables:
- Never commit `.env` files to Git
- Rotate encryption keys periodically

---

## 📊 Monitoring & Maintenance

### Check Backend Logs:
```bash
pm2 logs ping-pong-backend
```

### Check Backend Status:
```bash
pm2 status
```

### Restart Backend:
```bash
pm2 restart ping-pong-backend
```

### Update Code:
```bash
cd ~/Ping_Pong_Notify
git pull origin main
cd backend
npm install
pm2 restart ping-pong-backend
```

### Check MongoDB Connection:
```bash
pm2 logs ping-pong-backend | grep -i mongo
```

---

## 🆘 Troubleshooting

### Backend not starting:
```bash
pm2 logs ping-pong-backend --lines 50
```

### Frontend can't reach backend:
- Check CORS settings in backend
- Verify `VITE_API_URL` in Vercel environment variables
- Check GCP firewall allows port 3000

### Emails not sending:
- Verify Gmail App Password (not regular password)
- Check Gmail account security settings
- Check backend logs for error messages

### Cron jobs not running:
```bash
pm2 logs ping-pong-backend | grep -i cron
```

---

## 💰 Cost Estimate

- **GCP f1-micro VM:** FREE (always free tier)
- **MongoDB Atlas M0:** FREE (512 MB storage)
- **Vercel Hobby:** FREE (100 GB bandwidth/month)

**Total Monthly Cost: $0** 🎉

---

## 🔗 Quick Reference URLs

After deployment, save these:

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `http://YOUR_VM_IP:3000`
- **MongoDB Atlas:** [cloud.mongodb.com](https://cloud.mongodb.com)
- **GCP Console:** [console.cloud.google.com](https://console.cloud.google.com)
- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)

---

## 📝 Environment Variables Checklist

### Backend (.env):
- [x] MONGODB_URI
- [x] PORT
- [x] FRONTEND_URL
- [x] EMAIL
- [x] PASSWORD
- [x] ENCRYPTION_KEY

### Frontend (Vercel):
- [x] VITE_API_URL

---

**Deployment Complete! 🚀**

Your application is now live and ready to use!
