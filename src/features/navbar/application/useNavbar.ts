import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useNotificationData } from "../data";
import type { NotificationStatusEntity } from "../domain";
import { NAVBAR_ROUTES } from "../shared";

/**
 * Icon configuration for navigation items.
 */
export interface NavigationIconConfig {
  icon: string;
  iconFill: string;
}

/**
 * Navigation configuration without JSX elements.
 */
export interface NavigationConfig {
  linkTo: string;
  pathName: string;
  icons: NavigationIconConfig;
}

/**
 * Custom hook for managing navbar state and behavior.
 * 
 * This hook orchestrates the navbar functionality by:
 * - Managing navigation items and their active states
 * - Coordinating notification and chat status
 * - Handling error states for data fetching
 * 
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   navigationItems: NavigationItems,
 *   error: Error | null
 * }} - Navbar state and navigation configuration
 */
export const useNavbar = () => {
  const pathName = useLocation().pathname;
  const { notificationData, error } = useNotificationData();

  /**
   * Creates navigation items with current path state
   */
  const navigationItems = useMemo(() => {
    const mainItems: NavigationConfig[] = [
      {
        linkTo: NAVBAR_ROUTES.FEED,
        pathName,
        icons: { icon: "PiHouse", iconFill: "PiHouseFill" }
      },
      {
        linkTo: NAVBAR_ROUTES.SEARCH,
        pathName,
        icons: { icon: "PiMagnifyingGlass", iconFill: "PiMagnifyingGlassFill" }
      }
    ];

    const chat: NavigationConfig = {
      linkTo: NAVBAR_ROUTES.CHAT,
      pathName,
      icons: { icon: "PiChatCircle", iconFill: "PiChatCircleFill" }
    };

    const profile: NavigationConfig = {
      linkTo: NAVBAR_ROUTES.PROFILE,
      pathName,
      icons: { icon: "PiUser", iconFill: "PiUserFill" }
    };

    const notification: NavigationConfig = {
      linkTo: NAVBAR_ROUTES.NOTIFICATIONS,
      pathName,
      icons: { icon: "PiBell", iconFill: "PiBellFill" }
    };

    return {
      mainItems,
      chat,
      profile,
      notification
    };
  }, [pathName]);

  return {
    notificationData,
    navigationItems,
    error
  };
};

export type NavigationItems = {
  mainItems: NavigationConfig[];
  chat: NavigationConfig;
  profile: NavigationConfig;
  notification: NavigationConfig;
};
