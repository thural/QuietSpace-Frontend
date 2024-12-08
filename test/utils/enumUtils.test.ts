import { getEnumValueFromString } from '@/utils/enumUtils';

enum SampleEnum {
    First = 'FIRST',
    Second = 'SECOND',
    Third = 'THIRD'
}

describe('enumUtils', () => {
    describe('getEnumValueFromString', () => {
        it('should return the correct enum value for a valid string key', () => {
            expect(getEnumValueFromString(SampleEnum, 'First')).toBe(SampleEnum.First);
            expect(getEnumValueFromString(SampleEnum, 'Second')).toBe(SampleEnum.Second);
            expect(getEnumValueFromString(SampleEnum, 'Third')).toBe(SampleEnum.Third);
        });

        it('should throw an error for an invalid string key', () => {
            expect(() => getEnumValueFromString(SampleEnum, 'Fourth')).toThrowError("enum value is not present");
        });

        it('should throw an error for an empty string', () => {
            expect(() => getEnumValueFromString(SampleEnum, '')).toThrowError("enum value is not present");
        });
    });
});