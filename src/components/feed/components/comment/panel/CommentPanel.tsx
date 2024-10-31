import BoxStyled from "@components/shared/BoxStyled";
import CommentForm from "../form/CommentForm";
import styles from "./styles/commentPanelStyles";
import CommentListComp from "../../list/CommentList";
import { ResId } from "@/api/schemas/inferred/common";
import ErrorComponent from "@/components/shared/error/ErrorComponent";
import { UseQueryResult } from "@tanstack/react-query";
import { PagedComment } from "@/api/schemas/inferred/comment";
import FullLoadingOverlay from "@/components/shared/FullLoadingOverlay";


interface CommentPanelProps {
    postId: ResId
    comments: UseQueryResult<PagedComment>
}


const CommentPanel: React.FC<CommentPanelProps> = ({ postId, comments }) => {

    const classes = styles();

    if (comments.isLoading) return <FullLoadingOverlay />;
    if (comments.isError) return <ErrorComponent message="could not load comments" />;


    return (
        <BoxStyled className={classes.commentSection}>
            <CommentForm postId={postId} />
            <CommentListComp comments={comments.data?.content} postId={postId} />
        </BoxStyled>
    )
}

export default CommentPanel