import React, { useState } from "react";
import styles from "./styles/menuStyles";
import { RiMenu3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { PiBookmarkSimple, PiClockCounterClockwise, PiGearSix, PiSignOut } from "react-icons/pi";


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
                    <div className="clickable">
                        <p>Saved</p>
                        <PiBookmarkSimple />
                    </div>
                </Link>
                <Link to="/activity">
                    <div className="clickable">
                        <p>Activity</p>
                        <PiClockCounterClockwise />
                    </div>
                </Link>
                <Link to="/settings">
                    <div className="clickable">
                        <p>Settings</p>
                        <PiGearSix />
                    </div>
                </Link>
                <Link to="/signout">
                    <div className="clickable">
                        <p>Logout</p>
                        <PiSignOut />
                    </div>
                </Link>
            </div>
        </>
    )
}

export default Menu