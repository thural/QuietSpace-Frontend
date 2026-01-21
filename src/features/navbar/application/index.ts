/**
 * Application layer barrel exports.
 * Provides a clean public API for the application layer.
 */

// Enhanced hooks with repository pattern support
export {
  useNavbar,
  useNavbarEnhanced,
  useNavbarAdvanced,
  type NavbarConfig,
  type NavigationIconConfig,
  type NavigationConfig,
  type NavigationItems
} from "./hooks/useNavbar";

// Navbar specific hooks
export { default as useNavMenu } from './hooks/useNavMenu';
export { default as useNotification } from './hooks/useNotification';
