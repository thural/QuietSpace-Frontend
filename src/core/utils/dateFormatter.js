/**
 * Date Formatting Utilities.
 * 
 * Helper functions for consistent date formatting across the application.
 * Provides relative time formatting and date manipulation.
 */

/**
 * Format relative time (e.g., "2h ago", "3d ago")
 * 
 * @param {Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than a minute
  if (diff < 60000) {
    return 'just now';
  }

  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }

  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }

  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }

  // Less than a month
  if (diff < 2628000000) {
    const weeks = Math.floor(diff / 604800000);
    return `${weeks}w ago`;
  }

  // Less than a year
  if (diff < 31536000000) {
    const months = Math.floor(diff / 2628000000);
    return `${months}mo ago`;
  }

  // More than a year
  const years = Math.floor(diff / 31536000000);
  return `${years}y ago`;
};

/**
 * Format date to readable string
 * 
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date and time to readable string
 * 
 * @param {Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if date is today
 * 
 * @param {Date} date - Date to check
 * @returns {boolean} Whether date is today
 */
export const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if date is yesterday
 * 
 * @param {Date} date - Date to check
 * @returns {boolean} Whether date is yesterday
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

/**
 * Get start of day (midnight)
 * 
 * @param {Date} date - Date to get start of day for
 * @returns {Date} Start of day date
 */
export const getStartOfDay = (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Get end of day (23:59:59.999)
 * 
 * @param {Date} date - Date to get end of day for
 * @returns {Date} End of day date
 */
export const getEndOfDay = (date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};
