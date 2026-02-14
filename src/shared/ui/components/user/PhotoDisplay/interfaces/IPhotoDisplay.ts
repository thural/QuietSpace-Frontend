/**
 * PhotoDisplay Component Interface
 * 
 * Defines contract for PhotoDisplay component with enterprise-grade
 * photo rendering functionality including base64 encoding and fallback states.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { ReactNode } from 'react';
import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Photo response interface for image data
 */
export interface IPhotoResponse {
  /** Photo name/identifier */
  name?: string;
  /** MIME type of the photo */
  type: string;
  /** Base64 encoded photo data */
  data: string;
}

/**
 * PhotoDisplay component props interface
 */
export interface IPhotoDisplayProps extends IBaseComponentProps {
  /** Photo response object containing image data */
  photoResponse?: IPhotoResponse | null;
}

/**
 * PhotoDisplay component internal state interface
 */
export interface IPhotoDisplayState extends IBaseComponentState {
  /** Processed photo data URL or null if unavailable */
  photoData: string | null;
}
