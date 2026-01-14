import { useGetComments } from "@/services/data/useCommentData";
import { ResId } from "@/api/schemas/inferred/common";

const usePostComments = (postId: ResId, signedUser: { id: ResId; role?: string } | undefined) => {
    const comments = useGetComments(postId);
    const commentCount = comments.data ? comments.data.totalElements : 0;
    const hasCommented = comments.data ? comments.data.content.some(comment => comment.userId === signedUser?.id) : false;

    return { comments, commentCount, hasCommented };
};

export default usePostComments;
