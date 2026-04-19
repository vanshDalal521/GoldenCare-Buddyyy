# 🤖 AI Voice Call & Push Notifications Setup Guide

## 🎯 Overview

This guide explains how to implement AI voice calling and push notifications for medication reminders in GoldenCare Buddy.

---

## ✅ **What's Already Implemented (Frontend)**

### 1. **Mobile Number Field**
- ✅ Added to patient login page
- ✅ Stored in patient session
- ✅ Validated (10 digits required)
- ✅ Demo credentials include mobile: `9876543210`

### 2. **Notification Service**
- ✅ Browser push notifications
- ✅ Automatic scheduling based on medication times
- ✅ "Mark as Taken" action in notification
- ✅ Snooze functionality (10 minutes)
- ✅ Permission request handling

### 3. **Pillbox Integration**
- ✅ Notification scheduling on page load
- ✅ Test notification button
- ✅ Enable notifications button
- ✅ Real-time sync with doctor's medication changes

---

## 🔧 **What You Need to Set Up (Backend)**

### **Phase 1: Backend Server Setup**

Create a Node.js/Express backend with the following endpoints:

#### **Required API Endpoints:**

```javascript
// 1. Trigger AI Voice Call
POST /api/trigger-voice-call
Body: {
  mobile: "9876543210",
  medicationName: "Aspirin",
  dosage: "81mg",
  slot: "Morning",
  notes: "Take with food"
}

// 2. Send Push Notification
POST /api/send-notification
Body: {
  patientId: "demo_patient",
  medicationId: "p1",
  title: "Medication Reminder",
  body: "Time to take Aspirin 81mg"
}

// 3. Mark Medication as Taken (from notification)
POST /api/mark-medication-taken
Body: {
  patientId: "demo_patient",
  medicationId: "p1",
  timestamp: 1697385600000
}
```

---

### **Phase 2: AI Voice Call Integration**

#### **Option 1: Twilio + OpenAI (Recommended)**

**What you need:**
- Twilio account (for phone calls)
- OpenAI API key (for AI voice generation)

**Backend Implementation:**

```javascript
const twilio = require('twilio');
const axios = require('axios');

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Trigger AI Voice Call
async function triggerAIVoiceCall(req, res) {
  const { mobile, medicationName, dosage, slot, notes } = req.body;

  try {
    // 1. Generate AI voice message using OpenAI TTS
    const voiceMessage = `Hello! This is your medication reminder from GoldenCare Buddy. 
      It's time to take ${medicationName}, ${dosage}. 
      ${notes || 'Please take it as prescribed.'}
      Thank you and have a healthy day!`;

    // 2. Generate speech using OpenAI TTS API
    const speechResponse = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        voice: 'alloy', // or 'echo', 'fable', 'onyx', 'nova', 'shimmer'
        input: voiceMessage
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // 3. Upload audio to a public URL (use AWS S3, Cloudinary, etc.)
    const audioUrl = await uploadAudioToCloud(speechResponse.data);

    // 4. Make the call using Twilio
    const call = await twilioClient.calls.create({
      url: `https://your-backend.com/twiml?audioUrl=${encodeURIComponent(audioUrl)}`,
      to: `+91${mobile}`, // Assuming Indian mobile numbers
      from: process.env.TWILIO_PHONE_NUMBER
    });

    res.json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error('Error making AI voice call:', error);
    res.status(500).json({ error: 'Failed to make voice call' });
  }
}

