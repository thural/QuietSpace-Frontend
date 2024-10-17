import BoxStyled from "@shared/BoxStyled";
import Clickable from "@shared/Clickable";
import React, { useState } from "react";
import { PiBookmarkSimple, PiClockCounterClockwise, PiGearSix, PiSignOut } from "react-icons/pi";
import { RiMenu3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import styles from "./navMenuStyles";


const NavMenu = () => {

    const classes = styles();

    const [display, setDisplay] = useState("none");

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    const hideMenu = () => {
        setDisplay("none")
    }

    return (
        <>
            <BoxStyled className={classes.icon} onClick={toggleDisplay} style={{ cursor: 'pointer' }}><RiMenu3Fill /></BoxStyled>
            <BoxStyled className={classes.menuOverlay} style={{ display }} onClick={hideMenu}></BoxStyled>
            <BoxStyled onClick={() => setDisplay('none')} className={classes.menuList} style={{ display }}>
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
            </BoxStyled>
        </>
    )
}

export default NavMenu