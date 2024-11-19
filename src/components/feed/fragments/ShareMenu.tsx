import BoxStyled from "@/components/shared/BoxStyled";
import Clickable from "@/components/shared/Clickable";
import styles from "@/styles/feed/shareMenuStyles";
import { ConsumerFn } from "@/types/genericTypes";
import { useState } from "react";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";

interface ShareMenuProps {
    handleShareClick: ConsumerFn
    handleRepostClick: ConsumerFn
}

const ShareMenu: React.FC<ShareMenuProps> = ({ handleShareClick, handleRepostClick }) => {

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    const handleSend = (event: React.MouseEvent) => {
        handleShareClick(event);
        toggleDisplay(event);
    }

    const handleRepost = (event: React.MouseEvent) => {
        handleRepostClick(event);
        toggleDisplay(event);
    }

    return (
        <>
            <BoxStyled onClick={toggleDisplay} className={classes.menu}>
                <PiShareFat />
            </BoxStyled>
            <BoxStyled className={classes.menuOverlay} style={{ display }} onClick={toggleDisplay} />
            <BoxStyled className={classes.menuList} style={{ display }}>
                <Clickable text="Send" handleClick={handleSend} >
                    <PiPaperPlaneTilt />
                </Clickable>
                <Clickable text="Repost" handleClick={handleRepost} >
                    <PiArrowsClockwise />
                </Clickable>
            </BoxStyled>
        </>
    )
}

export default ShareMenu