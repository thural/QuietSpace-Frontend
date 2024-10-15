import Clickable from "@shared/Clickable";
import ListMenu from "@shared/ListMenu";
import React from "react";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";


const ShareMenu = () => {

    const handleSendPost = () => {
        // TODO: handle send post
    }

    const handleRepost = () => {
        // TODO: handle repost
    }

    return (
        <ListMenu styleUpdate={{ position: "absolute", top: "50%", right: "50%" }} menuIcon={<PiShareFat />}>
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