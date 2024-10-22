import { FetchOptions, JwtToken } from "./schemas/common";
import { CustomError } from "./schemas/errors";


export type ApiResponseFn = (
    url: string,
    method: string,
    requestBody: string | Record<string, any> | null,
    token: JwtToken | null
) => Promise<Response>;


type ApiResponseFunction = () => Promise<Response>;


export const genericFetchErrorHandler = async (
    fetchCallBack: ApiResponseFunction
): Promise<Response> => {
    try {
        return await fetchCallBack();
    } catch (error: unknown) {
        const customError: CustomError = new Error((error as Error).message);
        customError.statusCode = (error as any).statusCode;
        throw customError;
    }
};


export async function getApiResponse(
    url: string,
    method: string,
    requestBody: string | Record<string, any> | null,
    token: JwtToken | null
): Promise<Response> {

    const headers = new Headers({ 'content-type': 'application/json' });
    headers.append("Access-Control-Allow-Headers", "Location");
    if (token != null) headers.append("Authorization", "Bearer " + token);

    const options: FetchOptions = {
        method: method,
        headers: headers,
        body: null
    };

    if (requestBody != null) options.body = JSON.stringify(requestBody);

    const response = await fetch(url, options);
    if (response.ok) return response;
    else return Promise.reject(response);

}