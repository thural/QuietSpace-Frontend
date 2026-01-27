import 'reflect-metadata';
import * as React from 'react';
import { Injectable, useService } from '../../../core/di';

// Base component interfaces
interface IBaseComponent {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface IButton extends IBaseComponent {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

interface IInput extends IBaseComponent {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string | { message: string };
  label?: string;
  required?: boolean;
}

interface ICard extends IBaseComponent {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

interface IModal extends IBaseComponent {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
}

interface ILoadingSpinner extends IBaseComponent {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

interface IErrorMessage extends IBaseComponent {
  error: string | Error;
  onRetry?: () => void;
  variant?: 'inline' | 'block';
}

// Theme service for consistent styling
@Injectable({ lifetime: 'singleton' })
export class ComponentThemeService {
  private theme = {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      danger: '#dc3545',
      success: '#28a745',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40',
      white: '#ffffff',
      gray: '#6c757d'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px'
    },
    shadows: {
      small: '0 1px 3px rgba(0,0,0,0.12)',
      medium: '0 4px 6px rgba(0,0,0,0.16)',
      large: '0 10px 20px rgba(0,0,0,0.19)'
    }
  };

  getColors() {
    return this.theme.colors;
  }

  getSpacing() {
    return this.theme.spacing;
  }

  getBorderRadius() {
    return this.theme.borderRadius;
  }

  getShadows() {
    return this.theme.shadows;
  }
}

// Button Component
export const Button: React.FC<IButton> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  style = {},
  ...props
}) => {
  const themeService = useService(ComponentThemeService);
  const colors = themeService.getColors();
  const spacing = themeService.getSpacing();
  const borderRadius = themeService.getBorderRadius();

  const getButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      padding: size === 'small' ? spacing.sm : size === 'large' ? spacing.lg : spacing.md,
      borderRadius: borderRadius.md,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      opacity: disabled ? 0.6 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      ...style
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: colors.primary,
          color: colors.white
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: colors.secondary,
          color: colors.white
        };
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: colors.danger,
          color: colors.white
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.primary}`
        };
      default:
        return baseStyles;
    }
  };

  return (
    <button
      className={`component-button ${className}`}
      style={getButtonStyles()}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="small" color="currentColor" />}
      {children}
    </button>
  );
};

// Input Component
export const Input: React.FC<IInput> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  className = '',
  style = {},
  ...props
}) => {
  const themeService = useService(ComponentThemeService);
  const colors = themeService.getColors();
  const spacing = themeService.getSpacing();
  const borderRadius = themeService.getBorderRadius();

  const getInputStyles = (): React.CSSProperties => ({
    padding: spacing.md,
    borderRadius: borderRadius.md,
    border: `1px solid ${error ? colors.danger : colors.gray}`,
    fontSize: '16px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    ...style
  });

  const getLabelStyles = (): React.CSSProperties => ({
    display: 'block',
    marginBottom: spacing.xs,
    fontSize: '14px',
    fontWeight: '500',
    color: colors.dark
  });

  const getErrorStyles = (): React.CSSProperties => ({
    color: colors.danger,
    fontSize: '12px',
    marginTop: spacing.xs
  });

  return (
    <div className={`component-input ${className}`}>
      {label && (
        <label style={getLabelStyles()}>
          {label}
          {required && <span style={{ color: colors.danger }}> *</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={getInputStyles()}
        {...props}
      />
      {error && (
        <div style={getErrorStyles()}>
          {typeof error === 'string' ? error : error.message}
        </div>
      )}
    </div>
  );
};

// Card Component
export const Card: React.FC<ICard> = ({
  title,
  subtitle,
  footer,
  elevation = 'medium',
  padding = 'medium',
  children,
  className = '',
  style = {},
  ...props
}) => {
  const themeService = useService(ComponentThemeService);
  const colors = themeService.getColors();
  const spacing = themeService.getSpacing();
  const borderRadius = themeService.getBorderRadius();
  const shadows = themeService.getShadows();

  const getCardStyles = (): React.CSSProperties => {
    const paddingValue = padding === 'none' ? '0' : padding === 'small' ? spacing.sm : padding === 'large' ? spacing.lg : spacing.md;

    return {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: elevation === 'none' ? 'none' : elevation === 'small' ? shadows.small : elevation === 'large' ? shadows.large : shadows.medium,
      padding: paddingValue,
      ...style
    };
  };

  const getTitleStyles = (): React.CSSProperties => ({
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.dark
  });

  const getSubtitleStyles = (): React.CSSProperties => ({
    fontSize: '14px',
    color: colors.gray,
    marginBottom: spacing.md
  });

  const getFooterStyles = (): React.CSSProperties => ({
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.light}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.sm
  });

  return (
    <div className={`component-card ${className}`} style={getCardStyles()} {...props}>
      {title && <div style={getTitleStyles()}>{title}</div>}
      {subtitle && <div style={getSubtitleStyles()}>{subtitle}</div>}
      <div>{children}</div>
      {footer && <div style={getFooterStyles()}>{footer}</div>}
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner: React.FC<ILoadingSpinner> = ({
  size = 'medium',
  color,
  className = '',
  style = {}
}) => {
  const themeService = useService(ComponentThemeService);
  const colors = themeService.getColors();

  const spinnerColor = color || colors.primary;
  const spinnerSize = size === 'small' ? '16px' : size === 'large' ? '32px' : '24px';

  const spinnerStyles: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: `2px solid ${colors.light}`,
    borderTop: `2px solid ${spinnerColor}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    ...style
  };

  return (
    <div
      className={`component-loading-spinner ${className}`}
      style={spinnerStyles}
    />
  );
};

