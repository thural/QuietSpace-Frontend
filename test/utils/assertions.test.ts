// assertions.test.ts
import {
    assertIsNotUndefined,
    assertIsNotNull,
    assertIsNotNullish,
    assertIsString,
    assertIsNumber,
    assertIsBoolean,
    assertIsObject,
    assertIsArray,
    assertIsFunction,
    assertIsDate,
    assertIsSymbol,
    assertTypeOfObjectWithSchema,
} from '@/utils/assertions';

describe('Assertions', () => {
    test('assertIsNotUndefined should throw error for undefined values', () => {
        const obj = { a: 1, b: undefined };
        expect(() => assertIsNotUndefined(obj)).toThrow('Value is undefined');
    });

    test('assertIsNotUndefined should not throw for defined values', () => {
        const obj = { a: 1, b: 2 };
        expect(() => assertIsNotUndefined(obj)).not.toThrow();
    });

    test('assertIsNotNull should throw error for null values', () => {
        const obj = { a: 1, b: null };
        expect(() => assertIsNotNull(obj)).toThrow('Value is null');
    });

    test('assertIsNotNull should not throw for non-null values', () => {
        const obj = { a: 1, b: 2 };
        expect(() => assertIsNotNull(obj)).not.toThrow();
    });

    test('assertIsNotNullish should throw error for nullish values', () => {
        const obj = { a: 1, b: null, c: undefined };
        expect(() => assertIsNotNullish(obj)).toThrow();
    });

    test('assertIsNotNullish should not throw for defined values', () => {
        const obj = { a: 1, b: 2 };
        expect(() => assertIsNotNullish(obj)).not.toThrow();
    });

    test('assertIsString should throw error for non-string values', () => {
        const obj = { a: 'hello', b: 2 };
        expect(() => assertIsString(obj)).toThrow('Value is not a string');
    });

    test('assertIsString should not throw for all string values', () => {
        const obj = { a: 'hello', b: 'world' };
        expect(() => assertIsString(obj)).not.toThrow();
    });

    test('assertIsNumber should throw error for non-number values', () => {
        const obj = { a: 1, b: 'two' };
        expect(() => assertIsNumber(obj)).toThrow('Value is not a number');
    });

    test('assertIsNumber should not throw for all number values', () => {
        const obj = { a: 1, b: 2 };
        expect(() => assertIsNumber(obj)).not.toThrow();
    });

    test('assertIsBoolean should throw error for non-boolean values', () => {
        const obj = { a: true, b: 'false' };
        expect(() => assertIsBoolean(obj)).toThrow('Value is not a boolean');
    });

    test('assertIsBoolean should not throw for all boolean values', () => {
        const obj = { a: true, b: false };
        expect(() => assertIsBoolean(obj)).not.toThrow();
    });

    test('assertIsObject should throw error for non-object values', () => {
        const obj = { a: 1, b: null };
        expect(() => assertIsObject(obj)).toThrow('Value is not an object');
    });

    test('assertIsObject should not throw for all object values', () => {
        const obj = { a: {}, b: { c: 1 } };
        expect(() => assertIsObject(obj)).not.toThrow();
    });

    test('assertIsArray should throw error for non-array values', () => {
        const obj = { a: 1, b: 'two' };
        expect(() => assertIsArray(obj)).toThrow('Value is not an array');
    });

    test('assertIsArray should not throw for all array values', () => {
        const obj = { a: [], b: [1, 2, 3] };
        expect(() => assertIsArray(obj)).not.toThrow();
    });

    test('assertIsFunction should throw error for non-function values', () => {
        const obj = { a: 1, b: 'two' };
        expect(() => assertIsFunction(obj)).toThrow('Value is not a function');
    });

    test('assertIsFunction should not throw for all function values', () => {
        const obj = { a: () => { }, b: function () { } };
        expect(() => assertIsFunction(obj)).not.toThrow();
    });

    test('assertIsDate should throw error for non-Date values', () => {
        const obj = { a: new Date(), b: 'not a date' };
        expect(() => assertIsDate(obj)).toThrow('Value is not a valid Date');
    });

    test('assertIsDate should not throw for all Date values', () => {
        const obj = { a: new Date(), b: new Date(Date.now()) };
        expect(() => assertIsDate(obj)).not.toThrow();
    });

    test('assertIsSymbol should throw error for non-symbol values', () => {
        const obj = { a: Symbol('sym'), b: 'not a symbol' };
        expect(() => assertIsSymbol(obj)).toThrow('Value is not a symbol');
    });

    test('assertIsSymbol should not throw for all symbol values', () => {
        const obj = { a: Symbol('sym1'), b: Symbol('sym2') };
        expect(() => assertIsSymbol(obj)).not.toThrow();
    });

    test('assertTypeOfObjectWithSchema should validate according to schema', () => {
        const obj = { name: 'Alice', age: 30 };
        const schema = {
            name: (value: unknown): value is string => typeof value === 'string',
            age: (value: unknown): value is number => typeof value === 'number',
        };
        expect(() => assertTypeOfObjectWithSchema(obj, schema)).not.toThrow();
    });

    test('assertTypeOfObjectWithSchema should throw error for invalid schema', () => {
        const obj = { name: 'Alice', age: '30' };
        const schema = {
            name: (value: unknown): value is string => typeof value === 'string',
            age: (value: unknown): value is number => typeof value === 'number',
        };
        expect(() => assertTypeOfObjectWithSchema(obj, schema)).toThrow('age - Value does not match the required type');
    });
});