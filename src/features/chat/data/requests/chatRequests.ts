import {CHAT_PATH, CHAT_PATH_BY_MEMBER} from "@shared/constants/apiPath";
import {apiClient} from "@core/network/rest/apiClient";
import {ChatList, ChatResponse, CreateChatRequest} from "../models/chat";
import {JwtToken, ResId} from "@shared/api/models/common";
import {UserResponse} from "@profile/data/models/user";


export const fetchChatByUserId = async (userId: ResId, token: JwtToken): Promise<ChatList> => {
    const { data } = await apiClient.get(CHAT_PATH_BY_MEMBER + `/${userId}`);
    return data;
};

export const fetchChatById = async (chatId: ResId, token: JwtToken): Promise<ChatResponse> => {
    const { data } = await apiClient.get(CHAT_PATH + `/${chatId}`);
    return data;
};

export const fetchCreateChat = async (body: CreateChatRequest, token: JwtToken): Promise<ChatResponse> => {
    const { data } = await apiClient.post(CHAT_PATH, body);
    return data;
};

export const fetchAddMemberWithId = async (chatId: ResId, userId: ResId, token: JwtToken): Promise<UserResponse> => {
    const { data } = await apiClient.patch(CHAT_PATH + `/${chatId}/members/add/${userId}`);
    return data;
};

export const fetchPopMemberWithId = async (chatId: ResId, userId: ResId, token: JwtToken): Promise<UserResponse> => {
    const { data } = await apiClient.patch(CHAT_PATH + `/${chatId}/members/remove/${userId}`);
    return data;
};

export const fetchDeleteChat = async (chatId: ResId, token: JwtToken): Promise<Response> => (
    await apiClient.delete(CHAT_PATH + `/${chatId}`)
);