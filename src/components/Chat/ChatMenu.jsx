import React, { useState } from "react";
import styles from "./styles/chatMenuStyles";
import { PiDotsThreeVertical } from "react-icons/pi";


const ChatMenu = ({ handleDeleteChat, isMutable }) => {

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    return (
        <>
            <div onClick={toggleDisplay} className={classes.menu}>
                <PiDotsThreeVertical />
            </div>

            <div className={classes.menuOverlay} style={{ display }} onClick={() => setDisplay('none')}></div>

            <div onClick={() => setDisplay('none')} className={classes.menuList} style={{display}}>

                {isMutable &&
                    <>
                        <div className="clickable" alt={"mute chat icon"}>
                            <p>mute</p>
                        </div>

                        <div className="clickable" onClick={handleDeleteChat} alt={"delete chat icon"}>
                            <p>remove</p>
                        </div>

                        <div className="clickable" alt={"block post icon"}>
                            <p>block</p>
                        </div>

                        <div className="clickable" alt={"report post icon"}>
                            <p>report</p>
                        </div>
                    </>
                }

            </div>
        </>
    )
}

export default ChatMenu