/**
 * Security Status Component Barrel Export
 * 
 * Clean public API for SecurityStatus component following
 * enterprise patterns with barrel exports.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

// Component exports
export { SecurityStatus, default } from './SecurityStatus';

// Interface exports
export type { ISecurityStatusProps, ISecurityStatusState } from './interfaces/ISecurityStatus';

// Style exports
export {
  securityStatusContainerStyles,
  headerStyles,
  statusItemStyles,
  statusLabelStyles,
  statusBadgeStyles,
  sessionExpiryStyles,
  expiryTimeStyles,
  expiryDateStyles,
  trustDeviceButtonStyles,
  expiryWarningStyles,
  responsiveStyles
} from './styles/SecurityStatus.styles';
