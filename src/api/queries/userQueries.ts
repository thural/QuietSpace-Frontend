import { useQueryClient } from "@tanstack/react-query";
import { ResId } from "../schemas/native/common";
import { UserResponse, UserPage, UserProfileResponse } from "../schemas/inferred/user";



export const getSignedUser = (): UserResponse | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["user"]);
}

export const getSignedUserElseThrow = (): UserProfileResponse => {
    const queryClient = useQueryClient();
    const user: UserProfileResponse | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw new Error("user is undefined");
    return user;
}

export const getFollowingsByUserId = (userId: ResId): UserPage | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["followings", { id: userId }]);
}

export const getFollowersByUserId = (userId: ResId): UserPage | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["followers", { id: userId }]);
}

export const getFollowingsByUser = (userId: ResId): UserPage | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["followings", { id: userId }]);
}

export const getFollowersByUser = (userId: ResId): UserPage | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["followers", { id: userId }]);
}
