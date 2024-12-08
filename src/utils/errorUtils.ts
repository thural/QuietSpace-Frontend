export const getIsNullErrorMessage = (message: string, name: string): string => {
    return `${message} ${name} is undefined `
}

export const getIsUndefinedErrorMessage = (name: string): string => {
    return ` ${name} is undefined `
}

export const assertCondition = (condition: boolean, message: string) => {
    if (!condition) throw new Error(message);
}

export const assertNullisValues = (args: { [key: string]: any }, message = "") => {
    for (const [name, value] of Object.entries(args)) {
        assertCondition(value === undefined, getIsUndefinedErrorMessage(name));
        assertCondition(value === null, getIsNullErrorMessage(message, name));
    }
}