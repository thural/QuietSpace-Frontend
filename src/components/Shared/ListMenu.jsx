import { useState } from "react";
import BoxStyled from "./BoxStyled";
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
        <BoxStyled>
            <BoxStyled onClick={toggleDisplay} className={classes.menu}>{menuIcon}</BoxStyled>
            <BoxStyled className={classes.menuOverlay} style={{ display }} onClick={() => setDisplay('none')}></BoxStyled>
            <BoxStyled className={classes.menuList} style={{ display, position }} onClick={hideMenu}>{children}</BoxStyled>
        </BoxStyled>
    )
}

export default ListMenu