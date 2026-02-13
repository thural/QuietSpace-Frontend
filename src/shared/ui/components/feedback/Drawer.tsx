/**
 * Drawer Component - Enterprise Feedback
 * 
 * A comprehensive drawer component with slide-out panels, multiple
 * positioning options, and enterprise-grade features. Follows enterprise
 * patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent, createRef } from 'react';

/**
 * Drawer component props interface
 */
export interface IDrawerProps {
  /** Drawer visibility */
  open?: boolean;
  /** Drawer title */
  title?: string;
  /** Drawer width */
  width?: number | string;
  /** Drawer height */
  height?: number | string;
  /** Drawer position */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** Drawer size */
  size?: 'small' | 'medium' | 'large';
  /** Component CSS class */
  className?: string;
  /** Component style */
  style?: React.CSSProperties;
  /** Show close button */
  closable?: boolean;
  /** Show overlay */
  showOverlay?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on ESC key */
  closeOnEsc?: boolean;
  /** Mask closable */
  maskClosable?: boolean;
  /** Z-index */
  zIndex?: number;
  /** Level (for nested drawers) */
  level?: number;
  /** Destroy on close */
  destroyOnClose?: boolean;
  /** Keyboard navigation */
  keyboard?: boolean;
  /** Focus lock */
  focusLock?: boolean;
  /** Scroll lock */
  scrollLock?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** After open handler */
  afterOpen?: () => void;
  /** After close handler */
  afterClose?: () => void;
  /** Children content */
  children?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Header content */
  header?: React.ReactNode;
  /** Extra content */
  extra?: React.ReactNode;
}

/**
 * Drawer state interface
 */
interface IDrawerState {
  isOpen: boolean;
  isVisible: boolean;
}

/**
 * Drawer Component
 * 
 * Enterprise-grade drawer component with slide-out panels, multiple positioning
 * options, and comprehensive accessibility features.
 */
export class Drawer extends PureComponent<IDrawerProps, IDrawerState> {
  static defaultProps: Partial<IDrawerProps> = {
    open: false,
    width: 280,
    height: 'auto',
    position: 'right',
    size: 'medium',
    closable: true,
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEsc: true,
    maskClosable: true,
    zIndex: 1000,
    level: 0,
    destroyOnClose: false,
    keyboard: true,
    focusLock: true,
    scrollLock: true,
  };

  private drawerRef = React.createRef<HTMLDivElement>();
  private overlayRef = React.createRef<HTMLDivElement>();
  private contentRef = React.createRef<HTMLDivElement>();
  private previousActiveElement: Element | null = null;

  constructor(props: IDrawerProps) {
    super(props);
    
    this.state = {
      isOpen: props.open || false,
      isVisible: false,
    };
  }

  /**
   * Handle drawer open
   */
  private handleOpen = () => {
    const { afterOpen, focusLock, scrollLock } = this.props;
    
    this.setState({ isOpen: true }, () => {
      // Focus management
      if (focusLock) {
        this.saveActiveElement();
        this.trapFocus();
      }
      
      // Scroll lock
      if (scrollLock) {
        this.disableBodyScroll();
      }
      
      if (afterOpen) {
        afterOpen();
      }
    });
  };

  /**
   * Handle drawer close
   */
  private handleClose = () => {
    const { onClose, afterClose, destroyOnClose, focusLock, scrollLock } = this.props;
    
    this.setState({ isOpen: false, isVisible: false }, () => {
      // Restore focus
      if (focusLock) {
        this.restoreActiveElement();
      }
      
      // Restore scroll
      if (scrollLock) {
        this.enableBodyScroll();
      }
      
      if (afterClose) {
        afterClose();
      }
      
      if (onClose) {
        onClose();
      }
      
      // Destroy component if requested
      if (destroyOnClose) {
        this.setState({ isOpen: false, isVisible: false });
      }
    });
  };

  /**
   * Save active element
   */
  private saveActiveElement = () => {
    this.previousActiveElement = document.activeElement;
  };

  /**
   * Restore active element
   */
  private restoreActiveElement = () => {
    if (this.previousActiveElement && typeof (this.previousActiveElement as any).focus === 'function') {
      (this.previousActiveElement as any).focus();
    }
  };

