export function assertAllConditions<T extends Record<string, unknown>, U>(
    variables: T,
    condition: (value: unknown) => value is U,
    defaultMessage: string
): asserts variables is { [K in keyof T]: T[K] extends U ? T[K] : never } {
    for (const [key, value] of Object.entries(variables)) {
        if (!condition(value)) {
            throw new Error(`${key} - ${defaultMessage}`);
        }
    }
}

function generateMessage(defaultMessage: string, variableName?: string): string {
    return variableName ? `${variableName} - ${defaultMessage}` : defaultMessage;
}

export function assertCondition(condition: unknown, defaultMessage: string, variableName?: string): asserts condition {
    if (!condition) {
        throw new Error(generateMessage(defaultMessage, variableName));
    }
}

export function assertTypeOfObject<T extends Record<string, unknown>, U>(
    variables: T,
    typeGuard: (value: unknown) => value is U,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends U ? T[K] : never } {
    assertAllConditions(variables, typeGuard, customMessage || 'Value does not match the required type');
}

export function assertTypeOfObjectWithSchema<T extends Record<string, unknown>, U>(
    variables: T,
    schema: { [K in keyof U]: (value: unknown) => value is U[K] },
    customMessage?: string
): asserts variables is { [K in keyof T]: K extends keyof U ? T[K] extends U[K] ? T[K] : never : never } {
    for (const [key, validate] of Object.entries(schema) as [keyof U, (value: unknown) => value is U[keyof U]][]) {
        // Ensure the key is valid for both T and U
        if (key in variables) {
            const value = variables[key as keyof T];
            if (!validate(value)) {
                throw new Error(`${String(key)} - ${customMessage || 'Value does not match the required type'}`);
            }
        } else {
            throw new Error(`${String(key)} - Key does not exist in the provided object.`);
        }
    }
}

export function assertIsNotUndefined<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: Exclude<T[K], undefined> } {
    assertAllConditions(variables, (value): value is Exclude<T[keyof T], undefined> => value !== undefined, customMessage || 'Value is undefined');
}

export function assertIsString<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends string ? T[K] : never } {
    assertTypeOfObject(variables, (value): value is string => typeof value === 'string', customMessage || 'Value is not a string');
}

export function assertIsNumber<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends number ? T[K] : never } {
    assertTypeOfObject(variables, (value): value is number => typeof value === 'number', customMessage || 'Value is not a number');
}

export function assertIsNotNull<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: Exclude<T[K], null> } {
    assertAllConditions(variables, (value): value is Exclude<T[keyof T], null> => value !== null, customMessage || 'Value is null');
}

export function assertIsNotNullish<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: NonNullable<T[K]> } {
    assertAllConditions(variables, (value): value is NonNullable<T[keyof T]> => value !== null && value !== undefined, customMessage || 'Value is nullish');
}

export function assertIsBoolean<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends boolean ? T[K] : never } {
    assertAllConditions(variables, (value): value is boolean => typeof value === 'boolean', customMessage || 'Value is not a boolean');
}

export function assertIsObject<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends object ? T[K] : never } {
    assertAllConditions(variables, (value): value is object => typeof value === 'object' && value !== null, customMessage || 'Value is not an object');
}

export function assertIsArray<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends unknown[] ? T[K] : never } {
    assertAllConditions(variables, (value): value is unknown[] => Array.isArray(value), customMessage || 'Value is not an array');
}

export function assertIsFunction<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends Function ? T[K] : never } {
    assertAllConditions(variables, (value): value is Function => typeof value === 'function', customMessage || 'Value is not a function');
}

export function assertIsDate<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends Date ? T[K] : never } {
    assertAllConditions(variables, (value): value is Date => value instanceof Date && !isNaN(value.getTime()), customMessage || 'Value is not a valid Date');
}

export function assertIsSymbol<T extends Record<string, unknown>>(
    variables: T,
    customMessage?: string
): asserts variables is { [K in keyof T]: T[K] extends symbol ? T[K] : never } {
    assertAllConditions(variables, (value): value is symbol => typeof value === 'symbol', customMessage || 'Value is not a symbol');
}