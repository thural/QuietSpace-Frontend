import React from "react";
import { PiDotsThreeVertical } from "react-icons/pi";
import Clickable from "../Shared/Clickable";
import Conditional from "../Shared/Conditional";
import ListMenu from "../Shared/ListMenu";


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