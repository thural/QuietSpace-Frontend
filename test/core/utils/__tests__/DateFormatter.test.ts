/**
 * Date Formatter Utils Test Suite
 */

import {
  formatRelativeTime,
  formatDate,
  formatDateTime,
  isToday,
  isYesterday,
  getStartOfDay,
  getEndOfDay
} from '../../../src/core/utils/dateFormatter';

describe('Date Formatter Utils', () => {
  describe('formatRelativeTime', () => {
    test('should format "just now" for recent times', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 30000); // 30 seconds ago
      expect(formatRelativeTime(recentDate)).toBe('just now');
    });

    test('should format minutes ago', () => {
      const now = new Date();
      const minutesAgo = new Date(now.getTime() - 5 * 60000); // 5 minutes ago
      expect(formatRelativeTime(minutesAgo)).toBe('5m ago');
    });

    test('should format hours ago', () => {
      const now = new Date();
      const hoursAgo = new Date(now.getTime() - 3 * 3600000); // 3 hours ago
      expect(formatRelativeTime(hoursAgo)).toBe('3h ago');
    });

    test('should format days ago', () => {
      const now = new Date();
      const daysAgo = new Date(now.getTime() - 2 * 86400000); // 2 days ago
      expect(formatRelativeTime(daysAgo)).toBe('2d ago');
    });

    test('should format weeks ago', () => {
      const now = new Date();
      const weeksAgo = new Date(now.getTime() - 3 * 604800000); // 3 weeks ago
      expect(formatRelativeTime(weeksAgo)).toBe('3w ago');
    });

    test('should format months ago', () => {
      const now = new Date();
      const monthsAgo = new Date(now.getTime() - 2 * 2628000000); // 2 months ago
      expect(formatRelativeTime(monthsAgo)).toBe('2mo ago');
    });

    test('should format years ago', () => {
      const now = new Date();
      const yearsAgo = new Date(now.getTime() - 2 * 31536000000); // 2 years ago
      expect(formatRelativeTime(yearsAgo)).toBe('2y ago');
    });

    test('should handle edge case boundaries', () => {
      const now = new Date();

      // Exactly 1 minute ago
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      expect(formatRelativeTime(oneMinuteAgo)).toBe('1m ago');

      // Exactly 1 hour ago
      const oneHourAgo = new Date(now.getTime() - 3600000);
      expect(formatRelativeTime(oneHourAgo)).toBe('1h ago');

      // Exactly 1 day ago
      const oneDayAgo = new Date(now.getTime() - 86400000);
      expect(formatRelativeTime(oneDayAgo)).toBe('1d ago');
    });

    test('should handle future dates', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 60000); // 1 minute in future
      expect(formatRelativeTime(futureDate)).toBe('just now');
    });
  });

  describe('formatDate', () => {
    test('should format date in readable format', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec 25, 2023/);
    });

    test('should handle different dates', () => {
      const dates = [
        new Date('2023-01-01'),
        new Date('2023-06-15'),
        new Date('2023-12-31')
      ];

      dates.forEach(date => {
        const formatted = formatDate(date);
        expect(formatted).toMatch(/\w{3} \d{1,2}, \d{4}/);
      });
    });

    test('should handle leap year dates', () => {
      const leapDate = new Date('2024-02-29');
      const formatted = formatDate(leapDate);
      expect(formatted).toMatch(/Feb 29, 2024/);
    });
  });

  describe('formatDateTime', () => {
    test('should format date and time', () => {
      const date = new Date('2023-12-25T14:30:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/Dec 25, 2023/);
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });

    test('should handle different times', () => {
      const times = [
        new Date('2023-12-25T00:00:00Z'),
        new Date('2023-12-25T12:30:45Z'),
        new Date('2023-12-25T23:59:59Z')
      ];

      times.forEach(time => {
        const formatted = formatDateTime(time);
        expect(formatted).toMatch(/\w{3} \d{1,2}, \d{4}, \d{1,2}:\d{2}/);
      });
    });

    test('should handle single digit hours and minutes', () => {
      const date = new Date('2023-12-25T09:05:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/09:05/);
    });
  });

  describe('isToday', () => {
    test('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    test('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    test('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });

    test('should handle different times on same day', () => {
      const morning = new Date();
      morning.setHours(0, 0, 0, 0);

      const evening = new Date();
      evening.setHours(23, 59, 59, 999);

      expect(isToday(morning)).toBe(true);
      expect(isToday(evening)).toBe(true);
    });
  });

  describe('isYesterday', () => {
    test('should return true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    test('should return false for today', () => {
      const today = new Date();
      expect(isYesterday(today)).toBe(false);
    });

    test('should return false for two days ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      expect(isYesterday(twoDaysAgo)).toBe(false);
    });

    test('should handle different times on yesterday', () => {
      const yesterdayMorning = new Date();
      yesterdayMorning.setDate(yesterdayMorning.getDate() - 1);
      yesterdayMorning.setHours(0, 0, 0, 0);

      const yesterdayEvening = new Date();
      yesterdayEvening.setDate(yesterdayEvening.getDate() - 1);
      yesterdayEvening.setHours(23, 59, 59, 999);

      expect(isYesterday(yesterdayMorning)).toBe(true);
      expect(isYesterday(yesterdayEvening)).toBe(true);
    });
  });

  describe('getStartOfDay', () => {
    test('should return start of day (midnight)', () => {
      const date = new Date('2023-12-25T14:30:45.123Z');
      const startOfDay = getStartOfDay(date);

      expect(startOfDay.getFullYear()).toBe(2023);
      expect(startOfDay.getMonth()).toBe(11); // December
      expect(startOfDay.getDate()).toBe(25);
      expect(startOfDay.getHours()).toBe(0);
      expect(startOfDay.getMinutes()).toBe(0);
      expect(startOfDay.getSeconds()).toBe(0);
      expect(startOfDay.getMilliseconds()).toBe(0);
    });

    test('should handle different dates', () => {
      const dates = [
        new Date('2023-01-01T23:59:59Z'),
        new Date('2023-06-15T12:30:00Z'),
        new Date('2023-12-31T00:00:01Z')
      ];

      dates.forEach(date => {
        const startOfDay = getStartOfDay(date);
        expect(startOfDay.getHours()).toBe(0);
        expect(startOfDay.getMinutes()).toBe(0);
        expect(startOfDay.getSeconds()).toBe(0);
        expect(startOfDay.getMilliseconds()).toBe(0);
      });
    });

    test('should not modify original date', () => {
      const originalDate = new Date('2023-12-25T14:30:00Z');
      const originalTime = originalDate.getTime();

      getStartOfDay(originalDate);

      expect(originalDate.getTime()).toBe(originalTime);
    });
  });

  describe('getEndOfDay', () => {
    test('should return end of day (23:59:59.999)', () => {
      const date = new Date('2023-12-25T14:30:45.123Z');
      const endOfDay = getEndOfDay(date);

      expect(endOfDay.getFullYear()).toBe(2023);
      expect(endOfDay.getMonth()).toBe(11); // December
      expect(endOfDay.getDate()).toBe(25);
      expect(endOfDay.getHours()).toBe(23);
      expect(endOfDay.getMinutes()).toBe(59);
      expect(endOfDay.getSeconds()).toBe(59);
      expect(endOfDay.getMilliseconds()).toBe(999);
    });

    test('should handle different dates', () => {
      const dates = [
        new Date('2023-01-01T00:00:00Z'),
        new Date('2023-06-15T12:30:00Z'),
        new Date('2023-12-31T23:59:58Z')
      ];

      dates.forEach(date => {
        const endOfDay = getEndOfDay(date);
        expect(endOfDay.getHours()).toBe(23);
        expect(endOfDay.getMinutes()).toBe(59);
        expect(endOfDay.getSeconds()).toBe(59);
        expect(endOfDay.getMilliseconds()).toBe(999);
      });
    });

    test('should not modify original date', () => {
      const originalDate = new Date('2023-12-25T14:30:00Z');
      const originalTime = originalDate.getTime();

      getEndOfDay(originalDate);

      expect(originalDate.getTime()).toBe(originalTime);
    });
  });

  describe('Edge Cases', () => {
    test('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      expect(() => {
        formatRelativeTime(invalidDate);
      }).not.toThrow();
    });

    test('should handle epoch time', () => {
      const epoch = new Date(0);
      const formatted = formatDate(epoch);
      expect(formatted).toBeDefined();
    });

    test('should handle very old dates', () => {
      const oldDate = new Date('1900-01-01');
      const formatted = formatDate(oldDate);
      expect(formatted).toBeDefined();
    });

    test('should handle very future dates', () => {
      const futureDate = new Date('2100-01-01');
      const formatted = formatDate(futureDate);
      expect(formatted).toBeDefined();
    });
  });

  describe('Performance', () => {
    test('should handle rapid function calls', () => {
      const date = new Date();
      const iterations = 1000;

      const startTime = Date.now();

      for (let i = 0; i < iterations; i++) {
        formatRelativeTime(date);
        formatDate(date);
        formatDateTime(date);
        isToday(date);
        isYesterday(date);
        getStartOfDay(date);
        getEndOfDay(date);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Type Safety', () => {
    test('should handle TypeScript compilation', () => {
      const date: Date = new Date();
      const relativeTime: string = formatRelativeTime(date);
      const formattedDate: string = formatDate(date);
      const formattedDateTime: string = formatDateTime(date);
      const todayCheck: boolean = isToday(date);
      const yesterdayCheck: boolean = isYesterday(date);
      const startOfDay: Date = getStartOfDay(date);
      const endOfDay: Date = getEndOfDay(date);

      expect(typeof relativeTime).toBe('string');
      expect(typeof formattedDate).toBe('string');
      expect(typeof formattedDateTime).toBe('string');
      expect(typeof todayCheck).toBe('boolean');
      expect(typeof yesterdayCheck).toBe('boolean');
      expect(startOfDay).toBeInstanceOf(Date);
      expect(endOfDay).toBeInstanceOf(Date);
    });
  });
});
