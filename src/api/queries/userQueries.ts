import { validateIsNotUndefined } from "@/utils/validations";
import { useQueryClient } from "@tanstack/react-query";
import { UserPage, UserProfileResponse, UserResponse } from "../schemas/inferred/user";
import { ResId } from "../schemas/native/common";



export const getSignedUser = (): UserResponse | undefined | UserProfileResponse => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["user"]);
}

export const getSignedUserElseThrow = (): UserProfileResponse => {
    const queryClient = useQueryClient();
    const user: UserProfileResponse | undefined = queryClient.getQueryData(["user"]);
    return validateIsNotUndefined({ user }).user;
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
