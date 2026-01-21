import { FetchOptions, JwtToken } from "../../../shared/api/models/common";
import { CustomError } from "../../../shared/api/models/errors";

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT';


export type ApiResponseFn = (
    url: string,
    method: RequestMethod,
    requestBody: string | Record<string, any> | null,
    token: JwtToken | null
) => Promise<Response>;


type GenericApiResponseFn = (...args: Array<any>) => Promise<Response>;


function genericFetchErrorWrapper(fn: GenericApiResponseFn) {
    return async function (...args: Array<any>) {
        try {
            return await fn(...args);
        } catch (error: unknown) {
            const customError: CustomError = new Error((error as Error).message);
            customError.statusCode = (error as any).statusCode;
            throw customError;
        }
    };
}


export async function getApiResponse(
    url: string,
    method: string,
    requestBody: string | Record<string, any> | FormData | null,
    token: JwtToken | null,
    customHeaders?: Headers | null,
): Promise<Response> {

    const headers = new Headers();

    if (customHeaders === undefined || customHeaders !== null) {
        headers.append('content-type', 'application/json');
        headers.append("Access-Control-Allow-Headers", "Location");
    }

    if (token != null) headers.append("Authorization", "Bearer " + token);

    if (customHeaders) {
        customHeaders.forEach((value, key) => {
            headers.set(key, value);
        });
    }

    const options: RequestInit = {
        method: method,
        headers: headers,
        body: null
    };

    if (requestBody != null)
        options.body = (customHeaders === null && requestBody instanceof FormData) ? requestBody
            : JSON.stringify(requestBody);

    const response = await fetch(url, options);
    if (response.ok) return response;
    else return Promise.reject(response);
}


export const getWrappedApiResponse = genericFetchErrorWrapper(getApiResponse);