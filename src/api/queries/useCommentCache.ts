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
import { CommentResponse, PagedComment } from "../schemas/inferred/comment";
import { Page } from "../schemas/inferred/common";
import { ResId } from "../schemas/native/common";


const useCommentCache = () => {

    const queryClient = useQueryClient();


    const getComments = (): Page<CommentResponse> | undefined => {
        return queryClient.getQueryData(["comments"]);
    }

    const getCommentsById = (postId: ResId): Page<CommentResponse> | undefined => {
        return queryClient.getQueryData(["comments", postId]);
    }

    const getCommentssByUserId = (userId: ResId): Page<CommentResponse> | undefined => {
        return queryClient.getQueryData(["comments", userId]);
    }

    const getCommentsByPostId = (postId: ResId): PagedComment | undefined => {
        return queryClient.getQueryData(["posts", postId, "comments"]);
    }

    const insertCommentCache = (comment: CommentResponse, queryKeys?: Array<string | ResId>) => {
        queryClient.setQueryData((queryKeys ?? ['comments']), (data: InfiniteData<Page<CommentResponse>>) => {
            const lastPageNumber = data.pages[0]?.number;
            const predicate = (page: Page<CommentResponse>) => isPageMatchesByNumber(page, lastPageNumber);
            if (data !== undefined) return pushToPageContent(data, comment, predicate);
            else return getInitInfinitePagesObject(DEFAULT_PAGE_SIZE, [comment]);
        });
    }

    const updateCommentCache = (comment: CommentResponse, queryKeys?: Array<string | ResId>) => {
        queryClient.setQueryData((queryKeys ?? ['comments']), (data: InfiniteData<Page<CommentResponse>>) => {
            return transformInfinetePages(data, comment.id, isPageIncludesEntity, updateEntityContent, comment);
        });
    }

    const deleteCommentCache = (postId: ResId, queryKeys?: Array<string | ResId>) => {
        queryClient.setQueryData((queryKeys ?? ['comments']), (oldData: InfiniteData<Page<CommentResponse>>) => {
            return transformInfinetePages(oldData, postId, isPageIncludesEntity, filterPageContentById)
        });
    }


    return {
        getComments,
        getCommentsById,
        getCommentssByUserId,
        getCommentsByPostId,
        insertCommentCache,
        updateCommentCache,
        deleteCommentCache
    }
}

export default useCommentCache


