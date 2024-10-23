import BoxStyled from "@components/shared/BoxStyled";
import { useQueryClient } from "@tanstack/react-query";
import CommentForm from "../form/CommentForm";
import styles from "./styles/commentPanelStyles";
import CommentList from "../../list/CommentList";
import { ResId } from "@/api/schemas/common";
import { PagedCommentResponse } from "@/api/schemas/comment";
import { produceUndefinedError } from "@/utils/errorUtils";


const CommentPanel = ({ postId }: { postId: ResId }) => {

    const classes = styles();

    const queryClient = useQueryClient();
    const commentData: PagedCommentResponse | undefined = queryClient.getQueryData(["comments", { id: postId }]);

    if (commentData === undefined) throw produceUndefinedError({ commentData })
    const comments = commentData.content;


    return (
        <BoxStyled className={classes.commentSection}>
            <CommentForm postId={postId} />
            <CommentList comments={comments} postId={postId} />
        </BoxStyled>
    )
}

export default CommentPanel