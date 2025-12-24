# 🛠️ Deployment Commands Reference

Quick copy-paste commands for deployment.

---

## 🔑 Generate Environment Variables

```bash
# Generate 32-character encryption key
openssl rand -hex 16

# Or use the helper script
chmod +x setup-env.sh
./setup-env.sh
```

---

## 🖥️ GCP VM Setup Commands

```bash
# ===== INITIAL VM SETUP =====

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python and dependencies
sudo apt install -y python3 python3-pip python3-venv

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Verify installations
node --version
npm --version
python3 --version
pm2 --version
```

---

## 📦 Clone and Setup Project

```bash
# Clone repository
git clone https://github.com/probin-dhakal/Ping_Pong_Notify.git
cd Ping_Pong_Notify

# ===== BACKEND SETUP =====
cd backend
npm install

# Create .env file
cat > .env << 'EOF'
MONGODB_URI=your-mongodb-connection-string
PORT=3000
FRONTEND_URL=https://your-app.vercel.app
EMAIL=your-email@gmail.com
PASSWORD=your-app-password
ENCRYPTION_KEY=your-32-char-key
EOF

# Edit .env with your actual values
nano .env

# ===== PYTHON SCRAPER SETUP =====
cd ../scraper

# Create virtual environment
python3 -m venv venv

# Activate venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium
playwright install-deps chromium

# Deactivate venv
deactivate

# Return to backend
cd ../backend
```

---

## 🚀 Start Backend with PM2

```bash
# Start application
pm2 start server.js --name ping-pong-backend

# Save process list
pm2 save

# Setup auto-start on boot
pm2 startup
# Copy and execute the command it outputs

# View status
pm2 status

# View logs
pm2 logs ping-pong-backend

# View logs (last 50 lines)
pm2 logs ping-pong-backend --lines 50
```

---

## 📊 PM2 Management Commands

```bash
# Status of all processes
pm2 status

# View logs in real-time
pm2 logs ping-pong-backend

# Stop the application
pm2 stop ping-pong-backend

# Restart the application
pm2 restart ping-pong-backend

# Delete from PM2
pm2 delete ping-pong-backend

# Monitor CPU/Memory usage
pm2 monit

# Show process info
pm2 info ping-pong-backend

# Flush logs
pm2 flush
```

---

## 🔄 Update Deployed Application

```bash
# Navigate to project
cd ~/Ping_Pong_Notify

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install
pm2 restart ping-pong-backend

# Update Python dependencies (if changed)
cd ../scraper
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
deactivate
cd ../backend

# Check status
pm2 logs ping-pong-backend
```

---

## 🌐 Vercel Deployment Commands

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend
cd frontend

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add VITE_API_URL
# When prompted: http://YOUR_VM_IP:3000/api

# List environment variables
vercel env ls

# Pull environment variables locally
vercel env pull
```

---

## 🧪 Testing Commands

```bash
# ===== BACKEND TESTS =====

# Test backend locally
curl http://localhost:3000/

# Test from external machine (replace with your IP)
curl http://34.123.45.67:3000/

# Test registration endpoint
curl -X POST http://localhost:3000/api/notifications/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Test User",
    "linkedinEmail": "test@example.com",
    "linkedinPassword": "password123",
    "notificationEmail": "notify@example.com"
  }'

# Test unsubscribe endpoint
curl -X POST http://localhost:3000/api/notifications/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# ===== CHECK LOGS =====

# View all backend logs
pm2 logs ping-pong-backend

# View only error logs
pm2 logs ping-pong-backend --err

# View only output logs
pm2 logs ping-pong-backend --out

# Search logs for specific term
pm2 logs ping-pong-backend | grep -i "error"
pm2 logs ping-pong-backend | grep -i "cron"
pm2 logs ping-pong-backend | grep -i "mongodb"
```

---

## 🔥 GCP Firewall Commands

```bash
# Create firewall rule for Node.js app
gcloud compute firewall-rules create allow-node-app \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:3000 \
  --source-ranges=0.0.0.0/0

# List firewall rules
gcloud compute firewall-rules list

# Delete firewall rule
gcloud compute firewall-rules delete allow-node-app
```

---

## 🗄️ MongoDB Atlas Connection Test

```bash
# Install mongosh (MongoDB Shell)
sudo apt-get install -y mongodb-mongosh

# Test connection (replace with your connection string)
mongosh "mongodb+srv://user:password@cluster.mongodb.net/ping_pong_notify"

# Or test from Node.js
node -e "
const mongoose = require('mongoose');
mongoose.connect('your-connection-string')
  .then(() => console.log('✅ Connected'))
  .catch(err => console.error('❌ Error:', err));
"
```

---

## 📋 System Monitoring Commands

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check running processes
ps aux | grep node

# Check network connections
netstat -tulpn | grep :3000

# Check system logs
sudo journalctl -u pm2-root -f

# Check if port 3000 is listening
sudo lsof -i :3000
```

---

## 🔐 Security Commands

```bash
# Generate strong password/key
openssl rand -base64 32

# Generate encryption key (32 hex characters)
openssl rand -hex 16

# Check who's logged in
who

# View SSH login attempts
sudo grep "sshd" /var/log/auth.log | tail -20

# Update system packages
sudo apt update && sudo apt upgrade -y
```

---

## 🧹 Cleanup Commands

```bash
# Remove old logs
pm2 flush

# Clean npm cache
cd ~/Ping_Pong_Notify/backend
npm cache clean --force

# Remove Python cache
cd ~/Ping_Pong_Notify/scraper
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Check disk usage
du -sh ~/Ping_Pong_Notify/*
```

---

## 🆘 Emergency Commands

```bash
# Kill all Node.js processes
pkill node

# Restart PM2
pm2 kill
pm2 resurrect

# Check if server is responding
curl -I http://localhost:3000

# View recent system errors
sudo journalctl -p 3 -xb

# Reboot VM (if necessary)
sudo reboot
```

---

## 📝 Useful Aliases (Optional)

Add to `~/.bashrc` for shortcuts:

```bash
# Open .bashrc
nano ~/.bashrc

# Add these lines at the end:
alias pmlogs='pm2 logs ping-pong-backend'
alias pmstatus='pm2 status'
alias pmrestart='pm2 restart ping-pong-backend'
alias cdproject='cd ~/Ping_Pong_Notify/backend'
alias editenv='nano ~/Ping_Pong_Notify/backend/.env'

# Save and reload
source ~/.bashrc
```

Now you can use: `pmlogs`, `pmstatus`, `pmrestart`, etc.

---

## 🎯 Complete Deployment Script

Here's a single script to deploy everything:

```bash
#!/bin/bash
# Save as deploy.sh and run: chmod +x deploy.sh && ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install dependencies
echo "🔧 Installing dependencies..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs python3 python3-pip python3-venv git
sudo npm install -g pm2

# Clone repository
echo "📥 Cloning repository..."
git clone https://github.com/probin-dhakal/Ping_Pong_Notify.git
cd Ping_Pong_Notify

# Setup backend
echo "⚙️  Setting up backend..."
cd backend
npm install

# Setup Python scraper
echo "🐍 Setting up Python scraper..."
cd ../scraper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
playwright install-deps chromium
deactivate

# Prompt for environment variables
echo ""
echo "⚠️  Please create backend/.env file with your configuration"
echo "Press Enter when ready to continue..."
read

# Start with PM2
cd ../backend
pm2 start server.js --name ping-pong-backend
pm2 save
pm2 startup

echo ""
echo "✅ Deployment complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs ping-pong-backend"
```

---

**For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**
