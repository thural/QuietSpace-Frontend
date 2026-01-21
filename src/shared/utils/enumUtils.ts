/**
 * Retrieves the corresponding enum value from a string representation.
 *
 * This generic function takes an enum type and a string value, and returns the
 * associated enum value if the string matches an enum key. If the string does not
 * correspond to any key in the enum, an error is thrown.
 *
 * @param {T extends object} enumType - The enum object to search in.
 * @param {string} stringValue - The string representation of the enum key to find.
 * @returns {T[keyof T]} - The corresponding enum value associated with the provided string.
 * @throws {Error} - Throws an error if the provided string does not match any enum key.
 */
export const getEnumValueFromString = <T extends object>(enumType: T, stringValue: string): T[keyof T] => {
    const enumKeys = Object.keys(enumType) as Array<keyof T>;
    const enumValues = Object.values(enumType) as Array<T[keyof T]>;

    const index = enumKeys.indexOf(stringValue as keyof T);
    if (index !== -1) {
        return enumValues[index];
    } else {
        throw new Error("enum value is not present");
    }
}