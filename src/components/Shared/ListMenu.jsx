import { useState } from "react";
import styles from "./styles/listMenuStyles";

const ListMenu = ({ children, menuIcon, position }) => {

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    const hideMenu = () => {
        setDisplay("none");
    }

    return (
        <>
            <div onClick={toggleDisplay} className={classes.menu}>{menuIcon}</div>
            <div className={classes.menuOverlay} style={{ display }} onClick={() => setDisplay('none')}></div>
            <div className={classes.menuList} style={{ display, position }} onClick={hideMenu}>{children}</div>
        </>
    )
}

export default ListMenu