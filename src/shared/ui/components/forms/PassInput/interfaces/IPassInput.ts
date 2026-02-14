/**
 * PassInput Component Interfaces
 * 
 * Type definitions for the PassInput password input component.
 */

import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { ChangeEvent } from 'react';

export interface IPassInputProps extends GenericWrapper {
  name?: string;
  value?: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  theme?: any;
}