  /**
   * Trap focus within drawer
   */
  private trapFocus = () => {
    const drawerElement = this.drawerRef.current;
    if (!drawerElement) return;

    const focusableElements = drawerElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement && typeof firstElement.focus === 'function') {
        firstElement.focus();
      }
    }
  };

  /**
   * Disable body scroll
   */
  private disableBodyScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  /**
   * Enable body scroll
   */
  private enableBodyScroll = () => {
    document.body.style.overflow = '';
  };

  /**
   * Handle ESC key
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    const { closeOnEsc } = this.props;
    
    if (closeOnEsc && this.state.isOpen && event.key === 'Escape') {
      event.preventDefault();
      this.handleClose();
    }
  };

  /**
   * Handle overlay click
   */
  private handleOverlayClick = () => {
    const { closeOnOverlayClick } = this.props;
    
    if (closeOnOverlayClick) {
      this.handleClose();
    }
  };

  /**
   * Add event listeners
   */
  private addEventListeners = () => {
    const { keyboard } = this.props;
    
    if (keyboard) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  };

  /**
   * Remove event listeners
   */
  private removeEventListeners = () => {
    const { keyboard } = this.props;
    
    if (keyboard) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  };

  override componentDidMount() {
    if (this.props.open) {
      this.handleOpen();
    }
    this.addEventListeners();
  }

  override componentDidUpdate(prevProps: IDrawerProps) {
    const { open } = this.props;
    
    if (prevProps.open !== open) {
      if (open) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  }

  override componentWillUnmount() {
    this.removeEventListeners();
    this.enableBodyScroll();
  }

  render() {
    const {
      open,
      title,
      width,
      height,
      position,
      size,
      className,
      style,
      closable,
      showOverlay,
      maskClosable,
      zIndex,
      level,
      children,
      footer,
      header,
      extra,
    } = this.props;

    const { isOpen } = this.state;

    // Calculate transform based on position
    const getTransform = () => {
      switch (position) {
        case 'left':
          return `translateX(${isOpen ? 0 : '-100%'})`;
        case 'right':
          return `translateX(${isOpen ? 0 : '100%'})`;
        case 'top':
          return `translateY(${isOpen ? 0 : '-100%'})`;
        case 'bottom':
          return `translateY(${isOpen ? 0 : '100%'})`;
        default:
          return `translateX(${isOpen ? 0 : '100%'})`;
      }
    };

    // Calculate z-index based on level
    const getZIndex = () => {
      return (zIndex || 1000) + (level || 0) * 10;
    };

    // Calculate dimensions
    const drawerWidth = width || (size === 'small' ? 240 : size === 'large' ? 320 : 280);
    const drawerHeight = height || 'auto';

    return (
      <>
        {showOverlay && (
          <div
            ref={this.overlayRef}
            className={`drawer-overlay ${isOpen ? 'drawer-overlay-open' : ''}`}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: getZIndex(),
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? 'visible' : 'hidden',
              transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
            }}
            onClick={maskClosable ? this.handleOverlayClick : undefined}
            aria-hidden={!isOpen}
          />
        )}
        
        <div
          ref={this.drawerRef}
          className={`drawer drawer-${position} drawer-${size} ${className || ''} ${isOpen ? 'drawer-open' : ''}`}
          style={{
            position: 'fixed',
            [position]: 0,
            [position === 'left' || position === 'right' ? 'top' : 'left']: 0,
            [position === 'top' || position === 'bottom' ? 'left' : 'top']: 0,
            width: position === 'top' || position === 'bottom' ? '100%' : drawerWidth,
            height: position === 'left' || position === 'right' ? '100%' : drawerHeight,
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: getTransform(),
            zIndex: getZIndex(),
            transition: 'transform 0.3s ease-in-out, visibility 0.3s ease-in-out',
            visibility: isOpen ? 'visible' : 'hidden',
            overflow: 'auto',
            ...style,
          }}
          role="dialog"
          aria-modal={true}
          aria-labelledby={title ? 'drawer-title' : undefined}
          aria-describedby={children ? 'drawer-content' : undefined}
        >
          {(header || title) && (
            <div className="drawer-header">
              {header || (
                <div className="drawer-title" id="drawer-title">
                  {title}
                  {closable && (
                    <button
                      className="drawer-close"
                      onClick={this.handleClose}
                      aria-label="Close drawer"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="drawer-content" ref={this.contentRef}>
            {children}
          </div>
          
          {(footer || extra) && (
            <div className="drawer-footer">
              {footer}
              {extra}
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Drawer;
