/**
 * EmojiText Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';

/**
 * EmojiText Props
 */
export interface IEmojiTextProps extends IBaseComponentProps {
  text: string;
}

/**
 * EmojiText State
 */
export interface IEmojiTextState extends IBaseComponentState {
  // No additional state needed for this component
}
