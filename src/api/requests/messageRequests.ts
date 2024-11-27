import { MESSAGE_PATH } from "@/constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { JwtToken, ResId } from "../schemas/inferred/common";
import { MessageRequest, MessageResponse, PagedMessage } from "../schemas/inferred/chat";


export const fetchMessages = async (chatId: ResId, token: JwtToken, pageParams?: string | undefined): Promise<PagedMessage> => (
    await getWrappedApiResponse(MESSAGE_PATH + `/chat/${chatId}` + (pageParams || ""), 'GET', null, token)
).json();

export const fetchCreateMessage = async (body: MessageRequest, token: JwtToken): Promise<MessageResponse> => (
    await getWrappedApiResponse(MESSAGE_PATH, 'POST', body, token)
).json();

export const fetchDeleteMessage = async (token: JwtToken, messageId: ResId): Promise<Response> => (
    await getWrappedApiResponse(MESSAGE_PATH + `/${messageId}`, 'DELETE', null, token)
);