import twilio from 'twilio';
import aiVoiceService from './aiVoiceService.js';
import CallLog from '../models/CallLog.js';

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    // Remove the line that forces simulation mode
    // This was only for testing purposes
    
    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
      console.log('📞 Twilio client initialized');
    } else {
      this.client = null;
      console.log('⚠️  Twilio credentials not configured. Voice calls will be simulated.');
    }
    
    // Store follow-up timers
    this.followUpTimers = new Map();
  }

  /**
   * Make AI voice call to patient
   * @param {Object} patient - Patient object
   * @param {Object} medication - Medication object
   * @returns {Object} - Call details
   */
  async makeVoiceCall(patient, medication) {
    try {
      // Generate AI voice message
      const voiceData = await aiVoiceService.generateMedicationReminder(medication, patient);

      // Get patient's phone number
      const toNumber = patient.fullMobile; // e.g., +919876543210

      console.log(`📞 Making AI voice call to ${patient.name} at ${toNumber}`);
      console.log(`💊 Medication: ${medication.name} (${medication.dosage})`);
      console.log(`🎤 Voice message: "${voiceData.text}"`);

      if (!this.client) {
        // Simulation mode (no Twilio credentials)
        return await this.simulateVoiceCall(patient, medication, voiceData);
      }

      // Generate the raw TwiML XML payload instead of relying on a localhost webhook URL
      // This allows Twilio to execute the voice script immediately without needing to ping our server back
      const twimlData = this.generateMedicationReminderTwiML(voiceData.audioUrl, medication._id, voiceData.text);

      // Make the actual call using Twilio with direct TwiML injection
      const call = await this.client.calls.create({
        twiml: twimlData, // Use direct TwiML string rather than a URL Twilio can't access
        to: toNumber,
        from: this.phoneNumber,
        // Remove status callbacks that point to localhost as Twilio cannot POST to them
        // Set caller ID name (some carriers support this)
        callerId: this.phoneNumber
      });

      // Log the call
      const callLog = await CallLog.create({
        patient: patient._id,
        medication: medication._id,
        callSid: call.sid,
        callStatus: call.status,
        phoneNumber: toNumber,
        audioUrl: voiceData.audioUrl,
        voiceMessage: voiceData.text,
        scheduledFor: new Date()
      });

      console.log(`✅ Call initiated successfully! Call SID: ${call.sid}`);

      return {
        success: true,
        callSid: call.sid,
        callStatus: call.status,
        phoneNumber: toNumber,
        voiceMessage: voiceData.text,
        audioUrl: voiceData.audioUrl,
        callLog: callLog._id
      };
    } catch (error) {
      console.error('❌ Error making voice call:', error);
      throw error;
    }
  }

  /**
   * Simulate voice call (for development without Twilio)
   */
  async simulateVoiceCall(patient, medication, voiceData) {
    console.log('\n🎭 ========== SIMULATED VOICE CALL ==========');
    console.log(`📱 Calling: ${patient.name} (${patient.fullMobile})`);
    console.log(`💊 Medication: ${medication.name}`);
    console.log(`💬 AI Bot says:\n"${voiceData.text}"\n`);
    console.log('============================================\n');

    // Create simulated call log
    const callLog = await CallLog.create({
      patient: patient._id,
      medication: medication._id,
      callSid: `SIMULATED_${Date.now()}`,
      callStatus: 'completed',
      phoneNumber: patient.fullMobile,
      audioUrl: voiceData.audioUrl,
      voiceMessage: voiceData.text,
      scheduledFor: new Date(),
      patientConfirmed: false // Simulated - patient would need to actually press 1
    });

    return {
      success: true,
      simulated: true,
      callSid: callLog.callSid,
      callStatus: 'completed',
      phoneNumber: patient.fullMobile,
      voiceMessage: voiceData.text,
      audioUrl: voiceData.audioUrl,
      callLog: callLog._id,
      note: 'This is a simulated call. Configure Twilio credentials for real calls.'
    };
  }

  /**
   * Generate TwiML for medication reminder call
   * @param {String} audioUrl - URL of AI-generated audio
   * @param {String} medicationId - Medication ID for tracking
   * @returns {String} - TwiML XML
   */
  generateMedicationReminderTwiML(audioUrl, medicationId, voiceMessage) {
    // Check if we have a valid audio URL
    const hasValidAudio = audioUrl && audioUrl.includes('.mp3');
    
    console.log(`🎙️ Audio URL: ${audioUrl}`);
    console.log(`🔄 Has valid audio: ${hasValidAudio}`);
    console.log(`💬 Voice message: ${voiceMessage}`);
    
    if (hasValidAudio) {
      // Use OpenAI generated audio when available
      console.log('🎵 Using OpenAI generated audio');
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${audioUrl}</Play>
  <Pause length="2"/>
  <Gather numDigits="1" action="/api/twilio/handle-response?medicationId=${medicationId}" method="POST" timeout="10">
    <Say voice="woman">Please press 1 if you have taken your medication, or press 2 to receive a reminder in 10 minutes.</Say>
  </Gather>
  <Say voice="woman">We did not receive your response. We will call you again later. Thank you and take care!</Say>
</Response>`;
      console.log(`🎵 Generated TwiML with audio: ${twiml}`);
      return twiml;
    } else {
      // Use Twilio's built-in text-to-speech as fallback
      console.log('🗣️ Using Twilio text-to-speech fallback');
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">${voiceMessage}</Say>
  <Pause length="2"/>
  <Gather numDigits="1" action="/api/twilio/handle-response?medicationId=${medicationId}" method="POST" timeout="10">
    <Say voice="woman">Please press 1 if you have taken your medication, or press 2 to receive a reminder in 10 minutes.</Say>
  </Gather>
  <Say voice="woman">We did not receive your response. We will call you again later. Thank you and take care!</Say>
</Response>`;
      console.log(`🗣️ Generated TwiML with TTS: ${twiml}`);
      return twiml;
    }
  }

  /**
   * Handle patient response (when they press 1 or 2)
   * @param {String} digit - Digit pressed by patient
   * @param {String} medicationId - Medication ID
   * @param {String} callSid - Twilio call SID
   * @returns {String} - TwiML response
   */
  async handlePatientResponse(digit, medicationId, callSid) {
    try {
      // Update call log
      await CallLog.findOneAndUpdate(
        { callSid },
        {
          digitPressed: digit,
          patientConfirmed: digit === '1',
          callStatus: 'completed'
        }
      );

      if (digit === '1') {
        // Patient confirmed - mark medication as taken
        const Medication = (await import('../models/Medication.js')).default;
        const medication = await Medication.findById(medicationId);
        
        if (medication) {
          await medication.markAsTaken('voice-call', 'phone-press-1');
          console.log(`✅ Medication marked as taken via voice call: ${medication.name}`);
        }

        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">Thank you for confirming! Your medication has been marked as taken. Have a healthy day!</Say>
</Response>`;
      } else if (digit === '2') {
        // Snooze - schedule another call in 10 minutes
        console.log(`⏰ Patient requested snooze for medication ${medicationId}`);
        
        // Schedule a follow-up call in 10 minutes
        await this.scheduleFollowUpCall(medicationId, 10);
        
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">Understood. We will call you again in 10 minutes. Take care!</Say>
</Response>`;
      } else {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">Invalid response. Thank you for your time. Goodbye!</Say>
</Response>`;
      }
    } catch (error) {
      console.error('Error handling patient response:', error);
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">An error occurred. Please contact your healthcare provider. Goodbye!</Say>
</Response>`;
    }
  }

  /**
   * Schedule a follow-up call in specified minutes
   * @param {String} medicationId - Medication ID
   * @param {Number} minutes - Minutes to wait before calling again
   */
  async scheduleFollowUpCall(medicationId, minutes = 10) {
    try {
      // Clear any existing timer for this medication
      if (this.followUpTimers.has(medicationId)) {
        clearTimeout(this.followUpTimers.get(medicationId));
        this.followUpTimers.delete(medicationId);
      }

      // Set a new timer
      const timerId = setTimeout(async () => {
        try {
          // Import models inside the timeout to avoid circular dependencies
          const Medication = (await import('../models/Medication.js')).default;
          const Patient = (await import('../models/Patient.js')).default;
          
          // Get medication and patient details
          const medication = await Medication.findById(medicationId).populate({
            path: 'patient',
            options: { 
              toJSON: { virtuals: true },
              toObject: { virtuals: true }
            }
          });
          
          if (!medication || !medication.patient) {
            console.log(`⚠️  Medication or patient not found for follow-up call`);
            return;
          }

          // Check if medication has been taken in the meantime
          if (!medication.isTakenToday()) {
            console.log(`📞 Making follow-up call for: ${medication.patient.name} - ${medication.name}`);
            // Make the follow-up call
            await this.makeVoiceCall(medication.patient, medication);
          } else {
            console.log(`✅ Medication already taken, skipping follow-up call for ${medication.name}`);
          }
          
          // Remove the timer from the map
          this.followUpTimers.delete(medicationId);
        } catch (error) {
          console.error('Error making follow-up call:', error);
        }
      }, minutes * 60 * 1000);

      // Store the timer
      this.followUpTimers.set(medicationId, timerId);
      console.log(`📅 Scheduled follow-up call for medication ${medicationId} in ${minutes} minutes`);
    } catch (error) {
      console.error('Error scheduling follow-up call:', error);
    }
  }

  /**
   * Update call status from Twilio webhook
   */
  async updateCallStatus(callSid, status) {
    try {
      await CallLog.findOneAndUpdate(
        { callSid },
        { callStatus: status }
      );
      console.log(`📊 Call ${callSid} status updated to: ${status}`);
    } catch (error) {
      console.error('Error updating call status:', error);
    }
  }
}

// Create singleton instance
const twilioService = new TwilioService();

export default twilioService;