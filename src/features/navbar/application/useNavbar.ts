import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useNotificationData, useNotificationDataWithRepo } from "../data";
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
 * Configuration for navbar behavior.
 */
export interface NavbarConfig {
  /** Whether to use repository pattern */
  useRepositoryPattern?: boolean;
  /** Repository configuration for dependency injection */
  repositoryConfig?: {
    useMockRepositories?: boolean;
    mockConfig?: {
      hasPendingNotifications?: boolean;
      hasUnreadChats?: boolean;
      simulateLoading?: boolean;
      simulateError?: boolean;
    };
  };
}

/**
 * Custom hook for managing navbar state and behavior.
 * 
 * This hook orchestrates the navbar functionality by:
 * - Managing navigation items and their active states
 * - Coordinating notification and chat status
 * - Handling error states for data fetching
 * - Supporting both legacy and repository pattern implementations
 * 
 * @param {NavbarConfig} config - Optional configuration for navbar behavior
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   navigationItems: NavigationItems,
 *   error: Error | null,
 *   repository?: any
 * }} - Navbar state and navigation configuration
 */
export const useNavbar = (config: NavbarConfig = {}) => {
  const pathName = useLocation().pathname;
  
  // Choose data hook based on configuration
  const { useRepositoryPattern = false, repositoryConfig } = config;
  
  let notificationData, error, repository;
  
  if (useRepositoryPattern) {
    // Use enhanced repository pattern hook
    const result = useNotificationDataWithRepo(repositoryConfig);
    notificationData = result.notificationData;
    error = result.error;
    repository = result.repository;
  } else {
    // Use legacy hook for backward compatibility
    const result = useNotificationData();
    notificationData = result.notificationData;
    error = result.error;
    repository = undefined;
  }

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
    error,
    repository // Optional repository access for testing
  };
};

/**
 * Enhanced navbar hook that always uses repository pattern.
 * 
 * This hook provides the full benefits of the repository pattern
 * while maintaining React Query reactivity.
 * 
 * @param {NavbarConfig['repositoryConfig']} repositoryConfig - Repository configuration
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   navigationItems: NavigationItems,
 *   error: Error | null,
 *   repository: any
 * }} - Enhanced navbar state with repository access
 */
export const useNavbarEnhanced = (repositoryConfig?: NavbarConfig['repositoryConfig']) => {
  return useNavbar({ 
    useRepositoryPattern: true, 
    repositoryConfig 
  });
};

/**
 * Legacy navbar hook for backward compatibility.
 * 
 * @deprecated Use useNavbar with configuration or useNavbarEnhanced for repository pattern
 * @returns {{
 *   notificationData: NotificationStatusEntity,
 *   navigationItems: NavigationItems,
 *   error: Error | null
 * }} - Legacy navbar state
 */
export const useNavbarLegacy = () => {
  return useNavbar({ useRepositoryPattern: false });
};

export type NavigationItems = {
  mainItems: NavigationConfig[];
  chat: NavigationConfig;
  profile: NavigationConfig;
  notification: NavigationConfig;
};
