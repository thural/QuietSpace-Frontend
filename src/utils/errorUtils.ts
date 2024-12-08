export const assertCondition = (condition: boolean, message: string) => {
    if (!condition) throw new Error(message);
}

export const assertNullisValues = (args: { [key: string]: any }, message = "") => {
    for (const [name, value] of Object.entries(args)) {
        assertCondition(value === undefined, `${message} ${name} is undefined `);
        assertCondition(value === null, `${message} ${name} is null `);
    }
};
