import { useState } from "react";
import styles from "./styles/shareMenuStyles";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";
import Clickable from "@/components/shared/Clickable";
import BoxStyled from "@/components/shared/BoxStyled";
import { ConsumerFn } from "@/types/genericTypes";

interface ShareMenuProps {
    handleSendClick: ConsumerFn
    handleRepostClick: ConsumerFn
}

const ShareMenu: React.FC<ShareMenuProps> = ({ handleSendClick, handleRepostClick }) => {

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    return (
        <>
            <BoxStyled onClick={toggleDisplay} className={classes.menu}>
                <PiShareFat />
            </BoxStyled>
            <BoxStyled className={classes.menuOverlay} style={{ display }} onClick={toggleDisplay} />
            <BoxStyled className={classes.menuList} style={{ display }}>
                <Clickable text="Send" handleClick={handleSendClick} >
                    <PiPaperPlaneTilt />
                </Clickable>
                <Clickable text="Repost" handleClick={handleRepostClick} >
                    <PiArrowsClockwise />
                </Clickable>
            </BoxStyled>
        </>
    )
}

export default ShareMenu