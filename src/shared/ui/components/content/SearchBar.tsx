/**
 * SearchBar Component - Enterprise Search Input
 * 
 * A reusable search bar component extracted from search feature implementations.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';
import { GenericWrapper } from '../../types/sharedComponentTypes';

/**
 * Search bar component props interface
 */
export interface ISearchBarProps extends GenericWrapper {
  /** Search input placeholder */
  placeholder?: string;
  /** Current search value */
  value?: string;
  /** Search input change handler */
  onChange?: (value: string) => void;
  /** Search submit handler */
  onSearch?: (value: string) => void;
  /** Clear search handler */
  onClear?: () => void;
  /** Whether to show clear button */
  showClear?: boolean;
  /** Whether to show search icon */
  showIcon?: boolean;
  /** Whether to show microphone button */
  showMicrophone?: boolean;
  /** Microphone click handler */
  onMicrophone?: () => void;
  /** Search variant */
  variant?: 'default' | 'secondary' | 'minimal';
  /** Search size */
  size?: 'small' | 'medium' | 'large';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Search bar component state interface
 */
interface ISearchBarState {
  isFocused: boolean;
  internalValue: string;
  isListening: boolean;
}

/**
 * SearchBar Component
 * 
 * Enterprise-grade search bar component with theme integration,
 * accessibility features, and performance optimization.
 */
export class SearchBar extends PureComponent<ISearchBarProps, ISearchBarState> {
  private inputRef = React.createRef<HTMLInputElement>();

  static defaultProps: Partial<ISearchBarProps> = {
    placeholder: 'Search...',
    value: '',
    showClear: true,
    showIcon: true,
    showMicrophone: false,
    variant: 'default',
    size: 'medium',
    disabled: false,
    loading: false,
  };

  constructor(props: ISearchBarProps) {
    super(props);
    
    this.state = {
      isFocused: false,
      internalValue: props.value || '',
      isListening: false,
    };
  }

  /**
   * Update internal value when prop changes
   */
  componentDidUpdate(prevProps: ISearchBarProps): void {
    if (prevProps.value !== this.props.value) {
      this.setState({ internalValue: this.props.value || '' });
    }
  }

  /**
   * Handle input focus
   */
  private handleFocus = (): void => {
    this.setState({ isFocused: true });
  };

  /**
   * Handle input blur
   */
  private handleBlur = (): void => {
    this.setState({ isFocused: false });
  };

  /**
   * Handle input change
   */
  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    const { onChange } = this.props;
    
    this.setState({ internalValue: value });
    
    if (onChange) {
      onChange(value);
    }
  };

  /**
   * Handle key press
   */
  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  };

  /**
   * Handle search submit
   */
  private handleSearch = (): void => {
    const { onSearch } = this.props;
    const { internalValue } = this.state;
    
    if (onSearch) {
      onSearch(internalValue);
    }
  };

  /**
   * Handle clear search
   */
  private handleClear = (): void => {
    const { onClear, onChange } = this.props;
    
    this.setState({ internalValue: '' });
    
    if (onClear) {
      onClear();
    }
    
    if (onChange) {
      onChange('');
    }

    // Focus input after clear
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  /**
   * Handle microphone click
   */
  private handleMicrophoneClick = (): void => {
    const { onMicrophone } = this.props;
    const { isListening } = this.state;
    
    this.setState(prevState => ({ isListening: !prevState.isListening }));
    
    if (onMicrophone) {
      onMicrophone();
    }
  };

  /**
   * Get container classes
   */
  private getContainerClasses = (): string => {
    const { variant, size, disabled, className } = this.props;
    const { isFocused } = this.state;
    
    return [
      'search-bar',
      `search-bar--${variant}`,
      `search-bar--${size}`,
      isFocused ? 'search-bar--focused' : '',
      disabled ? 'search-bar--disabled' : '',
      className || '',
    ].filter(Boolean).join(' ');
  };

  /**
   * Render search icon
   */
  private renderSearchIcon = (): React.ReactNode => {
    const { showIcon, loading } = this.props;

    if (!showIcon) return null;

    return (
      <span className="search-bar__icon">
        {loading ? '⏳' : '🔍'}
      </span>
    );
  };

  /**
   * render clear button
   */
  private renderClearButton = (): React.ReactNode => {
    const { showClear, disabled } = this.props;
    const { internalValue } = this.state;

    if (!showClear || !internalValue || disabled) return null;

    return (
      <button 
        className="search-bar__clear"
        onClick={this.handleClear}
        aria-label="Clear search"
        type="button"
      >
        ✕
      </button>
    );
  };

  /**
   * Render microphone button
   */
  private renderMicrophoneButton = (): React.ReactNode => {
    const { showMicrophone, disabled } = this.props;
    const { isListening } = this.state;

    if (!showMicrophone || disabled) return null;

    return (
      <button 
        className={`search-bar__microphone ${isListening ? 'listening' : ''}`}
        onClick={this.handleMicrophoneClick}
        aria-label={isListening ? 'Stop listening' : 'Start voice search'}
        type="button"
      >
        🎤
      </button>
    );
  };

  /**
   * Render main component
   */
  public override render(): React.ReactNode {
    const { placeholder, disabled, style } = this.props;
    const { internalValue } = this.state;

    return (
      <div 
        className={this.getContainerClasses()}
        style={style}
        role="search"
        aria-label="Search"
      >
        {this.renderSearchIcon()}
        <input
          ref={this.inputRef}
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={internalValue}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyPress={this.handleKeyPress}
          disabled={disabled}
          aria-label="Search input"
        />
        {this.renderClearButton()}
        {this.renderMicrophoneButton()}
      </div>
    );
  }
}

export default SearchBar;
