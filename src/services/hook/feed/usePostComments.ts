import { useGetComments } from "@/services/data/useCommentData";

const usePostComments = (postId: string, signedUser: { id: string; role?: string } | undefined) => {
    const comments = useGetComments(postId);
    const commentCount = comments.data ? comments.data.totalElements : 0;
    const hasCommented = comments.data ? comments.data.content.some(comment => comment.userId === signedUser?.id) : false;

    return { comments, commentCount, hasCommented };
};

export default usePostComments;
