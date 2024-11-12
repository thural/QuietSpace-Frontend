import { ResId } from "@/api/schemas/native/common";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import LoaderStyled from "@/components/shared/LoaderStyled";
import BoxStyled from "@components/shared/BoxStyled";
import CommentBox from "../base/Comment";
import CommentReply from "../replly/CommentReply";
import styles from "./styles/commentPanelStyles";
import { useGetComments } from "@/services/data/useCommentData";


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
        const renderResult = comments.data?.content.map((comment, index) => {
            if (!comment.parentId) return <CommentBox key={index} comment={comment} />;
            const repliedComment = comments.data.content.find(c => c.id === comment.parentId);
            return <CommentReply key={index} comment={comment} repliedComment={repliedComment} />;
        })
        return (
            <>
                <hr />
                {renderResult}
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