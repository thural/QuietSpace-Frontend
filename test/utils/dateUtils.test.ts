import { isDateExpired, getOffsetDateTime } from '@/utils/dateUtils';
import { format } from 'date-fns';

describe('dateUtils', () => {
    describe('isDateExpired', () => {
        it('should return true if the date is in the past', () => {
            const pastDate = new Date(Date.now() - 10000).toISOString(); // 10 seconds in the past
            expect(isDateExpired(pastDate)).toBe(true);
        });

        it('should return false if the date is in the future', () => {
            const futureDate = new Date(Date.now() + 10000).toISOString(); // 10 seconds in the future
            expect(isDateExpired(futureDate)).toBe(false);
        });

        it('should return false if the date is now', () => {
            const currentDate = new Date().toISOString();
            expect(isDateExpired(currentDate)).toBe(false);
        });
    });

    describe('getOffsetDateTime', () => {
        it('should return the current date and time in the correct format without offset', () => {
            const currentDateTime = new Date();
            const formattedDate = format(currentDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX");
            expect(getOffsetDateTime()).toBe(formattedDate);
        });

        it('should return the date and time with a positive offset', () => {
            const offset = 3600000; // 1 hour in milliseconds
            const offsetDateTime = new Date(Date.now() + offset);
            const formattedOffsetDate = format(offsetDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX");
            expect(getOffsetDateTime(3600000)).toBe(formattedOffsetDate);
        });

        it('should return the date and time with a negative offset', () => {
            const offset = -3600000; // -1 hour in milliseconds
            const offsetDateTime = new Date(Date.now() + offset);
            const formattedOffsetDate = format(offsetDateTime, "yyyy-MM-dd'T'HH:mm:ssXXX");
            expect(getOffsetDateTime(-3600000)).toBe(formattedOffsetDate);
        });
    });
});