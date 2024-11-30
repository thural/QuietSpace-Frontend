export const nullishValidationdError = (args: { [key: string]: any }, message = "") => {
    for (const [name, value] of Object.entries(args)) {
        if (value === undefined) return new Error(`${message} ${name} is undefined `);
        if (value === null) return new Error(`${message} ${name} is null `);
    }
};

export const produceUndefinedErrorArg = (...args: any[]) => {
    args.forEach((arg, index) => {
        if (arg === undefined) return new Error(`(!) argument at index ${index} is undefined`);
    });
}
