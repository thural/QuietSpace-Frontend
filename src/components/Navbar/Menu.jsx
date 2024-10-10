import React, { useState } from "react";
import styles from "./styles/menuStyles";
import { RiMenu3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { PiBookmarkSimple, PiClockCounterClockwise, PiGearSix, PiSignOut } from "react-icons/pi";
import Clickable from "../Shared/Clickable";


const Menu = () => {

    const classes = styles();

    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    return (
        <>
            <div className={classes.icon} onClick={toggleDisplay} style={{ cursor: 'pointer' }}><RiMenu3Fill /></div>
            <div className={classes.menuOverlay} style={{ display }} onClick={() => setDisplay('none')}></div>
            <div onClick={() => setDisplay('none')} className={classes.menuList} style={{ display }}>
                <Link to="/saved">
                    <Clickable text="Saved" >
                        <PiBookmarkSimple />
                    </Clickable>
                </Link>
                <Link to="/activity">
                    <Clickable text="Activity" >
                        <PiClockCounterClockwise />
                    </Clickable>
                </Link>
                <Link to="/settings">
                    <Clickable text="Settings" >
                        <PiGearSix />
                    </Clickable>
                </Link>
                <Link to="/signout">
                    <Clickable text="Logout" >
                        <PiSignOut />
                    </Clickable>
                </Link>
            </div>
        </>
    )
}

export default Menu