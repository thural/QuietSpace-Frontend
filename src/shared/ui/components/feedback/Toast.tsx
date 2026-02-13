/**
 * Toast Component - Enterprise Feedback
 * 
 * A comprehensive toast notification component with multiple types,
 * positioning options, and enterprise-grade features. Follows enterprise
 * patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent, createRef, RefObject } from 'react';

/**
 * Toast item interface
 */
export interface IToastItem {
  /** Toast unique key */
  key: string;
  /** Toast type */
  type: 'success' | 'error' | 'warning' | 'info';
  /** Toast title */
  title?: string;
  /** Toast message */
  message: string;
  /** Toast duration in milliseconds */
  duration?: number;
  /** Show close button */
  closable?: boolean;
  /** Show progress bar */
  showProgress?: boolean;
  /** Toast icon */
  icon?: React.ReactNode;
  /** Custom render function */
  render?: (item: IToastItem) => React.ReactNode;
  /** Click handler */
  onClick?: (item: IToastItem) => void;
  /** Close handler */
  onClose?: (item: IToastItem) => void;
}

/**
 * Toast component props interface
 */
export interface IToastProps {
  /** Toast items */
  items?: IToastItem[];
  /** Container position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  /** Maximum number of toasts to show */
  maxCount?: number;
  /** Component size */
  size?: 'small' | 'medium' | 'large';
  /** Component CSS class */
  className?: string;
  /** Component style */
  style?: React.CSSProperties;
  /** Auto-dismiss toasts */
  autoDismiss?: boolean;
  /** Default duration */
  defaultDuration?: number;
  /** Show icons */
  showIcons?: boolean;
  /** Enable sounds */
  enableSounds?: boolean;
  /** Pause on hover */
  pauseOnHover?: boolean;
  /** Click handler */
  onClick?: (item: IToastItem) => void;
  /** Toast add handler */
  onAdd?: (item: IToastItem) => void;
  /** Toast remove handler */
  onRemove?: (key: string) => void;
  /** Toast clear handler */
  onClear?: () => void;
}

/**
 * Toast state interface
 */
interface IToastState {
  items: IToastItem[];
  pausedItems: Set<string>;
}

/**
 * Toast Component
 * 
 * Enterprise-grade toast notification component with multiple positioning
 * options, auto-dismiss functionality, and comprehensive accessibility features.
 */
export class Toast extends PureComponent<IToastProps, IToastState> {
  static defaultProps: Partial<IToastProps> = {
    position: 'top-right',
    maxCount: 5,
    size: 'medium',
    autoDismiss: true,
    defaultDuration: 5000,
    showIcons: true,
    enableSounds: false,
    pauseOnHover: true,
  };

  private containerRef: RefObject<HTMLDivElement | null>;
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(props: IToastProps) {
    super(props);
    
    this.state = {
      items: props.items || [],
      pausedItems: new Set(),
    };

    this.containerRef = createRef();
  }

  /**
   * Add toast item
   */
  private addToast = (item: IToastItem) => {
    const { maxCount, onAdd } = this.props;
    
    this.setState(prevState => {
      const newItems = [...prevState.items];
      
      // Remove oldest item if max count exceeded
      const maxCountValue = maxCount || 5;
      if (newItems.length >= maxCountValue) {
        newItems.shift();
      }
      
      newItems.push(item);
      
      return { items: newItems };
    }, () => {
      if (onAdd) {
        onAdd(item);
      }
      
      // Auto-dismiss if enabled
      if (this.props.autoDismiss) {
        this.scheduleDismiss(item);
      }
    });
  };

  /**
   * Remove toast item
   */
  private removeToast = (key: string) => {
    const { onRemove } = this.props;
    
    this.setState(prevState => ({
      items: prevState.items.filter(item => item.key !== key)
    }), () => {
      // Clear timeout
      if (this.timeouts.has(key)) {
        clearTimeout(this.timeouts.get(key));
        this.timeouts.delete(key);
      }
      
      if (onRemove) {
        onRemove(key);
      }
    });
  };

  /**
   * Clear all toasts
   */
  private clearToasts = () => {
    const { onClear } = this.props;
    
    // Clear all timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    
    this.setState({ items: [] }, () => {
      if (onClear) {
        onClear();
      }
    });
  };

  /**
   * Schedule toast dismissal
   */
  private scheduleDismiss = (item: IToastItem) => {
    const duration = item.duration || this.props.defaultDuration || 5000;
    
    const timeout = setTimeout(() => {
      this.removeToast(item.key);
    }, duration);
    
    this.timeouts.set(item.key, timeout);
  };

  /**
   * Handle toast click
   */
  private handleToastClick = (item: IToastItem) => {
    const { onClick } = this.props;
    
    if (onClick) {
      onClick(item);
    }
  };

