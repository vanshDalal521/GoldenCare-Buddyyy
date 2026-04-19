// medicationEventService.js
// Service for handling medication update events between doctor and patient dashboards

class MedicationEventService {
  constructor() {
    this.listeners = {};
    // Keep track of recent notifications to prevent duplicates
    this.recentNotifications = new Map();
  }

  // Subscribe to medication updates for a specific patient
  subscribe(patientId, callback) {
    // Normalize patientId to string for consistent comparison
    const normalizedPatientId = String(patientId);
    if (!this.listeners[normalizedPatientId]) {
      this.listeners[normalizedPatientId] = [];
    }
    this.listeners[normalizedPatientId].push(callback);
    
    console.log(`[MedicationEventService] Subscribed to updates for patient ${normalizedPatientId}. Total listeners: ${this.listeners[normalizedPatientId].length}`);
    console.log(`[MedicationEventService] Current listeners:`, Object.keys(this.listeners));
    
    // Return unsubscribe function
    return () => {
      this.listeners[normalizedPatientId] = this.listeners[normalizedPatientId].filter(cb => cb !== callback);
      console.log(`[MedicationEventService] Unsubscribed from updates for patient ${normalizedPatientId}. Remaining listeners: ${this.listeners[normalizedPatientId] ? this.listeners[normalizedPatientId].length : 0}`);
    };
  }

  // Notify all subscribers about medication updates for a patient
  notify(patientId) {
    // Normalize patientId to string for consistent comparison
    const normalizedPatientId = String(patientId);
    console.log(`[MedicationEventService] Notifying subscribers about medication updates for patient ${normalizedPatientId}`);
    console.log(`[MedicationEventService] Patient ID type: ${typeof normalizedPatientId}, value: "${normalizedPatientId}"`);
    console.log(`[MedicationEventService] Available patient IDs:`, Object.keys(this.listeners));
    
    // Create a unique key for this notification to prevent duplicates
    const notificationKey = `${normalizedPatientId}-${Date.now()}`;
    const now = Date.now();
    
    // Clean up old notifications (older than 5 seconds)
    for (const [key, timestamp] of this.recentNotifications.entries()) {
      if (now - timestamp > 5000) {
        this.recentNotifications.delete(key);
      }
    }
    
    // Check if we've recently sent a notification for this patient
    let recentNotification = false;
    for (const [key, timestamp] of this.recentNotifications.entries()) {
      if (key.startsWith(normalizedPatientId) && now - timestamp < 1000) {
        recentNotification = true;
        break;
      }
    }
    
    if (recentNotification) {
      console.log(`[MedicationEventService] Skipping duplicate notification for patient ${normalizedPatientId}`);
      return;
    }
    
    // Record this notification
    this.recentNotifications.set(notificationKey, now);
    
    // Check for exact match first
    let notified = false;
    if (this.listeners[normalizedPatientId]) {
      console.log(`[MedicationEventService] Found ${this.listeners[normalizedPatientId].length} listeners for patient ${normalizedPatientId}`);
      this.listeners[normalizedPatientId].forEach((callback, index) => {
        try {
          console.log(`[MedicationEventService] Calling callback ${index + 1} for patient ${normalizedPatientId}`);
          callback();
          notified = true;
        } catch (error) {
          console.error('[MedicationEventService] Error in medication update callback:', error);
        }
      });
    } else {
      console.log(`[MedicationEventService] No listeners found for patient ${normalizedPatientId}`);
      console.log(`[MedicationEventService] Available patient IDs:`, Object.keys(this.listeners));
      // Check if there's a close match
      const keys = Object.keys(this.listeners);
      const closeMatches = keys.filter(key => 
        key.includes(normalizedPatientId) || normalizedPatientId.includes(key)
      );
      if (closeMatches.length > 0) {
        console.log(`[MedicationEventService] Close matches found:`, closeMatches);
        // Try notifying close matches as well
        closeMatches.forEach(match => {
          console.log(`[MedicationEventService] Also notifying close match: ${match}`);
          if (this.listeners[match]) {
            this.listeners[match].forEach((callback, index) => {
              try {
                console.log(`[MedicationEventService] Calling callback ${index + 1} for close match patient ${match}`);
                callback();
                notified = true;
              } catch (error) {
                console.error('[MedicationEventService] Error in medication update callback for close match:', error);
              }
            });
          }
        });
      }
      
      // Also notify all listeners as a fallback if no exact match was found
      if (!notified) {
        console.log(`[MedicationEventService] Notifying all listeners as fallback`);
        Object.keys(this.listeners).forEach(pid => {
          console.log(`[MedicationEventService] Checking listener for patient ${pid}`);
          if (this.listeners[pid]) {
            this.listeners[pid].forEach((callback, index) => {
              try {
                console.log(`[MedicationEventService] Calling callback ${index + 1} for patient ${pid} (fallback)`);
                callback();
                notified = true;
              } catch (error) {
                console.error('[MedicationEventService] Error in medication update callback (fallback):', error);
              }
            });
          }
        });
      }
    }
    
    // If still not notified, try one more approach - check if any listener ID contains the patient ID
    if (!notified) {
      console.log(`[MedicationEventService] Trying alternative matching approach`);
      Object.keys(this.listeners).forEach(pid => {
        // Check if either ID contains the other
        if (pid.includes(normalizedPatientId) || normalizedPatientId.includes(pid)) {
          console.log(`[MedicationEventService] Found potential match: ${pid} for ${normalizedPatientId}`);
          if (this.listeners[pid]) {
            this.listeners[pid].forEach((callback, index) => {
              try {
                console.log(`[MedicationEventService] Calling callback ${index + 1} for patient ${pid} (alternative match)`);
                callback();
                notified = true;
              } catch (error) {
                console.error('[MedicationEventService] Error in medication update callback (alternative match):', error);
              }
            });
          }
        }
      });
    }
  }

  // Global notification for cases where we don't know the specific patient
  notifyAll() {
    console.log('[MedicationEventService] Notifying all subscribers about medication updates');
    Object.keys(this.listeners).forEach(patientId => {
      this.notify(patientId);
    });
  }
  
  // Get current listener count for debugging
  getListenerCount(patientId) {
    const normalizedPatientId = String(patientId);
    if (this.listeners[normalizedPatientId]) {
      return this.listeners[normalizedPatientId].length;
    }
    return 0;
  }
  
  // Get all registered patient IDs for debugging
  getRegisteredPatientIds() {
    return Object.keys(this.listeners);
  }
}

// Create singleton instance
const medicationEventService = new MedicationEventService();

// Also make it available globally for easy access from anywhere
window.medicationEventService = medicationEventService;

export default medicationEventService;