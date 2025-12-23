# 🚀 LinkedIn Proactive Notification System

## 📌 Overview (Core Idea)

This project is a **full-stack automation framework** that allows users to receive **periodic email summaries of their own LinkedIn activity**, specifically:

- Unread LinkedIn messages  
- Unread LinkedIn notifications  

Users explicitly provide consent and credentials to enable automation. The system securely handles credentials, retrieves activity data using browser automation, and sends email updates **immediately after registration and then every three hours**.

> ⚠️ This project is built for **educational and demonstration purposes only** and is **not intended for production use**.

---

## 🎯 Problem Statement

LinkedIn users often miss important messages and notifications due to busy schedules.  
This project solves that problem by:

- Automating the retrieval of LinkedIn unread activity
- Sending timely email summaries
- Running fully in the background without user intervention

---

## 🧠 Core Concept

1. User registers via a web interface  
2. Credentials are **encrypted and stored securely**  
3. Backend automation logs into LinkedIn **on behalf of the user**  
4. Activity data is retrieved  
5. Email summary is sent immediately  
6. A scheduler continues the process every 3 hours  

---

## 🔄 Application Flow (Start → End)

### 1️⃣ User Registration (Frontend)
- User enters:
  - Name
  - LinkedIn email
  - LinkedIn password
  - Notification email
- User submits the form

### 2️⃣ Backend Processing
- Input is validated
- LinkedIn password is **AES-encrypted**
- User data is stored in MongoDB
- Python automation is triggered immediately

### 3️⃣ Automation & Data Retrieval
- Python (Playwright) logs into LinkedIn
- Fetches unread messages & notifications
- Returns structured JSON data to Node.js

### 4️⃣ Email Notification
- Backend sends an **immediate email summary**
- Scheduler is set up to repeat the process every 3 hours

### 5️⃣ Scheduled Execution
- Every 3 hours:
  - Data is fetched again
  - Differences from previous data are calculated
  - Updated email summary is sent

---

## 🏗️ System Architecture (High Level)

    React Frontend
    ↓
    Express Backend (Node.js)
    ↓
    MongoDB (Encrypted Credentials & Activity Logs)
    ↓
    Python Automation (Playwright)
    ↓
    Email Service (Nodemailer + Mailgen)
    ↓
    Scheduler (node-cron)


---

## 🖥️ Frontend (React + Vite)

### Key Features
- Single-page registration form
- Clean and simple UI
- Loading, success, and error states
- Clear messaging about:
  - Immediate notification
  - Recurring notifications
  - Data safety and encryption

### Technologies Used
- React
- Vite
- Fetch API
- CSS

---

## 🧩 Backend (Node.js + Express)

### Key Responsibilities
- API handling
- Input validation
- Credential encryption
- Database interaction
- Job scheduling
- Email orchestration
- Python automation orchestration

### Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Crypto-JS
- Nodemailer
- Mailgen
- node-cron

---

## 🔐 Security & Credential Handling

- LinkedIn passwords are **never stored in plaintext**
- AES encryption is applied before saving credentials
- Decryption occurs **only at runtime**
- Encrypted data is stored in MongoDB
- All secrets are managed using environment variables

> Administrators and developers cannot view user passwords in plaintext.

---

## 🗄️ Database (MongoDB)

### Collections

#### Users
- Username
- LinkedIn email
- Encrypted password
- Notification email

#### Activity Logs
- User ID
- Unread messages count
- Unread notifications count
- Timestamp

These logs enable **change comparison** between scheduled runs.

---

## 🐍 Automation Layer (Python + Playwright)

### Why Playwright?
- Works reliably in cloud environments (GitHub Codespaces)
- Ships with its own Chromium binary
- No dependency on system-installed browsers
- Ideal for headless automation

### Responsibilities
- Automated LinkedIn login
- Fetch unread message count
- Fetch unread notification count
- Return clean JSON output to the backend

---

## ⏰ Scheduler (node-cron)

- Runs every **3 hours**
- Triggers automation for each registered user
- Sends updated email summaries
- Keeps execution logic separate from scheduling

Cron expression used:
   0 */3 * * *


---

## 📧 Email System

### Features
- Immediate confirmation email after registration
- Periodic LinkedIn activity summary emails
- Structured and readable HTML email format

### Tools Used
- Nodemailer (SMTP)
- Mailgen (HTML email generation)
- Gmail App Passwords

---

## ⚠️ Limitations & Notes

- CAPTCHA / OTP handling is **out of scope**
- LinkedIn UI changes may break selectors
- This application is **not production-ready**
- Built strictly for learning, demos, and portfolio purposes

---

