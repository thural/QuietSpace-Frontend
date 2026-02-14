/**
 * Result Item Component Interfaces
 * 
 * Type definitions for the Result Item component with various types and variants.
 */

import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Result Item Type
 */
export type ResultItemType = 'user' | 'post' | 'content' | 'page' | 'file' | 'generic';

/**
 * Result Item Props
 */
export interface IResultItemProps extends IBaseComponentProps {
  id: string;
  type: ResultItemType;
  title: string;
  description?: string;
  content?: string;
  author?: {
    name: string;
    username?: string;
    avatar?: string;
  };
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    category?: string;
    tags?: string[];
    size?: string;
    views?: number;
    likes?: number;
    comments?: number;
    [key: string]: any;
  };
  thumbnail?: string;
  url?: string;
  onClick?: (item: IResultItemProps) => void;
  variant?: 'default' | 'compact' | 'detailed' | 'card';
  showThumbnail?: boolean;
  showAuthor?: boolean;
  showMetadata?: boolean;
  className?: string;
}

/**
 * Result Item State
 */
export interface IResultItemState extends IBaseComponentState {
  isHovered: boolean;
  isFocused: boolean;
}
