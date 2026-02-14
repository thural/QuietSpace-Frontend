/**
 * UserDetails Component Interface
 * 
 * Defines the contract for the UserDetails component with enterprise-grade
 * layout functionality including theme integration and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { IBaseComponentProps } from '../../../../../components/base/BaseClassComponent';

/**
 * UserDetails component state interface
 */
export interface IUserDetailsState {
  /** Current size factor */
  size: number;
  /** Calculated font size */
  fontSize: string;
  /** Heading type */
  heading: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * UserDetails component props interface
 */
export interface IUserDetailsProps extends IBaseComponentProps {
  /** User data object */
  user?: {
    id?: string;
    username?: string;
    email?: string;
    name?: string;
  };
  /** Whether to display user email */
  isDisplayEmail?: boolean;
  /** Whether to display user name */
  isDisplayName?: boolean;
  /** Scale factor for text sizing */
  scale?: number;
}
