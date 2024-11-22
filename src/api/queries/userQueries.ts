import { useQueryClient } from "@tanstack/react-query";
import { ResId } from "../schemas/native/common";
import { User, UserPage } from "../schemas/inferred/user";
import { nullishValidationdError } from "@/utils/errorUtils";



export const getSignedUser = (): User | undefined => {
    const queryClient = useQueryClient();
    return queryClient.getQueryData(["user"]);
}

export const getSignedUserElseThrow = (): User => {
    const queryClient = useQueryClient();
    const user: User | undefined = queryClient.getQueryData(["user"]);
    if (user === undefined) throw nullishValidationdError({ user });
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
