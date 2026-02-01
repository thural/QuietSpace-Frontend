/**
 * Search Input Component
 * 
 * A reusable search input component with debouncing, suggestions, and
 * real-time search capabilities. Provides flexible search functionality.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

// Import reusable components from shared UI
import { LoadingSpinner } from '@shared/ui/components';

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

/**
 * Search Input Component
 * 
 * Provides search functionality with:
 * - Debounced search input to prevent excessive API calls
 * - Dropdown suggestions with keyboard navigation
 * - Loading states and error handling
 * - Flexible callback support for search events
 * - Accessibility features and ARIA labels
 * - Configurable debounce timing and suggestion limits
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class SearchInput extends BaseClassComponent<ISearchInputProps, ISearchInputState> {
  private searchTimeout: number | null = null;
  private inputRef = React.createRef<HTMLInputElement>();

  protected override getInitialState(): Partial<ISearchInputState> {
    const { 
      showSuggestions = true,
      minQueryLength = 2,
      maxSuggestions = 10
    } = this.props;

    return {
      query: '',
      suggestions: [],
      isLoading: false,
      errorMessage: null,
      isDropdownOpen: false,
      selectedIndex: -1,
      showSuggestions
    };
  }

  protected override onMount(): void {
    super.onMount();
    if (this.props.autoFocus && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  protected override onUnmount(): void {
    super.onUnmount();
    this.clearSearchTimeout();
  }

  /**
   * Clear search timeout
   */
  private clearSearchTimeout = (): void => {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  };

  /**
   * Debounced search
   */
  private debouncedSearch = (query: string): void => {
    const { debounceMs = 300, minQueryLength = 2, onSearch } = this.props;

    this.clearSearchTimeout();

    if (query.length < minQueryLength) {
      this.safeSetState({
        suggestions: [],
        isDropdownOpen: false,
        isLoading: false
      });
      return;
    }

    if (!onSearch) {
      return;
    }

    this.safeSetState({ isLoading: true, errorMessage: null });

    this.searchTimeout = window.setTimeout(async () => {
      try {
        const suggestions = await onSearch(query);
        const { maxSuggestions = 10 } = this.props;

        this.safeSetState({
          suggestions: suggestions.slice(0, maxSuggestions),
          isLoading: false,
          isDropdownOpen: suggestions.length > 0 && this.state.showSuggestions
        });
      } catch (error) {
        this.safeSetState({
          suggestions: [],
          isLoading: false,
          errorMessage: 'Search failed. Please try again.',
          isDropdownOpen: false
        });
      }
    }, debounceMs);
  };

  /**
   * Handle input change
   */
  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value;

    this.safeSetState({
      query,
      selectedIndex: -1,
      errorMessage: null
    });

    if (this.props.onQueryChange) {
      this.props.onQueryChange(query);
    }

    this.debouncedSearch(query);
  };

  /**
   * Handle input focus
   */
  private handleInputFocus = (): void => {
    if (this.state.suggestions.length > 0 && this.state.showSuggestions) {
      this.safeSetState({ isDropdownOpen: true });
    }
  };

  /**
   * Handle input blur
   */
  private handleInputBlur = (): void => {
    // Delay closing dropdown to allow suggestion clicks
    setTimeout(() => {
      this.safeSetState({ isDropdownOpen: false });
    }, 150);
  };

  /**
   * Handle suggestion click
   */
  private handleSuggestionClick = (suggestion: ISearchSuggestion): void => {
    const { clearOnSelect = true, onSuggestionClick } = this.props;

    if (clearOnSelect) {
      this.safeSetState({
        query: '',
        suggestions: [],
        isDropdownOpen: false
      });
    } else {
      this.safeSetState({
        query: suggestion.text,
        isDropdownOpen: false
      });
    }

    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }

    if (this.inputRef.current) {
      this.inputRef.current.blur();
    }
  };

  /**
   * Handle key down events
   */
  private handleKeyDown = (e: React.KeyboardEvent): void => {
    const { selectedIndex, suggestions, isDropdownOpen } = this.state;

    if (!isDropdownOpen || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.safeSetState({
          selectedIndex: selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : 0
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.safeSetState({
          selectedIndex: selectedIndex > 0 ? selectedIndex - 1 : suggestions.length - 1
        });
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          this.handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.safeSetState({ isDropdownOpen: false });
        break;
    }
  };

  /**
   * Clear search
   */
  private clearSearch = (): void => {
    this.safeSetState({
      query: '',
      suggestions: [],
      isDropdownOpen: false,
      selectedIndex: -1,
      errorMessage: null
    });

    this.clearSearchTimeout();

    if (this.props.onQueryChange) {
      this.props.onQueryChange('');
    }

    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  /**
   * Get suggestion icon
   */
  private getSuggestionIcon = (type: ISearchSuggestion['type']): string => {
    const icons = {
      page: '📄',
      user: '👤',
      content: '📝',
      tag: '🏷️'
    };

    return icons[type] || '🔍';
  };

  /**
   * Render suggestions dropdown
   */
  private renderSuggestionsDropdown(): React.ReactNode {
    const { suggestions, isLoading, errorMessage, selectedIndex, isDropdownOpen } = this.state;

    if (!isDropdownOpen) {
      return null;
    }

    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-64 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner size="sm" color="primary" />
            <span className="ml-2 text-sm text-gray-600">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div className="px-4 py-3 text-sm text-red-600" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Suggestions */}
        {!isLoading && !errorMessage && suggestions.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No suggestions found
          </div>
        )}

        {!isLoading && !errorMessage && suggestions.length > 0 && (
          <ul role="listbox">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={selectedIndex === index}
                className={`px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                  selectedIndex === index
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => this.handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{this.getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {suggestion.text}
                    </div>
                    {suggestion.metadata && (
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.metadata.category || suggestion.type}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { 
      placeholder = 'Search...',
      disabled = false,
      className = ''
    } = this.props;

    const { query, isLoading } = this.state;

    return (
      <div className={`search-input relative ${className}`}>
        {/* Search Input */}
        <div className="relative">
          <input
            ref={this.inputRef}
            type="text"
            value={query}
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            onKeyDown={this.handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            }`}
            aria-label="Search"
            role="combobox"
            aria-expanded={this.state.isDropdownOpen}
            aria-autocomplete="list"
          />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" color="primary" />
            </div>
          )}

          {/* Clear Button */}
          {!isLoading && query && (
            <button
              onClick={this.clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}

          {/* Search Icon */}
          {!isLoading && !query && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {this.renderSuggestionsDropdown()}
      </div>
    );
  }
}

export default SearchInput;
