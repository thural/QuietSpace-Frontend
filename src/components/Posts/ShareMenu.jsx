import React from "react";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";
import Clickable from "../Shared/Clickable";
import ListMenu from "../Shared/ListMenu";


const ShareMenu = () => {

    const handleSendPost = () => {
        // TODO: handle send post
    }

    const handleRepost = () => {
        // TODO: handle repost
    }

    return (
        <ListMenu position={"relative"} menuIcon={<PiShareFat />}>
            <Clickable text="Send" handleClick={handleSendPost} >
                <PiPaperPlaneTilt />
            </Clickable>
            <Clickable text="Repost" handleClick={handleRepost} >
                <PiArrowsClockwise />
            </Clickable>
        </ListMenu>
    )
}

export default ShareMenu