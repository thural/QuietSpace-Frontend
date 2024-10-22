import { MESSAGE_PATH } from "@/constants/ApiPath";
import { genericFetchErrorHandler, getApiResponse } from "./commonRequest";
import { JwtToken, ResId } from "./schemas/common";
import { MessageBody, MessageSchema, PagedMessageResponse } from "./schemas/chat";

export const fetchMessages = async (chatId: ResId, token: JwtToken): Promise<PagedMessageResponse> => (
    await genericFetchErrorHandler(() => getApiResponse(MESSAGE_PATH + `/chat/${chatId}`, 'GET', null, token))
).json();

export const fetchCreateMessage = async (body: MessageBody, token: JwtToken): Promise<MessageSchema> => (
    await genericFetchErrorHandler(() => getApiResponse(MESSAGE_PATH, 'POST', body, token))
).json();

export const fetchDeleteMessage = async (token: JwtToken, messageId: ResId): Promise<Response> => (
    await genericFetchErrorHandler(() => getApiResponse(MESSAGE_PATH + `/${messageId}`, 'DELETE', null, token))
);