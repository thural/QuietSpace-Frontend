import { Page } from "@/api/schemas/inferred/common";
import { ResId } from "@/api/schemas/native/common";
import { DEFAULT_PAGE_SIZE } from "@/constants/params";
import { getInitInfinitePagesObject } from "@/utils/dataTemplates";
import {
    filterPageContentById,
    isPageIncludesEntity,
    isPageMatchesByNumber,
    pushToPageContent,
    transformInfinetePages,
    updateEntityContent
} from "@/utils/dataUtils";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { PostPage, PostResponse } from "../schemas/inferred/post";



const usePostQueries = () => {

    const queryClient = useQueryClient();

    const getPostsByUserId = (userId: ResId): PostPage | undefined => {
        return queryClient.getQueryData(["posts", "user", userId]);
    }

    const getPosts = (): PostPage | undefined => {
        return queryClient.getQueryData(["posts"]);
    }

    const getPostById = (postId: ResId): PostResponse | undefined => {
        return getPosts()?.content?.find(p => p.id === postId);
    }

    const insertPostCache = (post: PostResponse, queryKeys?: Array<string | ResId>) => {
        queryClient.setQueryData((queryKeys ?? ['posts']), (data: InfiniteData<Page<PostResponse>>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<PostResponse>) => isPageMatchesByNumber(page, lastPageNumber);
            if (data !== undefined) return pushToPageContent(data, post, predicate);
            else return getInitInfinitePagesObject(DEFAULT_PAGE_SIZE, [post]);
        });
    }

    const updatePostCache = (post: PostResponse, queryKeys?: Array<string | ResId>) => {
        queryClient.setQueryData((queryKeys ?? ['posts']), (data: InfiniteData<Page<PostResponse>>) => {
            return transformInfinetePages(data, post.id, isPageIncludesEntity, updateEntityContent, post);
        });
    }

    const deletePostCache = (postId: ResId, queryKeys?: Array<string | ResId>) => {
        queryClient.setQueryData((queryKeys ?? ['posts']), (oldData: InfiniteData<Page<PostResponse>>) => {
            return transformInfinetePages(oldData, postId, isPageIncludesEntity, filterPageContentById)
        });
    }

    return {
        getPostsByUserId,
        updatePostCache,
        getPosts,
        getPostById,
        insertPostCache,
        deletePostCache
    }
}

export default usePostQueries



