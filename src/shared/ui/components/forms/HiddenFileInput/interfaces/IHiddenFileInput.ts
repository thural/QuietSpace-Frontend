import { ChangeEvent, JSXElementConstructor } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

/**
 * HiddenFileInput component props interface
 */
export interface IHiddenFileInputProps extends GenericWrapper {
  /** File change event handler */
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Component to render as the visible trigger */
  Component: JSXElementConstructor<any>;
}

/**
 * HiddenFileInput component state interface
 */
export interface IHiddenFileInputState {
  /** Additional state if needed */
}
