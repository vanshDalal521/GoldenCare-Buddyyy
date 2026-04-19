# 🤖 GoldenCare Buddy Backend - AI Voice Calling System

## 🎯 What This Does

This is a **REAL, production-ready backend** that:
- ✅ **Stores real patient data** in MongoDB
- ✅ **Makes actual AI voice calls** using Twilio + OpenAI
- ✅ **Custom medication times** set by doctors
- ✅ **Automatic scheduling** - calls at exact medication time
- ✅ **Caller ID**: Shows "AI Bot Call" (or your Twilio number)
- ✅ **AI voice says**: medication name, dosage, pill count, instructions

---

## 🚀 Quick Start

### **1. Install Dependencies**

```bash
cd goldencare-buddy-backend
npm install
```

### **2. Set Up Environment Variables**

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use any text editor
```

### **3. Get Required Credentials**

#### **MongoDB (Required)**
```bash
# Option 1: Local MongoDB
brew install mongodb-community  # Mac
# or download from https://www.mongodb.com/try/download/community

# Start MongoDB
brew services start mongodb-community

# Use in .env:
MONGODB_URI=mongodb://localhost:27017/goldencare-buddy
```

```bash
# Option 2: Cloud MongoDB (Recommended)
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free account
# 3. Create cluster
# 4. Get connection string
# 5. Use in .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/goldencare-buddy
```

#### **Twilio (Required for Real Calls)**
```bash
# 1. Go to https://www.twilio.com/try-twilio
# 2. Sign up (free trial gives $15 credit)
# 3. Get your credentials from console
# 4. Buy a phone number ($1/month)

# Add to .env:
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

#### **OpenAI (Required for AI Voice)**
```bash
# 1. Go to https://platform.openai.com/signup
# 2. Create account
# 3. Add payment method ($5 minimum)
# 4. Get API key from https://platform.openai.com/api-keys

# Add to .env:
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **4. Start the Server**

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 GoldenCare Buddy Backend Server
📡 Server running on port 3001
📞 Twilio Status: ✅ Configured
🤖 OpenAI Status: ✅ Configured
⏰ Medication Scheduler: ✅ Running
💡 Ready to make AI voice calls!
```

---

## 📱 How AI Voice Calls Work

### **Flow:**

```
1. Doctor adds medication with custom time: "12:00 AM"
         ↓
2. Backend saves to MongoDB
         ↓
3. Scheduler checks every minute
         ↓
4. At 12:00 AM, finds the medication
         ↓
5. Generates AI voice using OpenAI TTS:
   "Hello [Patient Name], this is your medication reminder.
    It's time to take [Medication Name], take [1/2] pill(s) of [500mg].
    [Instructions]. Press 1 to confirm."
         ↓
6. Calls patient's mobile using Twilio
         ↓
7. Patient answers → Hears AI voice
         ↓
8. Patient presses 1 → Medication marked as taken
         ↓
9. Frontend syncs → Shows "✓ Taken"
```

---

## 🧪 Testing

### **Test 1: Register a Patient**

```bash
curl -X POST http://localhost:3001/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vansh Dalal",
    "patientId": "vansh123",
    "password": "test123",
    "mobile": "9876543210",
    "countryCode": "+91"
  }'
```

### **Test 2: Add Medication with Custom Time**

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
    "frequency": "Once daily",
    "notes": "Take with water after dinner",
    "prescribedBy": "Dr. Sharma"
  }'
```

### **Test 3: Manually Trigger a Call**

```bash
# Get medication ID from previous response
curl -X POST http://localhost:3001/api/test/trigger-call/[MEDICATION_ID]
```

This will immediately make an AI voice call!

---

## 📞 What Patients Hear on Call

**AI Bot says:**

> "Hello Vansh Dalal, this is your medication reminder from GoldenCare Buddy. It's time to take your medicine. The medication is Aspirin, take 2 pills of 500mg. Please note: Take with water after dinner. If you have taken your medication, please press 1 to confirm. If you need a reminder in 10 minutes, press 2. Thank you and take care!"

**Then waits for patient to press:**
- **1** = Confirms medication taken
- **2** = Snooze for 10 minutes
- **No response** = Calls again later

---

## 🔧 API Endpoints

### **Patients**

```bash
# Register
POST /api/patients/register
Body: { name, patientId, password, mobile, countryCode }

# Login
POST /api/patients/login
Body: { patientId, password }

# Get medications
GET /api/patients/:patientId/medications

