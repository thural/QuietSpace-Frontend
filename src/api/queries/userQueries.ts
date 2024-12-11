import { validateIsNotUndefined } from "@/utils/validations";
import { useQueryClient } from "@tanstack/react-query";
import { UserPage, UserProfileResponse, UserResponse } from "../schemas/inferred/user";
import { ResId } from "../schemas/native/common";



const useUserQueries = () => {

    const getSignedUser = (): UserResponse | undefined | UserProfileResponse => {
        const queryClient = useQueryClient();
        return queryClient.getQueryData(["user"]);
    }

    const getSignedUserElseThrow = (): UserProfileResponse => {
        const queryClient = useQueryClient();
        const user: UserProfileResponse | undefined = queryClient.getQueryData(["user"]);
        return validateIsNotUndefined({ user }).user;
    }

    const getFollowingsByUserId = (userId: ResId): UserPage | undefined => {
        const queryClient = useQueryClient();
        return queryClient.getQueryData(["followings", { id: userId }]);
    }

    const getFollowersByUserId = (userId: ResId): UserPage | undefined => {
        const queryClient = useQueryClient();
        return queryClient.getQueryData(["followers", { id: userId }]);
    }

    const getFollowingsByUser = (userId: ResId): UserPage | undefined => {
        const queryClient = useQueryClient();
        return queryClient.getQueryData(["followings", { id: userId }]);
    }

    const getFollowersByUser = (userId: ResId): UserPage | undefined => {
        const queryClient = useQueryClient();
        return queryClient.getQueryData(["followers", { id: userId }]);
    }

    return {
        getSignedUser,
        getSignedUserElseThrow,
        getFollowingsByUserId,
        getFollowersByUserId,
        getFollowingsByUser,
        getFollowersByUser
    }
}

export default useUserQueries