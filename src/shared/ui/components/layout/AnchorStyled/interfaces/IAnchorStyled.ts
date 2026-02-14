/**
 * AnchorStyled Component Props Interface
 * 
 * Defines the contract for the AnchorStyled component which provides
 * enterprise-grade anchor/link functionality with theme integration.
 * 
 * @interface IAnchorStyledProps
 */

import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";

/**
 * Props interface for AnchorStyled component
 */
export interface IAnchorStyledProps extends GenericWrapperWithRef {
  /** URL for the anchor link */
  href?: string;
  
  /** Target attribute for the link */
  target?: string;
  
  /** Label text for the anchor */
  label?: string;
  
  /** Theme object for styling */
  theme?: any;
}
