import { PagedComment } from "@/api/schemas/inferred/comment";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";
import BoxStyled from "@components/shared/BoxStyled";
import { UseQueryResult } from "@tanstack/react-query";
import CommentBox from "../base/Comment";
import CommentReply from "../replly/CommentReply";
import styles from "./styles/commentPanelStyles";


interface CommentPanelProps {
    comments: UseQueryResult<PagedComment>
}


const CommentPanel: React.FC<CommentPanelProps> = ({ comments }) => {

    const classes = styles();

    if (comments.isLoading) return <FullLoadingOverlay />;
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