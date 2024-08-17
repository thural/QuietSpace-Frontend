import React, { useState } from "react";
import styles from "./styles/shareMenuStyles";
import { PiArrowsClockwise, PiPaperPlaneTilt, PiShareFat } from "react-icons/pi";


const ShareMenu = () => {

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    return (
        <>
            <div onClick={toggleDisplay} className={classes.menu}>
                <PiShareFat />
            </div>

            <div className={classes.menuOverlay} style={{ display }} onClick={() => setDisplay('none')}></div>

            <div onClick={() => setDisplay('none')} className={classes.menuList} style={{ display }}>

                <div className="clickable">
                    <p>Send</p>
                    <PiPaperPlaneTilt />
                </div>

                <div className="clickable">
                    <p>Repost</p>
                    <PiArrowsClockwise />
                </div>
            </div>
        </>
    )
}

export default ShareMenu