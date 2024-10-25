import { CHAT_PATH, CHAT_PATH_BY_MEMBER } from "../../constants/apiPath";
import { getWrappedApiResponse } from "./fetchApiUtils";
import { ChatList, CreateChat, Chat } from "../schemas/inferred/chat";
import { JwtToken, ResId } from "../schemas/inferred/common";
import { User } from "../schemas/inferred/user";


export const fetchChatByUserId = async (userId: ResId, token: JwtToken): Promise<ChatList> => (
    await getWrappedApiResponse(CHAT_PATH_BY_MEMBER + `/${userId}`, 'GET', null, token)
).json();

export const fetchChatById = async (chatId: ResId, token: JwtToken): Promise<Chat> => (
    await getWrappedApiResponse(CHAT_PATH + `/${chatId}`, 'GET', null, token)
).json();

export const fetchCreateChat = async (body: CreateChat, token: JwtToken): Promise<Chat> => (
    await getWrappedApiResponse(CHAT_PATH, 'POST', body, token)
).json();

export const fetchAddMemberWithId = async (chatId: ResId, userId: ResId, token: JwtToken): Promise<User> => (
    await getWrappedApiResponse(CHAT_PATH + `/${chatId}/members/add/${userId}`, 'PATCH', null, token)
).json();

export const fetchPopMemberWithId = async (chatId: ResId, userId: ResId, token: JwtToken): Promise<User> => (
    await getWrappedApiResponse(CHAT_PATH + `/${chatId}/members/remove/${userId}`, 'PATCH', null, token)
).json();

export const fetchDeleteChat = async (chatId: ResId, token: JwtToken): Promise<Response> => (
    await getWrappedApiResponse(CHAT_PATH + `/${chatId}`, 'DELETE', null, token)
);