
import Clickable from "@/components/shared/Clickable";
import ListMenu from "@/components/shared/ListMenu";
import CustomLink, { CustomLinkProps } from "@/components/shared/routes/CustomLink";
import useTheme from "@/services/hook/shared/useTheme";
import { Switch } from "@mantine/core";
import { PiBookmarkSimple, PiClockCounterClockwise, PiGearSix, PiMoon, PiSignOut, PiSun } from "react-icons/pi";
import { RiMenu3Fill } from "react-icons/ri";
import { createUseStyles } from "react-jss";



const useStyles = createUseStyles({
    themeSwitch: (isDarkMode: boolean) => ({
        padding: '.5rem .25rem',
        "& .mantine-Switch-track": {
            width: "100%",
            justifyContent: isDarkMode ? "start" : "end",
        }
    })
});


const NavMenu = () => {

    const { isDarkMode, setThemeMode } = useTheme();
    const classes = useStyles(isDarkMode);

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
            <Switch
                size="xl"
                checked={isDarkMode}
                onChange={(event) => setThemeMode(event.currentTarget.checked)}
                onLabel={<PiSun size="1.75rem" />}
                offLabel={<PiMoon size="1.75rem" />}
                className={classes.themeSwitch}
            />
        </ListMenu>
    )
}

export default NavMenu