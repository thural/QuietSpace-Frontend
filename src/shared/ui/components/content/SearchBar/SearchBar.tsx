/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { searchBarContainerStyles } from './styles';
import { ISearchBarProps, ISearchBarState } from './interfaces';

/**
 * Enterprise SearchBar Component
 * 
 * A reusable search bar component extracted from search feature implementations.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @example
 * ```tsx
 * <SearchBar 
 *   placeholder="Search..."
 *   value={searchValue}
 *   onChange={setSearchValue}
 *   onSearch={handleSearch}
 *   showClear={true}
 *   variant="default"
 * />
 * ```
 */
export class SearchBar extends BaseClassComponent<ISearchBarProps, ISearchBarState> {
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

  protected override getInitialState(): Partial<ISearchBarState> {
    return {
      isFocused: false,
      internalValue: this.props.value || '',
      isListening: false
    };
  }

  /**
   * Handle input focus
   */
  private handleFocus = (): void => {
    this.safeSetState({ isFocused: true });
  };

  /**
   * Handle input blur
   */
  private handleBlur = (): void => {
    this.safeSetState({ isFocused: false });
  };

  /**
   * Handle input change
   */
  private handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { onChange } = this.props;
    const value = e.target.value;
    
    this.safeSetState({ internalValue: value });
    onChange?.(value);
  };

  /**
   * Handle search submit
   */
  private handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const { onSearch } = this.props;
    const { internalValue } = this.state;
    
    onSearch?.(internalValue);
  };

  /**
   * Handle clear search
   */
  private handleClear = (): void => {
    const { onClear, onChange } = this.props;
    
    this.safeSetState({ internalValue: '' });
    onChange?.('');
    onClear?.();
  };

  /**
   * Handle microphone toggle
   */
  private handleMicrophone = (): void => {
    const { onMicrophone } = this.props;
    
    this.safeSetState(prev => ({ isListening: !prev.isListening }));
    onMicrophone?.();
  };

  /**
   * Get input padding based on visible elements
   */
  private getInputPadding = (): string => {
    const { showIcon, showClear, showMicrophone, variant } = this.props;
    const { isListening } = this.state;
    
    if (variant === 'minimal') {
      return '2rem';
    }
    
    let padding = '1rem';
    if (showIcon) padding = '2.5rem';
    if (showClear || showMicrophone) padding = '3.5rem';
    if (showClear && showMicrophone) padding = '4.5rem';
    
    return padding;
  };

  protected override renderContent(): React.ReactNode {
    const {
      placeholder,
      disabled,
      loading,
      showClear,
      showIcon,
      showMicrophone,
      variant = 'default',
      size = 'medium',
      className,
      testId,
      id,
      onClick,
      style
    } = this.props;
    const { internalValue, isFocused, isListening } = this.state;

    const showClearButton = showClear && internalValue.length > 0 && !loading;
    const showMicrophoneButton = showMicrophone && !loading;

    return (
      <div 
        css={searchBarContainerStyles}
        className={`search-bar ${variant} ${size} ${className || ''}`}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        {showIcon && (
          <span className="search-icon">🔍</span>
        )}
        
        <form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
          <input
            ref={this.inputRef}
            type="text"
            value={internalValue}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className="search-input"
            style={{ paddingLeft: this.getInputPadding() }}
          />
        </form>

        {loading && (
          <div className="loading-spinner" />
        )}

        {showMicrophoneButton && (
          <button
            type="button"
            onClick={this.handleMicrophone}
            className={`microphone-button ${isListening ? 'listening' : ''}`}
            aria-label={isListening ? 'Stop listening' : 'Start voice search'}
          >
            🎤
          </button>
        )}

        {showClearButton && (
          <button
            type="button"
            onClick={this.handleClear}
            className="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
}
