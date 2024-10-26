import BoxStyled from "@components/shared/BoxStyled";
import { useQueryClient } from "@tanstack/react-query";
import CommentForm from "../form/CommentForm";
import styles from "./styles/commentPanelStyles";
import CommentListComp from "../../list/CommentList";
import { ResId } from "@/api/schemas/inferred/common";
import { PagedComment } from "@/api/schemas/inferred/comment";
import { nullishValidationdError } from "@/utils/errorUtils";


const CommentPanel = ({ postId }: { postId: ResId }) => {

    const classes = styles();

    const queryClient = useQueryClient();
    const commentData: PagedComment | undefined = queryClient.getQueryData(["comments", { id: postId }]);

    if (commentData === undefined) throw nullishValidationdError({ commentData })
    const comments = commentData.content;


    return (
        <BoxStyled className={classes.commentSection}>
            <CommentForm postId={postId} />
            <CommentListComp comments={comments} postId={postId} />
        </BoxStyled>
    )
}

export default CommentPanel