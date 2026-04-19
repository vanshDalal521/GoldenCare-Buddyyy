import cron from 'node-cron';
import Medication from '../models/Medication.js';
import Patient from '../models/Patient.js';
import twilioService from './twilioService.js';
import emailService from './emailService.js';
import doctorNotificationService from './doctorNotificationService.js';
import { formatDateTo12Hour, areTimesEqual, formatTo24Hour } from '../utils/timeUtils.js';

class SchedulerService {
  constructor() {
    this.isRunning = false;
    this.missedMedicationCheckInterval = null;
  }

  /**
   * Start the medication reminder scheduler
   * Runs every minute to check for scheduled medications
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️  Scheduler already running');
      return;
    }

    console.log('🚀 Starting medication reminder scheduler...');

    // Run every minute
    this.cronJob = cron.schedule('* * * * *', async () => {
      await this.checkAndTriggerReminders();
    });

    // Run every hour to check for missed medications
    this.missedMedicationJob = cron.schedule('0 * * * *', async () => {
      await this.checkMissedMedications();
    });

    this.isRunning = true;
    console.log('✅ Scheduler started successfully!');
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
    }
    if (this.missedMedicationJob) {
      this.missedMedicationJob.stop();
    }
    this.isRunning = false;
    console.log('🛑 Scheduler stopped');
  }

  /**
   * Check for medications that need reminders and trigger calls
   */
  async checkAndTriggerReminders() {
    try {
      const now = new Date();
      const currentTime = this.formatTime(now);

      console.log(`⏰ Checking for medications at ${currentTime}...`);
      console.log(`🕒 Current time object: ${now.toISOString()}`);
      console.log(`🔢 Formatted time components: ${now.getHours()}:${now.getMinutes()}`);

      // Find all active medications scheduled for current time
      // Convert current time to 24-hour format for comparison
      const currentTime24 = formatTo24Hour(currentTime);
      
      const medications = await Medication.find({
        isActive: true
      }).populate({
        path: 'patient',
        options: { 
          toJSON: { virtuals: true },
          toObject: { virtuals: true }
        }
      });
      
      // Filter medications that match the current time
      const matchingMedications = medications.filter(med => {
        const medTime24 = formatTo24Hour(med.customTime);
        return areTimesEqual(currentTime24, medTime24);
      });

      // Debug: Log all medications and their times
      const allMeds = await Medication.find({ isActive: true }).select('name customTime');
      console.log('📋 All active medications:', allMeds.map(m => ({ name: m.name, time: m.customTime })));

      if (matchingMedications.length === 0) {
        console.log('📭 No medications scheduled for this time');
        return;
      }

      console.log(`📦 Found ${matchingMedications.length} medication(s) scheduled for ${currentTime}`);

      // Trigger calls for each medication
      for (const medication of matchingMedications) {
        try {
          // Check if already taken today
          if (medication.isTakenToday()) {
            console.log(`✅ ${medication.name} already taken today by ${medication.patient.name}`);
            continue;
          }

          // 1. Make the AI voice call
          try {
            console.log(`📞 Triggering AI call for: ${medication.patient.name} - ${medication.name}`);
            await twilioService.makeVoiceCall(medication.patient, medication);
          } catch (err) {
            console.error(`❌ Voice call failed for ${medication.name}:`, err.message);
          }

          // 2. Send the Email reminder
          if (medication.patient.email) {
            try {
              console.log(`✉️ Triggering Email for: ${medication.patient.name} (${medication.patient.email}) - ${medication.name}`);
              await emailService.sendMedicationReminder(
                medication.patient.email, 
                medication.patient.name, 
                {
                  name: medication.name,
                  dosage: medication.dosage,
                  notes: medication.notes,
                  time: medication.customTime
                }
              );
            } catch (err) {
              console.error(`❌ Email failed for ${medication.name}:`, err.message);
            }
          }
        } catch (error) {
          console.error(`❌ Error triggering reminders for ${medication.name}:`, error.message);
        }
      }

    } catch (error) {
      console.error('❌ Scheduler error:', error);
    }
  }

  /**
   * Check for missed medications and notify doctors
   */
  async checkMissedMedications() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
      const currentTime = this.formatTime(now);
      const oneHourAgoTime = this.formatTime(oneHourAgo);
      
      console.log(`🔍 Checking for missed medications... Current time: ${currentTime}, One hour ago: ${oneHourAgoTime}`);
      
      // Find all active medications
      const medications = await Medication.find({
        isActive: true
      }).populate({
        path: 'patient',
        options: { 
          toJSON: { virtuals: true },
          toObject: { virtuals: true }
        }
      });
      
      // Filter medications that were scheduled in the past hour
      const currentTime24 = formatTo24Hour(currentTime);
      const oneHourAgoTime24 = formatTo24Hour(oneHourAgoTime);
      
      const recentMedications = medications.filter(med => {
        const medTime24 = formatTo24Hour(med.customTime);
        // Check if medication time is between one hour ago and now
        return medTime24 >= oneHourAgoTime24 && medTime24 <= currentTime24;
      });

      if (recentMedications.length === 0) {
        console.log('✅ No medications scheduled in the past hour');
        return;
      }

      console.log(`📦 Found ${recentMedications.length} medication(s) scheduled in the past hour`);

      // Check which ones were not taken today
      for (const medication of recentMedications) {
        try {
          // Check if already taken today
          if (!medication.isTakenToday()) {
            console.log(`🚨 Patient ${medication.patient.name} missed ${medication.name}`);
            // For now, we'll use dummy doctor info since we don't have doctor references in the medication model
            const doctorInfo = {
              name: 'Doctor Smith',
              phone: '+1234567890'
            };
            await doctorNotificationService.notifyDoctorForMissedMedication(medication, medication.patient, doctorInfo);
          } else {
            console.log(`✅ ${medication.name} already taken today by ${medication.patient.name}`);
          }
        } catch (error) {
          console.error(`❌ Error checking medication ${medication.name}:`, error.message);
        }
      }

    } catch (error) {
      console.error('❌ Missed medication check error:', error);
    }
  }

  /**
   * Format Date object to 12-hour time format (HH:MM AM/PM)
   * @param {Date} date
   * @returns {String} - e.g., "12:00 AM", "08:30 AM", "02:45 PM"
   */
  formatTime(date) {
    return formatDateTo12Hour(date);
  }

  /**
   * Manually trigger a reminder for a specific medication
   * (useful for testing or manual triggers)
   */
  async triggerManualReminder(medicationId) {
    try {
      const medication = await Medication.findById(medicationId).populate({
        path: 'patient',
        options: { 
          toJSON: { virtuals: true },
          toObject: { virtuals: true }
        }
      });
      
      if (!medication) {
        throw new Error('Medication not found');
      }

      if (!medication.patient) {
        throw new Error('Patient not found for this medication');
      }

      console.log(`🎯 Manual trigger: Calling ${medication.patient.name} for ${medication.name}`);
      
      const result = await twilioService.makeVoiceCall(medication.patient, medication);
      
      return {
        success: true,
        message: `Call triggered for ${medication.name}`,
        result
      };
    } catch (error) {
      console.error('Error in manual trigger:', error);
      throw error;
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentTime: this.formatTime(new Date())
    };
  }
  
  /**
   * Manually trigger a scheduler check (for testing)
   */
  async triggerCheck() {
    await this.checkAndTriggerReminders();
    return { success: true, message: 'Scheduler check completed' };
  }
}

// Create singleton instance
const schedulerService = new SchedulerService();

export default schedulerService;