// Error Message Component
export const ErrorMessage: React.FC<IErrorMessage> = ({
  error,
  onRetry,
  variant = 'block',
  className = '',
  style = {}
}) => {
  const themeService = useService(ComponentThemeService);
  const colors = themeService.getColors();
  const spacing = themeService.getSpacing();

  const errorMessage = typeof error === 'string' ? error : error.message;

  const getErrorStyles = (): React.CSSProperties => ({
    backgroundColor: colors.danger,
    color: colors.white,
    padding: spacing.md,
    borderRadius: themeService.getBorderRadius().md,
    display: variant === 'inline' ? 'inline-flex' : 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    ...style
  });

  const getRetryButtonStyles = (): React.CSSProperties => ({
    backgroundColor: 'transparent',
    color: colors.white,
    border: `1px solid ${colors.white}`,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: themeService.getBorderRadius().sm,
    cursor: 'pointer',
    fontSize: '12px'
  });

  return (
    <div className={`component-error-message ${className}`} style={getErrorStyles()}>
      <span>⚠️ {errorMessage}</span>
      {onRetry && (
        <button style={getRetryButtonStyles()} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

// Modal Component
export const Modal: React.FC<IModal> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  showCloseButton = true,
  children,
  className = '',
  style = {}
}) => {
  const themeService = useService(ComponentThemeService);
  const colors = themeService.getColors();
  const spacing = themeService.getSpacing();
  const borderRadius = themeService.getBorderRadius();
  const shadows = themeService.getShadows();

  if (!isOpen) return null;

  const getOverlayStyles = (): React.CSSProperties => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  });

  const getModalStyles = (): React.CSSProperties => {
    const sizeStyles = {
      small: { maxWidth: '400px', width: '90%' },
      medium: { maxWidth: '600px', width: '90%' },
      large: { maxWidth: '800px', width: '90%' },
      fullscreen: { maxWidth: '100%', width: '100%', height: '100%' }
    };

    return {
      backgroundColor: colors.white,
      borderRadius: size === 'fullscreen' ? '0' : borderRadius.lg,
      boxShadow: shadows.large,
      maxHeight: size === 'fullscreen' ? '100vh' : '90vh',
      overflowY: 'auto',
      ...sizeStyles[size],
      ...style
    };
  };

  const getHeaderStyles = (): React.CSSProperties => ({
    padding: spacing.md,
    borderBottom: `1px solid ${colors.light}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });

  const getBodyStyles = (): React.CSSProperties => ({
    padding: spacing.md
  });

  const getCloseButtonStyles = (): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: colors.gray,
    padding: 0,
    lineHeight: 1
  });

  return (
    <div className={`component-modal ${className}`} style={getOverlayStyles()}>
      <div style={getModalStyles()}>
        {(title || showCloseButton) && (
          <div style={getHeaderStyles()}>
            {title && <h2 style={{ margin: 0 }}>{title}</h2>}
            {showCloseButton && (
              <button style={getCloseButtonStyles()} onClick={onClose}>
                ×
              </button>
            )}
          </div>
        )}
        <div style={getBodyStyles()}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Export all components (types only - components are already exported inline)
export type {
  IButton,
  IInput,
  ICard,
  IModal,
  ILoadingSpinner,
  IErrorMessage
};
