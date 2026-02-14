import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Search Suggestion interface
 */
export interface ISearchSuggestion {
  id: string;
  text: string;
  type: 'page' | 'user' | 'content' | 'tag';
  url?: string;
  metadata?: any;
}

/**
 * Search Input Props
 */
export interface ISearchInputProps extends IBaseComponentProps {
  placeholder?: string;
  disabled?: boolean;
  debounceMs?: number;
  minQueryLength?: number;
  maxSuggestions?: number;
  onSearch?: (query: string) => Promise<ISearchSuggestion[]>;
  onSuggestionClick?: (suggestion: ISearchSuggestion) => void;
  onQueryChange?: (query: string) => void;
  className?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  clearOnSelect?: boolean;
  theme?: any;
}

/**
 * Search Input State
 */
export interface ISearchInputState extends IBaseComponentState {
  query: string;
  suggestions: ISearchSuggestion[];
  isLoading: boolean;
  errorMessage: string | null;
  isDropdownOpen: boolean;
  selectedIndex: number;
  showSuggestions: boolean;
}
