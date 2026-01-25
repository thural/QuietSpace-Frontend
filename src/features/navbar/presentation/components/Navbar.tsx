import ComponentList from "@/shared/ComponentList";
import ErrorComponent from "@/shared/errors/ErrorComponent";
import withErrorBoundary from "@shared/hooks/withErrorBoundary";
import { Navbar as StyledNavbar } from "../styles/NavbarStyles";
import { Badge } from "@mantine/core";
import Conditional from "@shared/Conditional";
import NavStyled from "../../shared/NavStyled";
import Typography from "@shared/Typography";
import { useLocation } from "react-router-dom";
import NavItem, { NavItemProps } from "./NavItem";
import NavMenu from "./NavMenu";
import { useNavbar } from "../../application";
import { NAVBAR_ICONS } from "@shared/navbar/constants";

/**
 * NavBar component.
 * 
 * This component represents the navigation bar of the application, 
 * consisting of links to various sections such as the feed, search, 
 * notifications, profile, and chat. It includes icons for each link 
 * that change based on the current pathname. The navbar also displays 
 * badges for unread notifications and chats.
 * 
 * @returns {JSX.Element} - The rendered NavBar component containing 
 *                          navigation items and menus.
 */
const NavBar = () => {
  const pathName = useLocation().pathname;

  const { notificationData, navigationItems, error } = useNavbar();

  if (error) {
    return <ErrorComponent message={`error loading notification data: ${error.message}`} />;
  }

  const { hasPendingNotification, hasUnreadChat } = notificationData;

  /**
   * Converts navigation config to NavItem props with JSX icons.
   */
  const convertToNavItemProps = (config: any): NavItemProps => ({
    linkTo: config.linkTo,
    pathName: config.pathName,
    icon: NAVBAR_ICONS[config.icons.icon as keyof typeof NAVBAR_ICONS],
    iconFill: NAVBAR_ICONS[config.icons.iconFill as keyof typeof NAVBAR_ICONS]
  });

  const mainItemProps = navigationItems.mainItems.map(convertToNavItemProps);
  const chatProps = convertToNavItemProps(navigationItems.chat);
  const profileProps = convertToNavItemProps(navigationItems.profile);
  const notificationProps = convertToNavItemProps(navigationItems.notification);

  return (
    <StyledNavbar>
      <Typography type="h1" className="title">QS</Typography>
      <NavStyled>
        <ComponentList Component={NavItem} list={mainItemProps} />
        <NavItem {...chatProps}>
          <Conditional isEnabled={hasUnreadChat}>
            <Badge className="badge" circle />
          </Conditional>
        </NavItem>
        <NavItem {...profileProps} />
        <NavItem {...notificationProps}>
          <Conditional isEnabled={hasPendingNotification}>
            <Badge className="badge" circle />
          </Conditional>
        </NavItem>
      </NavStyled>
      <StyledNavbar className="navbar-item menu"><NavMenu /></StyledNavbar>
    </StyledNavbar>
  )
}

export default withErrorBoundary(NavBar);
