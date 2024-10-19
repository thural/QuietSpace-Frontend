import BoxStyled from "@shared/BoxStyled";
import { useQueryClient } from "@tanstack/react-query";
import CommentForm from "../form/CommentForm";
import styles from "./styles/commentPanelStyles";
import CommentList from "../../list/CommentList";


const CommentPanel = ({ postId }) => {

    const classes = styles();

    const queryClient = useQueryClient();
    const commentData = queryClient.getQueryData(["comments", { id: postId }]);
    const comments = commentData.content;





    return (
        <BoxStyled className={classes.commentSection}>
            <CommentForm postId={postId} />
            <CommentList comments={comments} postId={postId} />
        </BoxStyled>
    )
}

export default CommentPanel