// TwiML endpoint to play the audio
app.get('/twiml', (req, res) => {
  const audioUrl = req.query.audioUrl;
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Play>${audioUrl}</Play>
      <Pause length="1"/>
      <Say voice="woman">Press 1 to confirm you have taken your medication.</Say>
      <Gather numDigits="1" action="/handle-response">
        <Say>Waiting for your response.</Say>
      </Gather>
    </Response>`;
  
  res.type('text/xml');
  res.send(twiml);
});

// Handle patient response
app.post('/handle-response', (req, res) => {
  const digit = req.body.Digits;
  
  if (digit === '1') {
    // Mark medication as taken in database
    // Update frontend via WebSocket or polling
    
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Thank you! Your medication has been marked as taken. Have a great day!</Say>
      </Response>`;
    
    res.type('text/xml');
    res.send(twiml);
  } else {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>We will call you again in 10 minutes. Take care!</Say>
      </Response>`;
    
    res.type('text/xml');
    res.send(twiml);
  }
});
```

**Environment Variables (.env):**
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
OPENAI_API_KEY=your_openai_api_key
```

**Installation:**
```bash
npm install twilio axios
```

---

#### **Option 2: ElevenLabs + Twilio (Better Voice Quality)**

**What you need:**
- ElevenLabs API key (premium AI voices)
- Twilio account

```javascript
const axios = require('axios');

async function generateVoiceWithElevenLabs(text) {
  const response = await axios.post(
    'https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID',
    {
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    },
    {
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    }
  );

  return response.data; // Audio buffer
}
```

---

### **Phase 3: Push Notifications with Firebase Cloud Messaging**

#### **Setup Firebase:**

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Create new project
   - Enable Cloud Messaging

2. **Get Service Account Key**
   - Project Settings → Service Accounts
   - Generate new private key
   - Save JSON file

3. **Install Firebase Admin SDK:**

```bash
npm install firebase-admin
```

4. **Backend Implementation:**

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Send push notification
async function sendMedicationNotification(patientToken, medication) {
  const message = {
    notification: {
      title: '💊 Medication Reminder',
      body: `Time to take ${medication.name} (${medication.dosage})`
    },
    data: {
      medicationId: medication.id,
      action: 'mark-taken',
      timestamp: Date.now().toString()
    },
    token: patientToken
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}
```

5. **Frontend Firebase Integration:**

Add to your React app:

```bash
npm install firebase
```

```javascript
// src/services/firebaseService.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestFCMToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY'
    });
    console.log('FCM Token:', token);
    // Send this token to your backend
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}
```

---

### **Phase 4: Scheduling System**

**Backend Medication Reminder Scheduler:**

```javascript
const cron = require('node-cron');

// Schedule medication reminders
function scheduleAllMedicationReminders() {
  // Run every minute to check for medications
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Get all medications from database
    const medications = await getAllMedications();

    for (const med of medications) {
      const medTime = getMedicationTime(med.slot);
      
      if (currentHour === medTime.hour && currentMinute === medTime.minute) {
        // Trigger both voice call and notification
        await Promise.all([
          triggerAIVoiceCall(med.patient.mobile, med),
          sendMedicationNotification(med.patient.fcmToken, med)
        ]);
      }
    }
  });
}

function getMedicationTime(slot) {
  const timeMap = {
    'Morning': { hour: 8, minute: 0 },
    'Afternoon': { hour: 14, minute: 0 },
    'Evening': { hour: 18, minute: 0 },
    'Night': { hour: 22, minute: 0 }
  };
  return timeMap[slot];
}
```

**Installation:**
```bash
npm install node-cron
```

---

### **Phase 5: Database Schema**

**Recommended MongoDB Schema:**

```javascript
// Patient Schema
const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  name: String,
  mobile: { type: String, required: true },
  fcmToken: String, // For push notifications
  createdAt: { type: Date, default: Date.now }
});

// Medication Schema
const medicationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  name: { type: String, required: true },
  dosage: String,
  slot: { type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Night'] },
  frequency: String,
  notes: String,
  prescribedBy: String,
  prescribedDate: { type: Date, default: Date.now },
  takenHistory: [{
    timestamp: Date,
    method: { type: String, enum: ['web', 'notification', 'voice-call'] }
  }]
});

// Call Log Schema
const callLogSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
  callSid: String, // Twilio call ID
  status: { type: String, enum: ['initiated', 'answered', 'completed', 'failed'] },
  confirmed: Boolean, // Did patient press 1?
  timestamp: { type: Date, default: Date.now }
});
```

---

## 📱 **How It Works End-to-End**

### **Complete Flow:**

```
1. Patient Login
   ├── Enter mobile number: 9876543210
   ├── Session created with mobile
   └── FCM token registered

2. Doctor Prescribes Medication
   ├── Doctor adds "Aspirin 81mg" for Morning (8:00 AM)
   ├── Saved to database
   └── Frontend syncs via polling

3. Backend Scheduler (Every Minute)
   ├── Checks current time: 8:00 AM
   ├── Finds "Aspirin" scheduled for 8:00 AM
   └── Triggers:
       ├── AI Voice Call (Twilio + OpenAI)
       └── Push Notification (Firebase)

4. Patient's Phone
   ├── Receives call: "Hello! Time to take Aspirin..."
   ├── Receives notification: "💊 Medication Reminder"
   └── Two options:
       ├── Answer call → Press 1 → Marked as taken
       └── Click notification → "Mark as Taken" → Updates database

5. Frontend Update
   ├── Polls every 3 seconds
   ├── Detects medication marked as taken
   └── UI updates (button disabled, "✓ Taken")
```

---

## 💰 **Cost Estimates**

### **Twilio Pricing:**
- **Voice calls**: ~$0.013/minute (India)
- **SMS** (alternative): ~$0.0075/SMS
- Monthly estimate (100 patients, 4 meds/day): ~$156/month

### **OpenAI TTS:**
- **$15/million characters**
- Average message: 100 characters
- Monthly estimate (100 patients, 4 calls/day): ~$1.80/month

### **ElevenLabs (Premium Voice):**
- **$5/month** (30,000 characters)
- **$22/month** (100,000 characters)

### **Firebase Cloud Messaging:**
- **FREE** up to unlimited notifications

### **Total Monthly Cost (100 patients):**
- ~$160-180/month with Twilio
- Could reduce to ~$30/month with SMS-only

---

## 🚀 **Quick Start (Testing)**

### **1. Update Frontend to Connect to Backend:**

```javascript
// src/services/notificationService.js

async triggerAIVoiceCall(medication) {
  const patientSession = localStorage.getItem('gc_patient_session');
  if (!patientSession) return;

  const patient = JSON.parse(patientSession);
  const mobile = patient.mobile;

  try {
    const response = await fetch('https://your-backend.com/api/trigger-voice-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile,
        medicationName: medication.name,
        dosage: medication.dosage,
        slot: medication.slot,
        notes: medication.notes
      })
    });

    const data = await response.json();
    console.log('Voice call triggered:', data);
  } catch (error) {
    console.error('Error triggering voice call:', error);
  }
}
```

### **2. Backend Starter Code:**

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/trigger-voice-call', async (req, res) => {
  const { mobile, medicationName, dosage, slot, notes } = req.body;
  
  console.log('Voice call request:', req.body);
  
  // Implement Twilio call here
  
  res.json({ 
    success: true, 
    message: 'Voice call initiated',
    mobile,
    medication: medicationName
  });
});

