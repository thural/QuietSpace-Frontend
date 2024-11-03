import BoxStyled from "@shared/BoxStyled";

import { PiBookmarkSimple, PiClockCounterClockwise, PiGearSix, PiSignOut } from "react-icons/pi";
import { RiMenu3Fill } from "react-icons/ri";

import CustomLink, { CustomLinkProps } from "@/components/shared/routes/CustomLink";
import useNavMenu from "./hooks/useNavMenu";
import styles from "./styles/navMenuStyles";


const NavMenu = () => {

    const classes = styles();
    const { display, setDisplay, toggleDisplay, hideMenu } = useNavMenu();

    const links: Array<CustomLinkProps> = [
        { to: "/saved", text: "saved", Component: <PiBookmarkSimple /> },
        { to: "/activity", text: "activity", Component: <PiClockCounterClockwise /> },
        { to: "/settings", text: "settings", Component: <PiGearSix /> },
        { to: "/signout", text: "logout", Component: <PiSignOut /> },
    ];

    const LinkList = () => links.map(linkData => <CustomLink {...linkData} />)

    return (
        <>
            <BoxStyled className={classes.icon} onClick={toggleDisplay} style={{ cursor: 'pointer' }}><RiMenu3Fill /></BoxStyled>
            <BoxStyled className={classes.menuOverlay} style={{ display }} onClick={hideMenu}></BoxStyled>
            <BoxStyled onClick={() => setDisplay('none')} className={classes.menuList} style={{ display }}><LinkList /></BoxStyled>
        </>
    )
}

export default NavMenu