/**
 * FlexContainer Component Interface
 * 
 * Defines the contract for the FlexContainer component with enterprise-grade
 * flexbox functionality including direction, alignment, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode, RefObject } from 'react';
import { FlexProps, ComponentSize } from '../../../types';

/**
 * FlexContainer component props interface
 */
export interface IFlexContainerProps extends FlexProps {
  /** Flex direction */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  /** Flex wrap behavior */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Main axis alignment */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  /** Cross axis alignment */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  /** Gap between flex items */
  gap?: ComponentSize | string;
  /** Container padding */
  padding?: ComponentSize | string;
  /** Container margin */
  margin?: ComponentSize | string;
  /** Ref forwarded to container element */
  ref?: RefObject<HTMLDivElement>;
  /** Inline flex display */
  inline?: boolean;
  /** Flex grow factor */
  flexGrow?: number;
  /** Flex shrink factor */
  flexShrink?: number;
  /** Flex basis */
  flexBasis?: string | number;
  /** Align self */
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  /** Order */
  order?: number;
  /** Minimum height */
  minHeight?: string | number;
  /** Maximum height */
  maxHeight?: string | number;
  /** Custom CSS class */
  containerClassName?: string;
}
