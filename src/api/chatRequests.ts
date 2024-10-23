import { CHAT_PATH, CHAT_PATH_BY_MEMBER } from "../constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { ChatResponseList, CreateChatRequest, ChatSchema } from "./schemas/chat";
import { JwtToken, ResId } from "./schemas/common";
import { UserSchema } from "./schemas/user";


export const fetchChatByUserId = async (userId: ResId, token: JwtToken): Promise<ChatResponseList> => (
    await getWrappedApiResponse(CHAT_PATH_BY_MEMBER + `/${userId}`, 'GET', null, token)
).json();

export const fetchChatById = async (chatId: ResId, token: JwtToken): Promise<ChatSchema> => (
    await getWrappedApiResponse(CHAT_PATH + `/${chatId}`, 'GET', null, token)
).json();

export const fetchCreateChat = async (body: CreateChatRequest, token: JwtToken): Promise<ChatSchema> => (
    await getWrappedApiResponse(CHAT_PATH, 'POST', body, token)
).json();

export const fetchAddMemberWithId = async (chatId: ResId, userId: ResId, token: JwtToken): Promise<UserSchema> => (
    await getWrappedApiResponse(CHAT_PATH + `/${chatId}/members/add/${userId}`, 'PATCH', null, token)
).json();

export const fetchPopMemberWithId = async (chatId: ResId, userId: ResId, token: JwtToken): Promise<UserSchema> => (
    await getWrappedApiResponse(CHAT_PATH + `/${chatId}/members/remove/${userId}`, 'PATCH', null, token)
).json();

export const fetchDeleteChat = async (chatId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(CHAT_PATH + `/${chatId}`, 'DELETE', null, token)
);