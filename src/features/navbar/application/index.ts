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
} from "./useNavbar";
