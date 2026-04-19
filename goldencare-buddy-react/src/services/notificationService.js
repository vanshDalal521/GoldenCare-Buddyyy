/**
 * Notification Service for Medication Reminders
 * Handles push notifications and AI voice call scheduling
 */

class NotificationService {
  constructor() {
    this.notificationPermission = 'default';
    this.scheduledNotifications = [];
    this.checkPermission();
  }

  /**
   * Check if notifications are supported and get current permission
   */
  checkPermission() {
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
      return true;
    }
    console.warn('This browser does not support notifications');
    return false;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Show a medication reminder notification
   * @param {Object} medication - Medication details
   * @param {Function} onMarkTaken - Callback when "Mark as Taken" is clicked
   */
  showMedicationReminder(medication, onMarkTaken) {
    if (this.notificationPermission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const title = '💊 Medication Reminder';
    const options = {
      body: `Time to take ${medication.name} (${medication.dosage})\n${medication.notes || ''}`,
      icon: '/pill-icon.png', // You can add this icon to public folder
      badge: '/badge-icon.png',
      tag: `medication-${medication.id}`,
      requireInteraction: true, // Keeps notification visible
      actions: [
        {
          action: 'mark-taken',
          title: '✓ Mark as Taken'
        },
        {
          action: 'snooze',
          title: '⏰ Snooze 10 min'
        }
      ],
      data: {
        medicationId: medication.id,
        timestamp: Date.now()
      },
      vibrate: [200, 100, 200] // Vibration pattern
    };

    try {
      const notification = new Notification(title, options);

      notification.onclick = () => {
        window.focus();
        notification.close();
        // Open the pillbox page
        window.location.href = '/pillbox';
      };

      // Handle action buttons (for supported browsers)
      if ('actions' in Notification.prototype) {
        notification.addEventListener('notificationclick', (event) => {
          event.preventDefault();
          
          if (event.action === 'mark-taken') {
            if (onMarkTaken) {
              onMarkTaken(medication.id);
            }
            notification.close();
          } else if (event.action === 'snooze') {
            notification.close();
            // Reschedule after 10 minutes
            setTimeout(() => {
              this.showMedicationReminder(medication, onMarkTaken);
            }, 10 * 60 * 1000);
          }
        });
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Schedule medication notifications based on medication list
   * @param {Array} medications - List of patient medications
   * @param {Function} onMarkTaken - Callback when medication is marked as taken
   */
  scheduleMedicationReminders(medications, onMarkTaken) {
    // Clear existing scheduled notifications
    this.clearScheduledNotifications();

    medications.forEach(medication => {
      const reminderTime = this.calculateReminderTime(medication.slot);
      
      if (reminderTime) {
        const timeUntilReminder = reminderTime - Date.now();
        
        if (timeUntilReminder > 0) {
          const timeoutId = setTimeout(() => {
            // Show notification
            this.showMedicationReminder(medication, onMarkTaken);
            
            // Trigger AI voice call (placeholder for backend integration)
            this.triggerAIVoiceCall(medication);
          }, timeUntilReminder);

          this.scheduledNotifications.push({
            id: medication.id,
            timeoutId,
            medication
          });
        }
      }
    });
  }

  /**
   * Calculate the exact time for medication reminder
   * @param {String} slot - Time slot (Morning, Afternoon, Evening, Night)
   */
  calculateReminderTime(slot) {
    const now = new Date();
    const reminderDate = new Date();
    
    const timeMap = {
      'Morning': { hour: 8, minute: 0 },
      'Afternoon': { hour: 14, minute: 0 },
      'Evening': { hour: 18, minute: 0 },
      'Night': { hour: 22, minute: 0 }
    };

    const time = timeMap[slot];
    if (!time) return null;

    reminderDate.setHours(time.hour, time.minute, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    return reminderDate.getTime();
  }

  /**
   * Trigger AI voice call (Backend integration)
   */
  async triggerAIVoiceCall(medication) {
    const patientSession = localStorage.getItem('gc_patient_session');
    if (!patientSession) return;

    const patient = JSON.parse(patientSession);
    const mobile = patient.mobile;

    if (!mobile) {
      console.warn('No mobile number found for patient');
      return;
    }

    console.log('🤖 AI Voice Call Triggered:', {
      mobile,
      medication: medication.name,
      slot: medication.slot,
      message: `Hello! This is your medication reminder. It's time to take ${medication.name}, ${medication.dosage}. ${medication.notes || 'Please take it as prescribed.'}`
    });

    try {
      // Try to trigger backend API call if medication has an ID
      if (medication._id || medication.id) {
        const medicationId = medication._id || medication.id;
        const response = await fetch(`/api/test/trigger-call/${medicationId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Voice call triggered via backend:', result);
          return;
        }
      }
      
      // Fallback: Show mock voice call alert for demo
      this.showMockVoiceCallAlert(medication, mobile);
    } catch (error) {
      console.error('Error triggering AI voice call:', error);
      // Fallback: Show mock voice call alert
      this.showMockVoiceCallAlert(medication, mobile);
    }
  }

  /**
   * Mock voice call alert (for demo purposes)
   */
  showMockVoiceCallAlert(medication, mobile) {
    // This simulates the AI voice call in browser for demo
    const audio = new Audio();
    
    // You can add a ringtone sound file to public folder
    // audio.src = '/ringtone.mp3';
    // audio.play();

    const message = `🤖 AI VOICE CALL SIMULATION\n\n` +
      `Calling: ${mobile}\n\n` +
      `AI Bot says:\n` +
      `"Hello! This is your medication reminder from GoldenCare Buddy.\n` +
      `It's time to take ${medication.name}, ${medication.dosage}.\n` +
      `${medication.notes || 'Please take it as prescribed.'}\n` +
      `Thank you!"`;

    console.log(message);
    
    // Show browser alert for demo (replace with actual call in production)
    // alert(message);
  }

  /**
   * Clear all scheduled notifications
   */
  clearScheduledNotifications() {
    this.scheduledNotifications.forEach(({ timeoutId }) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications = [];
  }

  /**
   * Test notification (for debugging)
   */
  testNotification() {
    if (this.notificationPermission !== 'granted') {
      this.requestPermission().then(granted => {
        if (granted) {
          this.showTestNotification();
        }
      });
    } else {
      this.showTestNotification();
    }
  }

  showTestNotification() {
    const testMedication = {
      id: 'test-1',
      name: 'Test Medication',
      dosage: '100mg',
      notes: 'Take with food',
      slot: 'Morning'
    };

    this.showMedicationReminder(testMedication, (medId) => {
      console.log('Marked as taken from notification:', medId);
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
