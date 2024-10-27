import { useQueryClient } from "@tanstack/react-query";
import { ResId } from "../schemas/native/common";
import { User, UserPage } from "../schemas/inferred/user";



const userQueries = () => {

    const queryClient = useQueryClient();

    const getSignedUser = (): User | undefined => {
        return queryClient.getQueryData(["user"]);
    }

    const getFollowingsByUserId = (userId: ResId): UserPage | undefined => {
        return queryClient.getQueryData(["followings", { id: userId }]);
    }

    const getFollowersByUserId = (userId: ResId): UserPage | undefined => {
        return queryClient.getQueryData(["followers", { id: userId }]);
    }

    const getFollowingsByUser = (userId: ResId): UserPage | undefined => {
        return queryClient.getQueryData(["followings", { id: userId }]);
    }

    const getFollowersByUser = (userId: ResId): UserPage | undefined => {
        return queryClient.getQueryData(["followers", { id: userId }]);
    }

    return {
        getSignedUser,
        getFollowingsByUserId,
        getFollowersByUserId,
        getFollowingsByUser,
        getFollowersByUser
    }
}


export default userQueries

