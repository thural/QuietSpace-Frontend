import { useQueryClient } from "@tanstack/react-query";
import { ResId } from "../schemas/native/common";
import { User, UserPage } from "../schemas/inferred/user";



const queryClient = useQueryClient();

export const getSignedUser = (): User | undefined => {
    return queryClient.getQueryData(["user"]);
}

export const getFollowingsByUserId = (userId: ResId): UserPage | undefined => {
    return queryClient.getQueryData(["followings", { id: userId }]);
}

export const getFollowersByUserId = (userId: ResId): UserPage | undefined => {
    return queryClient.getQueryData(["followers", { id: userId }]);
}

export const getFollowingsByUser = (userId: ResId): UserPage | undefined => {
    return queryClient.getQueryData(["followings", { id: userId }]);
}

export const getFollowersByUser = (userId: ResId): UserPage | undefined => {
    return queryClient.getQueryData(["followers", { id: userId }]);
}

