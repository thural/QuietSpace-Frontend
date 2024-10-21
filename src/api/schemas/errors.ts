export interface CustomError extends Error {
    statusCode?: number;
    // TODO: improve error response and extend teh interface
}