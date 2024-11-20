import { ResId } from "@/api/schemas/native/common";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import LoaderStyled from "@/components/shared/LoaderStyled";
import { useGetComments } from "@/services/data/useCommentData";
import styles from "@/styles/feed/commentPanelStyles";
import BoxStyled from "@components/shared/BoxStyled";
import CommentBox from "./Comment";
import CommentReply from "./CommentReply";


interface CommentPanelProps {
    postId: ResId | undefined
}


const CommentPanel: React.FC<CommentPanelProps> = ({ postId }) => {

    const classes = styles();
    if (postId === undefined) return null;
    const comments = useGetComments(postId);


    if (comments.isLoading) return <LoaderStyled />;
    if (comments.isError) return <ErrorComponent message="could not load comments" />;


    const CommentList = () => {
        if (comments.data?.totalElements === 0) return null;
        return (
            <>
                {comments.data?.content.map((comment, index) => {
                    if (!comment.parentId) return <CommentBox key={index} comment={comment} />;
                    const repliedComment = comments.data.content.find(c => c.id === comment.parentId);
                    return <CommentReply key={index} comment={comment} repliedComment={repliedComment} />;
                })}
            </>
        )
    }


    return (
        <BoxStyled className={classes.commentSection}>
            <CommentList />
        </BoxStyled>
    )
}

export default CommentPanel