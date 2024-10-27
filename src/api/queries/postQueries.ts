import { useQueryClient } from "@tanstack/react-query";
import { PostPage } from "../schemas/inferred/post";
import { ResId } from "../schemas/native/common";



const postQueries = () => {

    const queryCLient = useQueryClient();


    const getPostsByUserId = (userId: ResId): PostPage | undefined => {
        return queryCLient.getQueryData(["posts/user", { id: userId }]);
    }


    return {
        getPostsByUserId
    }
}

export default postQueries