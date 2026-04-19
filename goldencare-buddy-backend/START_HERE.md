# 🚀 START HERE - Quick Setup Guide

## ⚡ **5-Minute Setup (Without Real Calls)**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Create `.env` File**
```bash
# Create .env file
cp .env.example .env
```

### **3. Edit `.env` (Minimum Config)**
Open `.env` in a text editor and set:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/goldencare-buddy
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key_here
AI_CALLER_NAME=AI Bot Call
AUDIO_STORAGE_TYPE=local
AUDIO_BASE_URL=http://localhost:3001/audio
```

### **4. Install MongoDB**

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download from: https://www.mongodb.com/try/download/community

**Ubuntu:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### **5. Start Backend**
```bash
npm run dev
```

✅ **You should see:**
```
✅ Connected to MongoDB
🚀 GoldenCare Buddy Backend Server
📡 Server running on port 3001
⏰ Medication Scheduler: ✅ Running
```

---

## 🧪 **Test It Now!**

### **Open a new terminal and run:**

**1. Register a Patient:**
```bash
curl -X POST http://localhost:3001/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vansh Dalal",
    "patientId": "vansh123",
    "password": "test123",
    "mobile": "9876543210"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3001/api/patients/login \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "vansh123",
    "password": "test123"
  }'
```

**3. Add Medication:**
```bash
curl -X POST http://localhost:3001/api/medications/add \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "vansh123",
    "name": "Aspirin",
    "dosage": "500mg",
    "pillCount": 2,
    "customTime": "12:00 AM",
    "slot": "Night",
    "notes": "Take with water",
    "prescribedBy": "Dr. Sharma"
  }'
```

**4. Check Scheduler:**
```bash
curl http://localhost:3001/api/scheduler/status
```

✅ **If all commands work, your backend is READY!**

---

## 📞 **For REAL Voice Calls**

### **Get Twilio Credentials:**

1. Go to: https://www.twilio.com/try-twilio
2. Sign up (get $15 free credit)
3. From console, get:
   - Account SID
   - Auth Token
4. Buy a phone number ($1/month)

### **Get OpenAI API Key:**

1. Go to: https://platform.openai.com/signup
2. Add $5 to account
3. Get API key from: https://platform.openai.com/api-keys

### **Add to `.env`:**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **Restart Backend:**
```bash
npm run dev
```

Now backend will make **REAL AI voice calls!** 🎉

---

## ❓ **Troubleshooting**

### **"Cannot connect to MongoDB"**
```bash
# Check if MongoDB is running:
brew services list  # Mac
sudo systemctl status mongodb  # Linux

# Or use cloud MongoDB:
# https://www.mongodb.com/cloud/atlas (free tier)
```

### **"Port 3001 already in use"**
```bash
# Change PORT in .env to 3002 or any other port
PORT=3002
```

### **"Module not found"**
```bash
# Make sure you installed dependencies:
npm install
```

---

## 🎯 **Next Steps**

1. ✅ Backend is running
2. ✅ Test APIs work
3. 🔄 Update frontend to connect to backend
4. 📱 Add Twilio + OpenAI for real calls
5. 🚀 Deploy to production

---

## 📚 **Documentation**

- `README.md` - Full documentation
- `.env.example` - All environment variables explained
- API endpoints - See `server.js` comments

---

**Ready? Start backend now!** 🚀

```bash
npm run dev
```
