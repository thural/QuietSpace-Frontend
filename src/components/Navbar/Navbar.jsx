import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./styles/navbarStyles";
import Menu from "./Menu";
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
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@mantine/core";
import NavbarItem from "./NavbarItem";




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
    <div className={classes.navbar}>
      <h1 className="title">QS</h1>
      <nav>
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
          {hasPendingNotification && <Badge className="badge" circle />}
        </NavbarItem>
      </nav>
      <div className="navbar-item menu">
        <Menu />
      </div>
    </div>
  )
}

export default NavBar