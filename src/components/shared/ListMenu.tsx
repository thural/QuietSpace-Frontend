import styles from "@/styles/shared/listMenuStyles";
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { useState } from "react";
import BoxStyled from "./BoxStyled";

export interface MenuListStyleProps {
    position?: string,
    width?: string,
    fontSize?: string,
    fontWeight?: string,
    radius?: string,
    iconSize?: string,
    padding?: string
    display?: string
}

export interface ListMenuProps extends GenericWrapperWithRef {
    menuIcon: React.ReactNode
    styleProps?: MenuListStyleProps
}

const ListMenu: React.FC<ListMenuProps> = ({ menuIcon, styleProps, children }) => {

    const classes = styles(styleProps);
    const [display, setDisplay] = useState("none");

    const toggleDisplay = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    const hideMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setDisplay("none");
    }

    return (
        <>
            <BoxStyled onClick={toggleDisplay} className={classes.menuIcon}>{menuIcon}</BoxStyled>
            <BoxStyled className={classes.menuOverlay} style={{ display }} onClick={hideMenu}></BoxStyled>
            <BoxStyled className={classes.menuList} style={{ display }} onClick={hideMenu}>{children}</BoxStyled>
        </>
    )
}

export default ListMenu