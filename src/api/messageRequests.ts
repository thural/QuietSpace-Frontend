import { MESSAGE_PATH } from "@/constants/ApiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { JwtToken, ResId } from "./schemas/common";
import { MessageBody, MessageSchema, PagedMessageResponse } from "./schemas/chat";


export const fetchMessages = async (chatId: ResId, token: JwtToken): Promise<PagedMessageResponse> => (
    await getWrappedApiResponse(MESSAGE_PATH + `/chat/${chatId}`, 'GET', null, token)
).json();

export const fetchCreateMessage = async (body: MessageBody, token: JwtToken): Promise<MessageSchema> => (
    await getWrappedApiResponse(MESSAGE_PATH, 'POST', body, token)
).json();

export const fetchDeleteMessage = async (token: JwtToken, messageId: ResId): Promise<Response> => (
    await getWrappedApiResponse(MESSAGE_PATH + `/${messageId}`, 'DELETE', null, token)
);