# Get all patients
GET /api/patients
```

### **Medications**

```bash
# Add medication
POST /api/medications/add
Body: {
  patientId,
  name,
  dosage,
  pillCount,
  customTime,  // e.g., "12:00 AM", "08:30 PM"
  slot,
  frequency,
  notes,
  prescribedBy
}

# Update medication
PUT /api/medications/:medicationId
Body: { ...updates }

# Delete medication
DELETE /api/medications/:medicationId

# Mark as taken
POST /api/medications/:medicationId/mark-taken
Body: { method, confirmedVia }
```

### **Testing & Monitoring**

```bash
# Trigger manual call
POST /api/test/trigger-call/:medicationId

# Get scheduler status
GET /api/scheduler/status

# Get call logs
GET /api/call-logs?patientId=vansh123&limit=50

# Health check
GET /health
```

---

## ⚙️ Configuration

### **Custom Time Format**

Medications use 12-hour format:
- `12:00 AM` - Midnight
- `08:00 AM` - 8 AM
- `02:30 PM` - 2:30 PM
- `11:45 PM` - 11:45 PM

### **Voice Options**

OpenAI TTS voices (`AI_VOICE_TYPE` in .env):
- `alloy` - Neutral, balanced (default)
- `echo` - Male voice
- `fable` - British accent
- `onyx` - Deep male voice
- `nova` - Female voice
- `shimmer` - Soft female voice

### **Country Codes**

Default: `+91` (India)
- USA: `+1`
- UK: `+44`
- Australia: `+61`

---

## 💰 Costs (Per Month for 100 Patients)

### **Twilio**
- Phone number: $1/month
- Calls: $0.013/minute × 4 calls/day × 100 patients × 30 days
- Average call duration: 1 minute
- **Total**: ~$157/month

### **OpenAI TTS**
- $15 per million characters
- ~100 characters per call
- 4 calls/day × 100 patients × 30 days = 12,000 calls
- **Total**: ~$2/month

### **MongoDB Atlas**
- Free tier (512MB): $0
- Shared M10 (2GB): $10/month

### **Total Monthly Cost**: ~$160-170

---

## 🐛 Troubleshooting

### **"Twilio credentials not configured"**
```bash
# Add to .env:
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### **"OpenAI API key not configured"**
```bash
# Add to .env:
OPENAI_API_KEY=sk-your_key_here
```

### **"MongoDB connection error"**
```bash
# Check MongoDB is running:
brew services list  # Mac
sudo systemctl status mongod  # Linux

# Or use MongoDB Atlas cloud
```

### **"Call not going through"**
1. Check Twilio balance
2. Verify phone number is valid
3. Check call logs: `GET /api/call-logs`
4. Look at server console for errors

### **"Scheduler not working"**
```bash
# Check scheduler status:
curl http://localhost:3001/api/scheduler/status

# Restart server to restart scheduler
```

---

## 📊 Database Schema

### **Patient**
```javascript
{
  name: "Vansh Dalal",
  patientId: "vansh123",
  password: "hashed_password",
  mobile: "9876543210",
  countryCode: "+91",
  fcmToken: null,
  isActive: true,
  createdAt: "2024-10-15T...",
  lastLoginAt: "2024-10-15T..."
}
```

### **Medication**
```javascript
{
  patient: ObjectId("..."),
  name: "Aspirin",
  dosage: "500mg",
  pillCount: 2,
  customTime: "12:00 AM",
  slot: "Night",
  frequency: "Once daily",
  notes: "Take with water",
  prescribedBy: "Dr. Sharma",
  takenHistory: [
    {
      timestamp: "2024-10-15T00:00:00Z",
      method: "voice-call",
      confirmedVia: "phone-press-1"
    }
  ],
  isActive: true
}
```

### **CallLog**
```javascript
{
  patient: ObjectId("..."),
  medication: ObjectId("..."),
  callSid: "CA1234567890...",
  callStatus: "completed",
  phoneNumber: "+919876543210",
  patientConfirmed: true,
  digitPressed: "1",
  audioUrl: "http://localhost:3001/audio/reminder_...mp3",
  voiceMessage: "Hello Vansh...",
  scheduledFor: "2024-10-15T00:00:00Z",
  duration: 45
}
```

---

## 🎉 YOU'RE READY!

Your backend is now:
- ✅ Accepting real patient registrations
- ✅ Storing medications with custom times
- ✅ Making real AI voice calls
- ✅ Tracking everything in database
- ✅ Auto-scheduling based on medication times

**Next**: Update your frontend to connect to this backend!

See: `FRONTEND_INTEGRATION.md` for frontend code changes.
