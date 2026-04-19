import twilio from 'twilio';
import CallLog from '../models/CallLog.js';

class DoctorNotificationService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!this.accountSid || !this.authToken || !this.phoneNumber) {
      console.warn('⚠️  Twilio credentials not configured. Doctor notifications will be simulated.');
      this.client = null;
    } else {
      this.client = twilio(this.accountSid, this.authToken);
    }
  }

  /**
   * Notify doctor when patient doesn't take medication
   * @param {Object} medication - Medication object
   * @param {Object} patient - Patient object
   * @param {Object} doctorInfo - Doctor information (name and phone)
   */
  async notifyDoctorForMissedMedication(medication, patient, doctorInfo) {
    try {
      // Create notification message
      const message = `🚨 MEDICATION ALERT 🚨\nPatient ${patient.name} has not taken their medication "${medication.name}" (${medication.dosage}) which was scheduled for ${medication.customTime}.\nPlease follow up with the patient.`;
      
      console.log(`🚨 Doctor notification: Sending SMS to Dr. ${doctorInfo.name} at ${doctorInfo.phone}`);
      
      // Send SMS notification to doctor
      if (this.client) {
        // Real Twilio implementation
        await this.client.messages.create({
          body: message,
          to: doctorInfo.phone,
          from: this.phoneNumber
        });
        console.log(`✅ SMS sent to Dr. ${doctorInfo.name}`);
      } else {
        // Simulation mode
        console.log('\n📱 ========== SIMULATED DOCTOR NOTIFICATION ==========');
        console.log(`To: Dr. ${doctorInfo.name} (${doctorInfo.phone})`);
        console.log(`Message:\n${message}\n`);
        console.log('====================================================\n');
      }
      
      // Log the notification
      await CallLog.create({
        patient: patient._id,
        medication: medication._id,
        callSid: `NOTIFICATION_${Date.now()}`,
        callStatus: 'completed',
        phoneNumber: doctorInfo.phone,
        voiceMessage: message,
        scheduledFor: new Date(),
        patientConfirmed: false
      });
      
    } catch (error) {
      console.error('Error notifying doctor:', error);
    }
  }
}

// Create singleton instance
const doctorNotificationService = new DoctorNotificationService();

export default doctorNotificationService;