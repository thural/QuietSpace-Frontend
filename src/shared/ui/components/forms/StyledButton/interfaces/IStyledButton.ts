import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * StyledButton component props interface
 */
export interface IStyledButtonProps extends GenericWrapper {
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class name */
  className?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Whether button is disabled */
  disabled?: boolean;
  /** Button content */
  children?: React.ReactNode;
}

/**
 * StyledButton component state interface
 */
export interface IStyledButtonState {
  /** Additional state if needed */
}
