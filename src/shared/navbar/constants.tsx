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

/**
 * Icon configuration constants for the navbar.
 * Centralizes icon definitions to avoid duplication.
 */
export const NAVBAR_ICONS = {
  PiHouse: <PiHouse />,
  PiHouseFill: <PiHouseFill />,
  PiMagnifyingGlass: <PiMagnifyingGlass />,
  PiMagnifyingGlassFill: <PiMagnifyingGlassFill />,
  PiChatCircle: <PiChatCircle />,
  PiChatCircleFill: <PiChatCircleFill />,
  PiUser: <PiUser />,
  PiUserFill: <PiUserFill />,
  PiBell: <PiBell />,
  PiBellFill: <PiBellFill />
} as const;

/**
 * Navigation route constants.
 * Centralizes route definitions to avoid magic strings.
 */
export const NAVBAR_ROUTES = {
  FEED: "/feed",
  SEARCH: "/search",
  CHAT: "/chat",
  PROFILE: "/profile",
  NOTIFICATIONS: "/notification/all"
} as const;
