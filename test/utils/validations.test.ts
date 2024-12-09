import {
    validateIsNotUndefined,
    validateIsNotNull,
    validateIsNotNullish,
    validateIsString,
    validateIsNumber,
    validateIsBoolean,
    validateIsObject,
    validateIsArray,
    validateIsFunction,
    validateIsDate,
    validateIsSymbol,
} from '@/utils/validations';

describe('Validation', () => {
    test('validateIsNotUndefined should return variables without undefined values', () => {
        const obj = { a: 1, b: 2 };
        const result = validateIsNotUndefined(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsNotUndefined should throw error for undefined values', () => {
        const obj = { a: 1, b: undefined };
        expect(() => validateIsNotUndefined(obj)).toThrow('Value is undefined');
    });

    test('validateIsNotNull should return variables without null values', () => {
        const obj = { a: 1, b: 2 };
        const result = validateIsNotNull(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsNotNull should throw error for null values', () => {
        const obj = { a: 1, b: null };
        expect(() => validateIsNotNull(obj)).toThrow('Value is null');
    });

    test('validateIsNotNullish should return variables without nullish values', () => {
        const obj = { a: 1, b: 'text' };
        const result = validateIsNotNullish(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsNotNullish should throw error for nullish values', () => {
        const obj = { a: null, b: undefined };
        expect(() => validateIsNotNullish(obj)).toThrow('Value is nullish');
    });

    test('validateIsString should return variables with string values', () => {
        const obj = { a: 'hello', b: 'world' };
        const result = validateIsString(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsString should throw error for non-string values', () => {
        const obj = { a: 'hello', b: 2 };
        expect(() => validateIsString(obj)).toThrow('Value is not a string');
    });

    test('validateIsNumber should return variables with number values', () => {
        const obj = { a: 1, b: 2 };
        const result = validateIsNumber(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsNumber should throw error for non-number values', () => {
        const obj = { a: 1, b: 'two' };
        expect(() => validateIsNumber(obj)).toThrow('Value is not a number');
    });

    test('validateIsBoolean should return variables with boolean values', () => {
        const obj = { a: true, b: false };
        const result = validateIsBoolean(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsBoolean should throw error for non-boolean values', () => {
        const obj = { a: 1, b: 'false' };
        expect(() => validateIsBoolean(obj)).toThrow('Value is not a boolean');
    });

    test('validateIsObject should return variables with object values', () => {
        const obj = { a: {}, b: { c: 1 } };
        const result = validateIsObject(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsObject should throw error for non-object values', () => {
        const obj = { a: 1, b: null };
        expect(() => validateIsObject(obj)).toThrow('Value is not an object');
    });

    test('validateIsArray should return variables with array values', () => {
        const obj = { a: [], b: [1, 2, 3] };
        const result = validateIsArray(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsArray should throw error for non-array values', () => {
        const obj = { a: 1, b: 'two' };
        expect(() => validateIsArray(obj)).toThrow('Value is not an array');
    });

    test('validateIsFunction should return variables with function values', () => {
        const obj = { a: () => { }, b: function () { } };
        const result = validateIsFunction(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsFunction should throw error for non-function values', () => {
        const obj = { a: 1, b: 'two' };
        expect(() => validateIsFunction(obj)).toThrow('Value is not a function');
    });

    test('validateIsDate should return variables with Date values', () => {
        const obj = { a: new Date(), b: new Date(Date.now()) };
        const result = validateIsDate(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsDate should throw error for non-Date values', () => {
        const obj = { a: new Date(), b: 'not a date' };
        expect(() => validateIsDate(obj)).toThrow('Value is not a valid Date');
    });

    test('validateIsSymbol should return variables with symbol values', () => {
        const obj = { a: Symbol('sym1'), b: Symbol('sym2') };
        const result = validateIsSymbol(obj);
        expect(result).toEqual(obj);
    });

    test('validateIsSymbol should throw error for non-symbol values', () => {
        const obj = { a: Symbol('sym'), b: 'not a symbol' };
        expect(() => validateIsSymbol(obj)).toThrow('Value is not a symbol');
    });
});