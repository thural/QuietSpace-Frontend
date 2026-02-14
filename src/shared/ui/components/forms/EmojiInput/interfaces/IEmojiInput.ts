/**
 * EmojiInput Component Interfaces
 * 
 * Type definitions for the EmojiInput component with emoji support.
 */

import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";

export interface IEmojiInputProps extends GenericWrapperWithRef {
  isEnabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  fontSize?: number;
  onEnter?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  disabled?: boolean;
  theme?: any;
}
