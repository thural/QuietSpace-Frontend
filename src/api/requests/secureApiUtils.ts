import { apiClient } from '@/core/network/apiClient';
import { RequestMethod } from '@/api/requests/fetchApiUtils';
import { JwtToken } from '@/api/schemas/inferred/common';

/**
 * Secure API wrapper that provides the same interface as fetchApiUtils
 * but uses the secure axios client with automatic token management.
 */

export type SecureApiResponseFn = (
    url: string,
    method: RequestMethod,
    requestBody: string | Record<string, any> | null,
    token: JwtToken | null
) => Promise<Response>;

/**
 * Secure API function that uses axios client with automatic token injection
 * and refresh logic. Maintains compatibility with existing fetch-based API.
 */
export async function getSecureApiResponse(
    url: string,
    method: string,
    requestBody: string | Record<string, any> | FormData | null,
    token: JwtToken | null,
    customHeaders?: Headers | null,
): Promise<Response> {
    try {
        // Prepare axios config
        const config: any = {
            method: method.toLowerCase(),
            url: url.startsWith('http') ? url : `${apiClient.defaults.baseURL}${url}`,
            headers: {},
        };

        // Set headers
        if (customHeaders) {
            customHeaders.forEach((value, key) => {
                config.headers[key] = value;
            });
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        // Set body
        if (requestBody) {
            config.data = requestBody instanceof FormData ? requestBody : requestBody;
        }

        // Make request using secure axios client
        const axiosResponse = await apiClient.request(config);

        // Convert axios response to fetch Response interface
        const response = new Response(JSON.stringify(axiosResponse.data), {
            status: axiosResponse.status,
            statusText: axiosResponse.statusText,
            headers: new Headers(Object.entries(axiosResponse.headers)),
        });

        return response;
    } catch (error: any) {
        // Handle axios errors and convert to fetch-like Response
        if (error.response) {
            const response = new Response(JSON.stringify(error.response.data), {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: new Headers(Object.entries(error.response.headers)),
            });
            return Promise.reject(response);
        } else if (error.request) {
            // Network error
            const response = new Response('Network Error', {
                status: 0,
                statusText: 'Network Error',
            });
            return Promise.reject(response);
        } else {
            // Other error
            const response = new Response(error.message || 'Unknown Error', {
                status: 500,
                statusText: 'Internal Server Error',
            });
            return Promise.reject(response);
        }
    }
}

/**
 * Error wrapper for secure API calls
 */
function secureFetchErrorWrapper(fn: any) {
    return async function (...args: Array<any>) {
        try {
            return await fn(...args);
        } catch (error: unknown) {
            const customError: any = new Error((error as Error).message);
            customError.statusCode = (error as any).status || (error as any).response?.status;
            throw customError;
        }
    };
}

export const getWrappedSecureApiResponse = secureFetchErrorWrapper(getSecureApiResponse);

/**
 * Direct axios API methods for new implementations
 */
export const secureApi = {
    get: (url: string, config?: any) => apiClient.get(url, config),
    post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
    put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
    patch: (url: string, data?: any, config?: any) => apiClient.patch(url, data, config),
    delete: (url: string, config?: any) => apiClient.delete(url, config),
};

export default secureApi;
