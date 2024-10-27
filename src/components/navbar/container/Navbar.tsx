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
import NavMenu from "../components/menu/NavMenu";
import styles from "./styles/navbarStyles";
import useNotification from "./hooks/useNotification";
import NavItem from "../components/base/NavItem";
import { NavItemProps } from "../components/base/types/navItemTypes";
import ComponentList from "@/components/shared/ComponentList";




const NavBar = () => {

  const classes = styles();
  const pathName = useLocation().pathname;
  const { hasPendingNotification } = useNotification();

  const itemList: Array<NavItemProps> = [
    {
      linkTo: "/posts",
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
    {
      linkTo: "/chat",
      pathName: pathName,
      icon: <PiChatCircle />,
      iconFill: <PiChatCircleFill />
    },
    {
      linkTo: "/profile",
      pathName: pathName,
      icon: <PiUser />,
      iconFill: <PiUserFill />
    },
    {
      linkTo: "/notification/all",
      pathName: pathName,
      icon: <PiBell />,
      iconFill: <PiBellFill />
    }
  ];


  return (
    <BoxStyled className={classes.navbar}>
      <Typography type="h1" className="title">QS</Typography>
      <NavStyled>
        <ComponentList Component={NavItem} list={itemList} />
        <Conditional isEnabled={hasPendingNotification}>
          <Badge className="badge" circle />
        </Conditional>
      </NavStyled>
      <BoxStyled className="navbar-item menu"><NavMenu /></BoxStyled>
    </BoxStyled>
  )
}

export default NavBar