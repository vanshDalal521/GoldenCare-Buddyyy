import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const text = "Hey Vansh. This is your GoldenCare AI reminder. It is time to take your medication: Aspirin. Please take a dosage of 50mg right now at 08:00 AM. Stay healthy and have a great day.";

const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">${text}</Say>
  <Pause length="2"/>
  <Say voice="woman">Goodbye!</Say>
</Response>`;

async function makeCall() {
  console.log("Calling +919253395564 automatically now...");
  try {
    const call = await client.calls.create({
      twiml: twiml,
      to: '+919253395564',
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log(`✅ Success! Twilio is dialing your phone right now. Call SID: ${call.sid}`);
  } catch (err) {
    console.error("❌ Twilio Error:", err.message);
  }
}

makeCall();
