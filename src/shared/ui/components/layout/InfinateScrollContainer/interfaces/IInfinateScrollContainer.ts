/**
 * InfinateScrollContainer Component Interface
 * 
 * Defines contract for InfinateScrollContainer component with enterprise-grade
 * infinite scrolling functionality including pagination, loading states, and
 * scroll event handling.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { BaseComponentProps } from '../../../types';

/**
 * InfinateScrollContainer component props interface
 */
export interface IInfinateScrollContainerProps extends BaseComponentProps {
  /** Indicates whether there are more pages to fetch */
  hasNextPage: boolean;
  /** Indicates if a fetch operation for next page is currently in progress */
  isFetchingNextPage: boolean;
  /** Function to be called to fetch next page of data */
  fetchNextPage: () => void;
  /** Content to render inside the scroll container */
  children?: ReactNode;
}

/**
 * InfinateScrollContainer component state interface
 */
export interface IInfinateScrollContainerState {
  /** Tracks whether the scroll trigger element has been seen */
  wasSeen: boolean;
}
