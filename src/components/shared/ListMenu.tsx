import { useState } from "react";
import BoxStyled from "./BoxStyled";
import styles from "./styles/listMenuStyles";

const ListMenu = ({ children, menuIcon, styleUpdate }) => {

    const classes = styles();
    const [display, setDisplay] = useState("none");

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    const hideMenu = () => {
        setDisplay("none");
    }

    const appliedStyle = { display, ...styleUpdate }

    return (
        <BoxStyled>
            <BoxStyled onClick={toggleDisplay} className={classes.menuIcon}>{menuIcon}</BoxStyled>
            <BoxStyled className={classes.menuOverlay} style={{ display }} onClick={hideMenu}></BoxStyled>
            <BoxStyled className={classes.menuList} style={appliedStyle} onClick={hideMenu}>{children}</BoxStyled>
        </BoxStyled>
    )
}

export default ListMenu