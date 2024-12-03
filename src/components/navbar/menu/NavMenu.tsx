
import Clickable from "@/components/shared/Clickable";
import ListMenu from "@/components/shared/ListMenu";
import CustomLink, { CustomLinkProps } from "@/components/shared/routes/CustomLink";
import { PiBookmarkSimple, PiClockCounterClockwise, PiGearSix, PiSignOut } from "react-icons/pi";
import { RiMenu3Fill } from "react-icons/ri";


const NavMenu = () => {

    const links: Array<CustomLinkProps> = [
        { to: "/saved", text: "saved", Component: <PiBookmarkSimple /> },
        { to: "/activity", text: "activity", Component: <PiClockCounterClockwise /> },
        { to: "/settings", text: "settings", Component: <PiGearSix /> },
        { to: "/signout", text: "logout", Component: <PiSignOut /> },
    ];

    return (
        <ListMenu menuIcon={<RiMenu3Fill />} styleProps={{ iconSize: '1.75rem', fontSize: '1.75rem', width: "12.5rem" }}>
            {
                links.map((linkData, key) =>
                    <CustomLink
                        key={key}
                        {...linkData}
                        Component={<Clickable styleProps={{ padding: '1.25rem' }} text={linkData.text}>
                            {linkData.Component}
                        </Clickable>}
                    />)
            }
        </ListMenu>
    )
}

export default NavMenu