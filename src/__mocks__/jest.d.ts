// Declare the global jest type for TypeScript
declare global {
    const jest: {
        fn: <T extends (...args: any[]) => any>(
            implementation?: T
        ) => jest.MockedFunction<T>;
        mock: {
            calls: any[];
        };
    };

    namespace jest {
        interface MockedFunction<T extends (...args: any[]) => any> {
            (...args: Parameters<T>): ReturnType<T>;
            mock: {
                calls: any[];
                results: any[];
                instances: any[];
                invocationCallOrder: number[];
                prototype?: any;
            };
        }
    }
}

// Export to make it a module (helps with TS module resolution)
export { };