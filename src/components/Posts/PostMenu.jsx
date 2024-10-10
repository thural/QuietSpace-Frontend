import React from "react";
import Conditional from "../Shared/Conditional";
import ListMenu from "../Shared/ListMenu";
import Clickable from "../Shared/Clickable";


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
        <ListMenu>
            <Conditional isEnabled={isMutable} >
                <Clickable handleClick={handleEditPost} alt="edit post" text="edit" />
                <Clickable handleClick={handleDeletePost} alt="remove post" text="remove" />
            </Conditional>
            <Clickable handleClick={handleDeletePost} alt="remove post" text="remove" />
            <Clickable handleClick={handleSavePost} alt="save post" text="save" />
            <Clickable handleClick={handleReportPost} alt="report post" text="report" />
        </ListMenu>
    )
}

export default PostMenu