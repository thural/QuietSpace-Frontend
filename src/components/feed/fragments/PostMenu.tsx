import { ResId } from "@/api/schemas/native/common";
import { useSavePost } from "@/services/data/usePostData";
import { ConsumerFn } from "@/types/genericTypes";
import Clickable from "@components/shared/Clickable";
import Conditional from "@components/shared/Conditional";
import ListMenu from "@components/shared/ListMenu";
import { PiDotsThreeVertical } from "react-icons/pi";

interface PostMenu {
    handleDeletePost: ConsumerFn
    toggleEditForm: ConsumerFn
    isMutable?: boolean
    isRepost?: boolean
    postId: ResId
}

const PostMenu: React.FC<PostMenu> = ({ postId, handleDeletePost, toggleEditForm, isMutable = false, isRepost = false }) => {

    const savePost = useSavePost();

    const handleSavePost = () => {
        savePost.mutate(postId);
    }

    const handleReportPost = () => {
        // TODO: handle report post
    }


    return (
        <ListMenu menuIcon={<PiDotsThreeVertical />}>
            <Conditional isEnabled={isMutable && !isRepost}>
                <Clickable handleClick={toggleEditForm} alt="edit post" text="edit" />
            </Conditional>
            <Conditional isEnabled={isMutable} >
                <Clickable handleClick={handleDeletePost} alt="remove post" text="remove" />
            </Conditional>
            <Conditional isEnabled={!isMutable} >
                <Clickable handleClick={handleSavePost} alt="save post" text="save" />
                <Clickable handleClick={handleReportPost} alt="report post" text="report" />
            </Conditional>
        </ListMenu>
    )
}

export default PostMenu