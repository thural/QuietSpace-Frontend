export const getEnumValueFromString = <T extends object>(enumType: T, stringValue: string): T[keyof T] => {
    const enumKeys = Object.keys(enumType) as Array<keyof T>;
    const enumValues = Object.values(enumType) as Array<T[keyof T]>;

    const index = enumKeys.indexOf(stringValue as keyof T);
    if (index !== -1) {
        return enumValues[index];
    } else {
        throw new Error("enum value is not present")
    }
}