export const produceUndefinedError = (args: { [key: string]: any }, message = "") => {
    for (const [name, value] of Object.entries(args)) {
        if (value === undefined) {
            return new Error('(!)' + ` ${message}: ${name} is undefined `);
        }
    }
};

export const produceUndefinedErrorArg = (...args: any[]) => {
    args.forEach((arg, index) => {
        if (arg === undefined) {
            return new Error(`(!) argument at index ${index} is undefined`);
        }
    });
}
