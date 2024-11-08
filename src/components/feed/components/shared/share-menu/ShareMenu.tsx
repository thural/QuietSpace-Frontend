import { useState } from "react";
import styles from "./styles/shareMenuStyles";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";
import Clickable from "@/components/shared/Clickable";
import BoxStyled from "@/components/shared/BoxStyled";


const ShareMenu = () => {

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    return (
        <>
            <BoxStyled onClick={toggleDisplay} className={classes.menu}>
                <PiShareFat />
            </BoxStyled>
            <BoxStyled className={classes.menuOverlay} style={{ display }} onClick={toggleDisplay} />
            <BoxStyled onClick={toggleDisplay} className={classes.menuList} style={{ display }}>
                <Clickable text="Send">
                    <PiPaperPlaneTilt />
                </Clickable>
                <Clickable text="Repost">
                    <PiArrowsClockwise />
                </Clickable>
            </BoxStyled>
        </>
    )
}

export default ShareMenu