import { ConsumerFn } from "@/types/genericTypes";
import Clickable from "@components/shared/Clickable";
import Conditional from "@components/shared/Conditional";
import ListMenu from "@components/shared/ListMenu";
import { PiDotsThreeVertical } from "react-icons/pi";

interface PostMenu {
    handleDeletePost: ConsumerFn
    setViewData: ConsumerFn
    isMutable: boolean
}

const PostMenu: React.FC<PostMenu> = ({ handleDeletePost, setViewData, isMutable }) => {

    const handleEditPost = () => {
        setViewData({ editPost: true })
    }

    const handleSavePost = () => {
        // TODO: handle save post
    }

    const handleReportPost = () => {
        // TODO: handle report post
    }


    return (
        <ListMenu styleUpdate={{}} menuIcon={<PiDotsThreeVertical />}>
            <Conditional isEnabled={isMutable} >
                <Clickable handleClick={handleEditPost} alt="edit post" text="edit" />
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