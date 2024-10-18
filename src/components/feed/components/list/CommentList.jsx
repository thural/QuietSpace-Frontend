import CommentReply from "../comment/replly/CommentReply";
import Comment from "../comment/base/Comment";

const CommentList = ({ comments, postId }) => {
    if (!comments) return null;
    return comments.map((comment, index) => {
        if (!comment.parentId) return <Comment key={index} postId={postId} comment={comment} />;
        const repliedComment = comments.find(c => c.id === comment.parentId);
        return <CommentReply key={index} comment={comment} repliedComment={repliedComment} />;
    })
}

export default CommentList