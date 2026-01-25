import Clickable from "@/shared/Clickable";
import ListMenu from "@/shared/ListMenu";
import CustomLink, { CustomLinkProps } from "@/shared/routes/CustomLink";
import useTheme from "@shared/hooks/useTheme";
import { Switch } from "@/shared/ui/components";
import { PiBookmarkSimple, PiClockCounterClockwise, PiGearSix, PiMoon, PiSignOut, PiSun } from "react-icons/pi";
import { RiMenu3Fill } from "react-icons/ri";

/**
 * NavMenu component.
 * 
 * This component renders a navigation menu with links to various sections of the application.
 * It includes links for saved items, activity, settings, and logout, each represented by an icon.
 * Additionally, it features a switch to toggle between light and dark themes.
 * 
 * @returns {JSX.Element} - The rendered NavMenu component containing the list of links and theme switch.
 */
const NavMenu = () => {
    const { isDarkMode, setThemeMode } = useTheme();

    // Define the navigation links with their properties
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
                        Component={
                            <Clickable styleProps={{ padding: '1.25rem' }} text={linkData.text}>
                                {linkData.Component}
                            </Clickable>
                        }
                    />)
            }
            <div style={{ padding: '0.5rem 0.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                {isDarkMode ? <PiMoon size="1.75rem" /> : <PiSun size="1.75rem" />}
                <Switch
                    size="lg"
                    checked={isDarkMode}
                    onChange={(checked) => setThemeMode(checked)}
                />
            </div>
        </ListMenu>
    );
}

export default NavMenu;
