import { Badge } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
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
import BoxStyled from "../Shared/BoxStyled";
import Conditional from "../Shared/Conditional";
import NavStyled from "../Shared/NavStyled";
import Typography from "../Shared/Typography";
import Menu from "./Menu";
import NavbarItem from "./NavbarItem";
import styles from "./styles/navbarStyles";




const NavBar = () => {

  const classes = styles();

  const queryClient = useQueryClient();
  const pathName = useLocation().pathname;
  const chats = queryClient.getQueryData(["chats"]);
  const user = queryClient.getQueryData(["user"]);
  const notifications = queryClient.getQueryData(["notifications"]);


  var hasUnreadChat = useMemo(() => {
    return chats?.some(({ recentMessage }) => {
      !recentMessage?.isSeen && recentMessage?.senderId !== user.id
    });
  }, [chats]);

  var hasPendingNotification = useMemo(() => {
    if (!notifications) return false;
    return notifications.content.some(({ isSeen }) => !isSeen);
  }, [notifications]);


  return (
    <BoxStyled className={classes.navbar}>
      <Typography type="h1" className="title">QS</Typography>
      <NavStyled>
        <NavbarItem
          linkTo="/posts"
          pathName={pathName}
          icon={<PiHouse />}
          iconFill={<PiHouseFill />}
        />
        <NavbarItem
          linkTo="/search"
          pathName={pathName}
          icon={<PiMagnifyingGlass />}
          iconFill={<PiMagnifyingGlassFill />}
        />
        <NavbarItem
          linkTo="/chat"
          pathName={pathName}
          icon={<PiChatCircle />}
          iconFill={<PiChatCircleFill />}
        />
        <NavbarItem
          linkTo="/profile"
          pathName={pathName}
          icon={<PiUser />}
          iconFill={<PiUserFill />}
        />
        <NavbarItem
          linkTo="/notification/all"
          pathName={pathName}
          icon={<PiBell />}
          iconFill={<PiBellFill />}
        >
          <Conditional isEnabled={hasPendingNotification}>
            <Badge className="badge" circle />
          </Conditional>
        </NavbarItem>
      </NavStyled>
      <BoxStyled className="navbar-item menu"><Menu /></BoxStyled>
    </BoxStyled>
  )
}

export default NavBar