app.listen(3001, () => {
  console.log('Backend running on port 3001');
});
```

**Run:**
```bash
npm install express cors
node server.js
```

---

## 📚 **Resources & Documentation**

### **Twilio:**
- Docs: https://www.twilio.com/docs/voice
- Node.js Quickstart: https://www.twilio.com/docs/voice/quickstart/node

### **OpenAI TTS:**
- API Docs: https://platform.openai.com/docs/guides/text-to-speech
- Pricing: https://openai.com/pricing

### **ElevenLabs:**
- Website: https://elevenlabs.io/
- API Docs: https://docs.elevenlabs.io/

### **Firebase Cloud Messaging:**
- Docs: https://firebase.google.com/docs/cloud-messaging
- Web Setup: https://firebase.google.com/docs/cloud-messaging/js/client

---

## ✅ **Testing Checklist**

- [ ] Patient can enter mobile number during login
- [ ] Notification permission is requested
- [ ] Browser notifications appear at scheduled times
- [ ] "Mark as Taken" action works from notification
- [ ] Backend API endpoint receives call requests
- [ ] Twilio makes actual voice call
- [ ] AI voice message is clear and audible
- [ ] Patient can confirm via phone keypad (press 1)
- [ ] Medication status updates in real-time
- [ ] FCM push notifications work on mobile

---

## 🎯 **Next Steps**

1. ✅ **Current**: Mobile number field added, notifications work in browser
2. 🔧 **Next**: Set up backend server
3. 🔧 **Then**: Integrate Twilio for voice calls
4. 🔧 **Then**: Add OpenAI TTS for AI voice
5. 🔧 **Then**: Deploy and test with real phone calls
6. 🔧 **Finally**: Add FCM for mobile push notifications

---

**Your frontend is ready! Now you just need to build the backend.** 🚀

For any questions or help setting up the backend, let me know!
