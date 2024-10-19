import Clickable from "@shared/Clickable";
import Conditional from "@shared/Conditional";
import ListMenu from "@shared/ListMenu";
import { PiDotsThreeVertical } from "react-icons/pi";


const PostMenu = ({ handleDeletePost, setViewData, isMutable }) => {

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
        <ListMenu menuIcon={<PiDotsThreeVertical />}>
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