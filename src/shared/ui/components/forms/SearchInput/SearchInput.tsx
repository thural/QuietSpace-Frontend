import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { LoadingSpinner } from '@shared/ui/components';
import { ISearchInputProps, ISearchInputState, ISearchSuggestion } from './interfaces';
import {
  SearchInputContainer,
  SearchInputField,
  SuggestionsDropdown,
  SuggestionItem,
  LoadingContainer
} from './styles';

/**
 * Enterprise SearchInput Component
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
        if (selectedIndex >= 0 && selectedIndex < suggestions.length && suggestions[selectedIndex]) {
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
  private renderSuggestionsDropdown = (theme: any): React.ReactNode => {
    const { suggestions, isLoading, errorMessage, selectedIndex, isDropdownOpen } = this.state;

    if (!isDropdownOpen) {
      return null;
    }

    return (
      <div css={SuggestionsDropdown(theme)}>
        {/* Loading State */}
        {isLoading && (
          <div css={LoadingContainer(theme)}>
            <LoadingSpinner size="sm" color="primary" />
            <span style={{ marginLeft: '8px', fontSize: '14px', color: theme?.colors?.text?.secondary }}>
              Searching...
            </span>
          </div>
        )}

        {/* Error State */}
        {errorMessage && (
          <div
            role="alert"
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              color: theme?.colors?.semantic?.error
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Suggestions */}
        {!isLoading && !errorMessage && suggestions.length === 0 && (
          <div style={{
            padding: '12px 16px',
            fontSize: '14px',
            color: theme?.colors?.text?.tertiary,
            textAlign: 'center'
          }}>
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
                css={SuggestionItem(theme, selectedIndex === index)}
                onClick={() => this.handleSuggestionClick(suggestion)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px' }}>
                    {this.getSuggestionIcon(suggestion.type)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: theme?.colors?.text?.primary
                    }}>
                      {suggestion.text}
                    </div>
                    {suggestion.metadata && (
                      <div style={{
                        fontSize: '12px',
                        color: theme?.colors?.text?.tertiary,
                        marginTop: '4px'
                      }}>
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
      className = '',
      theme
    } = this.props;

    const { query, isLoading } = this.state;

    return (
      <div css={SearchInputContainer(theme)} className={className}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            ref={this.inputRef}
            css={SearchInputField(theme)}
            type="text"
            value={query}
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            onKeyDown={this.handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            aria-label="Search"
            role="combobox"
            aria-expanded={this.state.isDropdownOpen}
            aria-autocomplete="list"
          />

          {/* Loading Indicator */}
          {isLoading && (
            <div css={LoadingContainer(theme)}>
              <LoadingSpinner size="sm" color="primary" />
            </div>
          )}

          {/* Clear Button */}
          {!isLoading && query && (
            <button
              onClick={this.clearSearch}
              css={LoadingContainer(theme)}
              aria-label="Clear search"
              style={{ cursor: 'pointer', color: theme?.colors?.text?.tertiary }}
            >
              ✕
            </button>
          )}

          {/* Search Icon */}
          {!isLoading && !query && (
            <div css={LoadingContainer(theme)}>
              🔍
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {this.renderSuggestionsDropdown(theme)}
      </div>
    );
  }
}

export default SearchInput;
