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




const NavBar = ({ children }) => {

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



  const classes = styles();

  return (
    <div className={classes.navbar}>
      <h1 className="title">QS</h1>
      <nav>
        <div className="navbar-item">
          <Link to="/posts">
            {pathName === "/posts" ? <PiHouseFill /> : <PiHouse />}
          </Link>
        </div>
        <div className="navbar-item">
          <Link to="/search">
            {pathName === "/search" ? <PiMagnifyingGlassFill /> : <PiMagnifyingGlass />}
          </Link>
        </div>
        <div className="navbar-item">
          <Link to="/chat">
            {pathName === "/chat" ? <PiChatCircleFill /> : <PiChatCircle />}
            {hasUnreadChat && <Badge className="badge" circle />}
          </Link>
        </div>
        <div className="navbar-item">
          <Link to="/profile">
            {pathName === "/profile" ? <PiUserFill /> : <PiUser />}
          </Link>
        </div>
        <div className="navbar-item">
          <Link to="/notification/all">
            {pathName === "/notification/all" ? <PiBellFill /> : <PiBell />}
            {hasPendingNotification && <Badge className="badge" circle />}
          </Link>
        </div>
        {children}
      </nav>
      <div className="navbar-item menu">
        <Menu />
      </div>
    </div>
  )
}

export default NavBar