import { Badge } from "@mantine/core";
import BoxStyled from "@shared/BoxStyled";
import Conditional from "@shared/Conditional";
import NavStyled from "@shared/NavStyled";
import Typography from "@shared/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
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
import NavItem from "../components/base/NavItem";
import NavMenu from "../components/menu/NavMenu";
import styles from "./styles/navbarStyles";
import { PageContent } from "@/api/schemas/inferred/common";
import { Chat } from "@/api/schemas/inferred/chat";
import { NotificationPage } from "@/api/schemas/inferred/notification";




const NavBar = () => {

  const classes = styles();

  const queryClient = useQueryClient();
  const pathName = useLocation().pathname;
  const chats: PageContent<Chat> | undefined = queryClient.getQueryData(["chats"]);
  const user = queryClient.getQueryData(["user"]);
  const notifications: NotificationPage | undefined = queryClient.getQueryData(["notifications"]);


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
        <NavItem
          linkTo="/posts"
          pathName={pathName}
          icon={<PiHouse />}
          iconFill={<PiHouseFill />}
        />
        <NavItem
          linkTo="/search"
          pathName={pathName}
          icon={<PiMagnifyingGlass />}
          iconFill={<PiMagnifyingGlassFill />}
        />
        <NavItem
          linkTo="/chat"
          pathName={pathName}
          icon={<PiChatCircle />}
          iconFill={<PiChatCircleFill />}
        />
        <NavItem
          linkTo="/profile"
          pathName={pathName}
          icon={<PiUser />}
          iconFill={<PiUserFill />}
        />
        <NavItem
          linkTo="/notification/all"
          pathName={pathName}
          icon={<PiBell />}
          iconFill={<PiBellFill />}
        >
          <Conditional isEnabled={hasPendingNotification}>
            <Badge className="badge" circle />
          </Conditional>
        </NavItem>
      </NavStyled>
      <BoxStyled className="navbar-item menu"><NavMenu /></BoxStyled>
    </BoxStyled>
  )
}

export default NavBar