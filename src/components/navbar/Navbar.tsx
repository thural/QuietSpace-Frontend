import ComponentList from "@/components/shared/ComponentList";
import ErrorComponent from "@/components/shared/errors/ErrorComponent";
import useNotification from "@/services/hook/navbar/useNotification";
import withErrorBoundary from "@/services/hook/shared/withErrorBoundary";
import styles from "@/styles/navbar/navbarStyles";
import { Badge } from "@mantine/core";
import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import NavStyled from "@shared/NavStyled";
import Typography from "@shared/Typography";
import {
  PiBell,
  PiBellFill,
  PiChatCircle,
  PiChatCircleFill,
  PiHouse,
  PiHouseFill,
  PiMagnifyingGlass,
  PiMagnifyingGlassFill,
  PiUser,
  PiUserFill
} from "react-icons/pi";
import { useLocation } from "react-router-dom";
import NavItem, { NavItemProps } from "./base/NavItem";
import NavMenu from "./menu/NavMenu";




const NavBar = () => {

  const classes = styles();
  const pathName = useLocation().pathname;

  let data = undefined;

  try {
    data = useNotification();
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = `error loading notification data: ${(error as Error).message}`;
    return <ErrorComponent message={errorMessage} />;
  }

  const { hasPendingNotification, hasUnreadChat } = data;

  const itemList: Array<NavItemProps> = [
    {
      linkTo: "/feed",
      pathName: pathName,
      icon: <PiHouse />,
      iconFill: <PiHouseFill />
    },
    {
      linkTo: "/search",
      pathName: pathName,
      icon: <PiMagnifyingGlass />,
      iconFill: <PiMagnifyingGlassFill />
    },
  ];

  const notification = {
    linkTo: "/notification/all",
    pathName: pathName,
    icon: <PiBell />,
    iconFill: <PiBellFill />
  }

  const profile = {
    linkTo: "/profile",
    pathName: pathName,
    icon: <PiUser />,
    iconFill: <PiUserFill />
  }

  const chat = {
    linkTo: "/chat",
    pathName: pathName,
    icon: <PiChatCircle />,
    iconFill: <PiChatCircleFill />
  }


  return (
    <BoxStyled className={classes.navbar}>
      <Typography type="h1" className="title">QS</Typography>
      <NavStyled>
        <ComponentList Component={NavItem} list={itemList} />
        <NavItem {...chat}>
          <Conditional isEnabled={hasUnreadChat}>
            <Badge className="badge" circle />
          </Conditional>
        </NavItem>
        <NavItem {...profile} />
        <NavItem {...notification}>
          <Conditional isEnabled={hasPendingNotification}>
            <Badge className="badge" circle />
          </Conditional>
        </NavItem>
      </NavStyled>
      <BoxStyled className="navbar-item menu"><NavMenu /></BoxStyled>
    </BoxStyled>
  )
}

export default withErrorBoundary(NavBar);