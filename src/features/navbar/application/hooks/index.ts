/**
 * Application Hooks Barrel Exports.
 */

// Enterprise Navbar Hook (recommended)
export { useEnterpriseNavbar, type EnterpriseNavbarState, type EnterpriseNavbarActions } from './useEnterpriseNavbar';

// Legacy Navbar Hooks (for backward compatibility)
export { 
  useNavbar, 
  useNavbarEnhanced, 
  useNavbarAdvanced,
  type NavbarConfig,
  type NavigationIconConfig,
  type NavigationConfig,
  type NavigationItems
} from './useNavbar';

// Enterprise Services Hook
export { useNavbarServices } from './useNavbarServices';
