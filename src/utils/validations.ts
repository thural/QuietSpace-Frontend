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
    assertIsSymbol
} from './assertions';

export function validateIsNotUndefined<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: Exclude<T[K], undefined> } {
    assertIsNotUndefined(variables, customMessage);
    return variables as { [K in keyof T]: Exclude<T[K], undefined> };
}

export function validateIsNotNull<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: Exclude<T[K], null> } {
    assertIsNotNull(variables, customMessage);
    return variables as { [K in keyof T]: Exclude<T[K], null> };
}

export function validateIsNotNullish<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: NonNullable<T[K]> } {
    assertIsNotNullish(variables, customMessage);
    return variables as { [K in keyof T]: NonNullable<T[K]> };
}

export function validateIsString<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: T[K] extends string ? T[K] : never } {
    assertIsString(variables, customMessage);
    return variables as { [K in keyof T]: T[K] extends string ? T[K] : never };
}

export function validateIsNumber<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: T[K] extends number ? T[K] : never } {
    assertIsNumber(variables, customMessage);
    return variables as { [K in keyof T]: T[K] extends number ? T[K] : never };
}

export function validateIsBoolean<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: T[K] extends boolean ? T[K] : never } {
    assertIsBoolean(variables, customMessage);
    return variables as { [K in keyof T]: T[K] extends boolean ? T[K] : never };
}

export function validateIsObject<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: T[K] extends object ? T[K] : never } {
    assertIsObject(variables, customMessage);
    return variables as { [K in keyof T]: T[K] extends object ? T[K] : never };
}

export function validateIsArray<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: T[K] extends unknown[] ? T[K] : never } {
    assertIsArray(variables, customMessage);
    return variables as { [K in keyof T]: T[K] extends unknown[] ? T[K] : never };
}

export function validateIsFunction<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: T[K] extends Function ? T[K] : never } {
    assertIsFunction(variables, customMessage);
    return variables as { [K in keyof T]: T[K] extends Function ? T[K] : never };
}

export function validateIsDate<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: T[K] extends Date ? T[K] : never } {
    assertIsDate(variables, customMessage);
    return variables as { [K in keyof T]: T[K] extends Date ? T[K] : never };
}

export function validateIsSymbol<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): { [K in keyof T]: T[K] extends symbol ? T[K] : never } {
    assertIsSymbol(variables, customMessage);
    return variables as { [K in keyof T]: T[K] extends symbol ? T[K] : never };
}