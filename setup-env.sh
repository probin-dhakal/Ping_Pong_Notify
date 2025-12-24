#!/bin/bash

echo "🔧 Ping Pong Notify - Environment Setup Helper"
echo "==============================================="
echo ""

# Generate encryption key
echo "📝 Generating 32-character encryption key..."
ENCRYPTION_KEY=$(openssl rand -hex 16)
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""

# Backend .env template
echo "📄 Copy this to backend/.env:"
echo "==============================="
cat << EOF

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ping_pong_notify?retryWrites=true&w=majority

# Server
PORT=3000

# Frontend URL (Update after Vercel deployment)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail)
EMAIL=your-email@gmail.com
PASSWORD=your-gmail-app-password

# Encryption Key (Auto-generated)
ENCRYPTION_KEY=$ENCRYPTION_KEY

EOF

echo ""
echo "==============================="
echo ""

# Frontend .env template
echo "📄 Copy this to frontend/.env (for local dev):"
echo "=============================================="
cat << EOF

# Backend API URL
VITE_API_URL=http://localhost:3000/api

EOF

echo ""
echo "=============================================="
echo ""

echo "✅ Environment templates generated!"
echo ""
echo "📋 Next Steps:"
echo "1. Update MongoDB URI with your Atlas connection string"
echo "2. Add your Gmail email and App Password"
echo "3. After Vercel deployment, update FRONTEND_URL"
echo "4. For production frontend, set VITE_API_URL in Vercel dashboard"
echo ""
echo "🔐 How to get Gmail App Password:"
echo "   1. Go to myaccount.google.com/security"
echo "   2. Enable 2-Step Verification"
echo "   3. Go to App Passwords"
echo "   4. Generate password for 'Mail'"
echo ""
