import { Page } from "@/shared/api/models/common";
import { ResId } from "@/shared/api/models/commonNative";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/params";
import { getInitInfinitePagesObject } from "@/shared/utils/dataTemplates";
import {
    filterPageContentById,
    isPageIncludesEntity,
    isPageMatchesByNumber,
    pushToPageContent,
    transformInfinetePages,
    updateEntityContent
} from "@/shared/utils/dataUtils";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { PostPage, PostResponse } from "@/features/feed/data/models/post";



const usePostQueries = () => {

    const queryClient = useQueryClient();

    const getPosts = (): PostPage | undefined => {
        return queryClient.getQueryData(["posts"]);
    }

    const getPostsByUserId = (userId: ResId): PostPage | undefined => {
        return queryClient.getQueryData(["posts", userId]);
    }

    const getPostById = (postId: ResId): PostResponse | undefined => {
        return queryClient.getQueryData(["posts", postId]);
    }

    const insertPostCache = (post: PostResponse, queryKeys?: Array<string | ResId>) => {
        queryClient.setQueryData((queryKeys ?? ['posts']), (data: InfiniteData<Page<PostResponse>>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<PostResponse>) => isPageMatchesByNumber(page, lastPageNumber);
            if (data) return pushToPageContent(data, post, predicate);
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