  /**
   * Handle toast close
   */
  private handleToastClose = (item: IToastItem, event: React.MouseEvent) => {
    event.stopPropagation();
    this.removeToast(item.key);
    
    if (item.onClose) {
      item.onClose(item);
    }
  };

  /**
   * Handle mouse enter
   */
  private handleMouseEnter = (item: IToastItem) => {
    if (this.props.pauseOnHover) {
      this.setState(prevState => ({
        pausedItems: new Set([...prevState.pausedItems, item.key])
      }));
      
      // Pause timeout
      if (this.timeouts.has(item.key)) {
        clearTimeout(this.timeouts.get(item.key));
        this.timeouts.delete(item.key);
      }
    }
  };

  /**
   * Handle mouse leave
   */
  private handleMouseLeave = (item: IToastItem) => {
    if (this.props.pauseOnHover) {
      this.setState(prevState => {
        const newPausedItems = new Set(prevState.pausedItems);
        newPausedItems.delete(item.key);
        return { pausedItems: newPausedItems };
      }, () => {
        // Resume timeout if not paused
        if (!this.state.pausedItems.has(item.key) && this.props.autoDismiss) {
          this.scheduleDismiss(item);
        }
      });
    }
  };

  /**
   * Get toast icon
   */
  private getToastIcon = (type: string) => {
    const icons: Record<string, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    
    return icons[type] || 'ℹ';
  };

  /**
   * Render toast item
   */
  private renderToast = (item: IToastItem) => {
    const { size, showIcons } = this.props;
    const { pausedItems } = this.state;
    const isPaused = pausedItems.has(item.key);

    // Custom render function
    if (item.render) {
      return (
        <div key={item.key} className={`toast toast-${item.type} toast-${size}`}>
          {item.render(item)}
        </div>
      );
    }

    // Default rendering
    return (
      <div
        key={item.key}
        className={`toast toast-${item.type} toast-${size} ${isPaused ? 'toast-paused' : ''}`}
        onClick={() => this.handleToastClick(item)}
        onMouseEnter={() => this.handleMouseEnter(item)}
        onMouseLeave={() => this.handleMouseLeave(item)}
      >
        <div className="toast-content">
          {showIcons && (
            <div className="toast-icon">
              {item.icon || this.getToastIcon(item.type)}
            </div>
          )}
          
          <div className="toast-body">
            {item.title && (
              <div className="toast-title">{item.title}</div>
            )}
            <div className="toast-message">{item.message}</div>
          </div>
          
          {item.closable && (
            <button
              className="toast-close"
              onClick={(e) => this.handleToastClose(item, e)}
              aria-label="Close notification"
            >
              ×
            </button>
          )}
        </div>
        
        {item.showProgress && (
          <div className="toast-progress">
            <div className="toast-progress-bar" />
          </div>
        )}
      </div>
    );
  };

  /**
   * Public API methods
   */
  success = (message: string, options?: Partial<IToastItem>) => {
    this.addToast({
      key: Date.now().toString(),
      type: 'success',
      message,
      ...options,
    });
  };

  error = (message: string, options?: Partial<IToastItem>) => {
    this.addToast({
      key: Date.now().toString(),
      type: 'error',
      message,
      duration: 8000, // Longer duration for errors
      ...options,
    });
  };

  warning = (message: string, options?: Partial<IToastItem>) => {
    this.addToast({
      key: Date.now().toString(),
      type: 'warning',
      message,
      ...options,
    });
  };

  info = (message: string, options?: Partial<IToastItem>) => {
    this.addToast({
      key: Date.now().toString(),
      type: 'info',
      message,
      ...options,
    });
  };

  clear = () => {
    this.clearToasts();
  };

  override componentDidMount() {
    // Schedule dismiss for existing items
    if (this.props.autoDismiss) {
      this.state.items.forEach(item => {
        this.scheduleDismiss(item);
      });
    }
  }

  override componentDidUpdate(prevProps: IToastProps) {
    // Handle new items
    const maxCount = this.props.maxCount || 5;
    const newItems = this.props.items?.filter(item => 
      !prevProps.items?.some(prevItem => prevItem.key === item.key)
    ) || [];

    newItems.forEach(item => {
      this.addToast(item);
    });
  }

  override componentWillUnmount() {
    // Clear all timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }

  render() {
    const {
      position,
      className,
      style,
    } = this.props;

    const positionClasses: Record<string, string> = {
      'top-right': 'toast-container-top-right',
      'top-left': 'toast-container-top-left',
      'bottom-right': 'toast-container-bottom-right',
      'bottom-left': 'toast-container-bottom-left',
      'top-center': 'toast-container-top-center',
      'bottom-center': 'toast-container-bottom-center',
    };

    return (
      <div
        ref={this.containerRef}
        className={`toast-container ${positionClasses[position]} ${className || ''}`}
        style={style}
        aria-live="polite"
        aria-atomic="true"
      >
        {this.state.items.map(item => this.renderToast(item))}
      </div>
    );
  }
}

export default Toast;
