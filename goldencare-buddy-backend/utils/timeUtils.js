/**
 * Time utility functions for consistent time handling across the application
 */

/**
 * Convert time string to 12-hour format (HH:MM AM/PM)
 * @param {String} timeString - Time in various formats
 * @returns {String} - Time in 12-hour format
 */
export function formatTo12Hour(timeString) {
  if (!timeString) return timeString;
  
  const timeStr = String(timeString).trim();
  if (!timeStr) return timeStr;
  
  // If already in correct format, return as is
  if (/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(timeStr)) {
    return timeStr;
  }
  
  // Convert 24-hour format to 12-hour format
  if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  // Handle single digit hours (e.g., "8:00" -> "8:00 AM")
  if (/^[0-9]:[0-5][0-9]$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  // If format is not recognized, return as is
  return timeStr;
}

/**
 * Convert time string to 24-hour format (HH:MM)
 * @param {String} timeString - Time in 12-hour or 24-hour format
 * @returns {String} - Time in 24-hour format
 */
export function formatTo24Hour(timeString) {
  if (!timeString) return timeString;
  
  const timeStr = String(timeString).trim();
  if (!timeStr) return timeStr;
  
  // If already in 24-hour format, return as is
  if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
    return timeStr;
  }
  
  // Convert 12-hour format to 24-hour format
  if (/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(timeStr)) {
    const [timePart, period] = timeStr.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let hour24 = hours;
    
    if (period.toUpperCase() === 'AM') {
      hour24 = hours === 12 ? 0 : hours;
    } else {
      hour24 = hours === 12 ? 12 : hours + 12;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // If format is not recognized, return as is
  return timeStr;
}

/**
 * Format Date object to 12-hour time format (HH:MM AM/PM)
 * @param {Date} date
 * @returns {String} - e.g., "12:00 AM", "08:30 AM", "02:45 PM"
 */
export function formatDateTo12Hour(date) {
  if (!(date instanceof Date)) return '';
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Hour '0' should be '12'

  const hoursStr = hours.toString();
  const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
  
  return `${hoursStr}:${minutesStr} ${ampm}`;
}

/**
 * Format Date object to 24-hour time format (HH:MM)
 * @param {Date} date
 * @returns {String} - e.g., "00:00", "08:30", "14:45"
 */
export function formatDateTo24Hour(date) {
  if (!(date instanceof Date)) return '';
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  
  return `${hoursStr}:${minutesStr}`;
}

/**
 * Parse time string to Date object for today
 * @param {String} timeString - Time in 12-hour or 24-hour format
 * @returns {Date} - Date object with today's date and specified time
 */
export function parseTimeStringToDate(timeString) {
  if (!timeString) return null;
  
  const time24 = formatTo24Hour(timeString);
  if (!time24) return null;
  
  const [hours, minutes] = time24.split(':').map(Number);
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  
  return today;
}

/**
 * Check if two time strings represent the same time
 * @param {String} time1
 * @param {String} time2
 * @returns {Boolean}
 */
export function areTimesEqual(time1, time2) {
  if (!time1 || !time2) return false;
  
  const time1_24 = formatTo24Hour(time1);
  const time2_24 = formatTo24Hour(time2);
  
  return time1_24 === time2_24;
}

/**
 * Get time slot based on time of day
 * @param {String} timeString
 * @returns {String} - 'Morning', 'Afternoon', 'Evening', or 'Night'
 */
export function getTimeSlot(timeString) {
  if (!timeString) return 'Morning';
  
  const time24 = formatTo24Hour(timeString);
  if (!time24) return 'Morning';
  
  const [hours] = time24.split(':').map(Number);
  
  if (hours >= 5 && hours < 12) return 'Morning';
  if (hours >= 12 && hours < 17) return 'Afternoon';
  if (hours >= 17 && hours < 21) return 'Evening';
  return 'Night';
}