import type { EnhancedTheme } from '../../../core/modules/theming/internal/types';
import withForwardedRefAndErrBoundary from "../../hooks/withForwardedRef";
import { GenericWrapperWithRef } from "../../../shared/types/sharedComponentTypes";
import { PureComponent, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { ComponentSize } from '../utils/themeTokenHelpers';

interface ICustomButtonProps extends GenericWrapperWithRef {
  label?: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
  size?: ComponentSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

// Enterprise styled-components for custom button styling with theme tokens
const CustomButtonContainer = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth', 'disabled'].includes(prop),
}) <{
  theme?: EnhancedTheme;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark' | undefined;
  size?: ComponentSize | undefined;
  fullWidth?: boolean | undefined;
  disabled?: boolean | undefined;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme?.animation?.duration?.fast || '0.2s'} ${props => props.theme?.animation?.easing?.ease || 'ease'};
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
  text-decoration: none;
  outline: none;
  
  /* Size variants using theme spacing tokens */
  ${props => {
    const size = props.size || 'md';
    const sizeMap = {
      xs: `${props.theme?.spacing?.xs || '4px'} ${props.theme?.spacing?.sm || '8px'}`,
      sm: `${props.theme?.spacing?.sm || '8px'} ${props.theme?.spacing?.md || '16px'}`,
      md: `${props.theme?.spacing?.md || '16px'} ${props.theme?.spacing?.lg || '24px'}`,
      lg: `${props.theme?.spacing?.lg || '24px'} ${props.theme?.spacing?.xl || '32px'}`,
      xl: `${props.theme?.spacing?.xl || '32px'} ${props.theme?.spacing?.xl || '32px'}`
    };
    return `padding: ${sizeMap[size]};`;
  }}
  
  /* Font size using theme typography tokens */
  ${props => {
    const size = props.size || 'md';
    const fontSizeMap = {
      xs: props.theme?.typography?.fontSize?.xs || '12px',
      sm: props.theme?.typography?.fontSize?.sm || '14px',
      md: props.theme?.typography?.fontSize?.base || '16px',
      lg: props.theme?.typography?.fontSize?.lg || '18px',
      xl: props.theme?.typography?.fontSize?.xl || '20px'
    };
    return `font-size: ${fontSizeMap[size]};`;
  }}
  
  /* Border radius using theme radius tokens */
  border-radius: ${props => props.theme?.radius?.md || '6px'};
  
  /* Full width modifier */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  /* Primary variant using theme color tokens */
  ${props => props.variant === 'primary' && css`
    background-color: ${props.theme?.colors?.brand?.[500] || '#007bff'};
    color: ${props.theme?.colors?.text?.inverse || '#ffffff'};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme?.colors?.brand?.[600] || '#0056b3'};
      transform: translateY(-1px);
      box-shadow: ${props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    }
    
    &:focus {
      outline: 2px solid ${props.theme?.colors?.brand?.[300] || '#80bdff'};
      outline-offset: 2px;
    }
  `}
  
  /* Secondary variant using theme color tokens */
  ${props => props.variant === 'secondary' && css`
    background-color: ${props.theme?.colors?.background?.secondary || '#f8f9fa'};
    color: ${props.theme?.colors?.text?.primary || '#212529'};
    border: 1px solid ${props.theme?.colors?.border?.medium || '#6c757d'};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme?.colors?.background?.tertiary || '#e9ecef'};
      border-color: ${props.theme?.colors?.border?.dark || '#495057'};
      transform: translateY(-1px);
      box-shadow: ${props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    }
    
    &:focus {
      outline: 2px solid ${props.theme?.colors?.brand?.[300] || '#80bdff'};
      outline-offset: 2px;
    }
  `}
  
  /* Success variant using theme semantic tokens */
  ${props => props.variant === 'success' && css`
    background-color: ${props.theme?.colors?.semantic?.success || '#28a745'};
    color: ${props.theme?.colors?.text?.inverse || '#ffffff'};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme?.colors?.semantic?.success || '#218838'};
      transform: translateY(-1px);
      box-shadow: ${props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    }
    
    &:focus {
      outline: 2px solid ${props.theme?.colors?.semantic?.success || '#7dd87d'};
      outline-offset: 2px;
    }
  `}
  
  /* Warning variant using theme semantic tokens */
  ${props => props.variant === 'warning' && css`
    background-color: ${props.theme?.colors?.semantic?.warning || '#ffc107'};
    color: ${props.theme?.colors?.text?.primary || '#212529'};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme?.colors?.semantic?.warning || '#e0a800'};
      transform: translateY(-1px);
      box-shadow: ${props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    }
    
    &:focus {
      outline: 2px solid ${props.theme?.colors?.semantic?.warning || '#ffda6a'};
      outline-offset: 2px;
    }
  `}
  
  /* Danger variant using theme semantic tokens */
  ${props => props.variant === 'danger' && css`
    background-color: ${props.theme?.colors?.semantic?.error || '#dc3545'};
    color: ${props.theme?.colors?.text?.inverse || '#ffffff'};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme?.colors?.semantic?.error || '#c82333'};
      transform: translateY(-1px);
      box-shadow: ${props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    }
    
    &:focus {
      outline: 2px solid ${props.theme?.colors?.semantic?.error || '#f1b0b7'};
      outline-offset: 2px;
    }
  `}
  
  /* Info variant using theme semantic tokens */
  ${props => props.variant === 'info' && css`
    background-color: ${props.theme?.colors?.semantic?.info || '#17a2b8'};
    color: ${props.theme?.colors?.text?.inverse || '#ffffff'};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme?.colors?.semantic?.info || '#138496'};
      transform: translateY(-1px);
      box-shadow: ${props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    }
    
    &:focus {
      outline: 2px solid ${props.theme?.colors?.semantic?.info || '#7dd3d3'};
      outline-offset: 2px;
    }
  `}
  
  /* Light variant using theme color tokens */
  ${props => props.variant === 'light' && css`
    background-color: ${props.theme?.colors?.background?.secondary || '#f8f9fa'};
    color: ${props.theme?.colors?.text?.primary || '#212529'};
    border: 1px solid ${props.theme?.colors?.border?.light || '#dee2e6'};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme?.colors?.background?.tertiary || '#e9ecef'};
      border-color: ${props.theme?.colors?.border?.medium || '#6c757d'};
      transform: translateY(-1px);
      box-shadow: ${props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    }
    
    &:focus {
      outline: 2px solid ${props.theme?.colors?.brand?.[300] || '#80bdff'};
      outline-offset: 2px;
    }
  `}
  
  /* Dark variant using theme neutral tokens */
  ${props => props.variant === 'dark' && css`
    background-color: ${props.theme?.colors?.neutral?.[800] || '#343a40'};
    color: ${props.theme?.colors?.text?.inverse || '#ffffff'};
    
    &:hover:not(:disabled) {
      background-color: ${props.theme?.colors?.neutral?.[900] || '#212529'};
      transform: translateY(-1px);
      box-shadow: ${props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
    }
    
    &:focus {
      outline: 2px solid ${props.theme?.colors?.brand?.[300] || '#80bdff'};
      outline-offset: 2px;
    }
  `}
  
  /* Active state */
  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.theme?.shadows?.sm || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  }
  
  /* Disabled state using theme tokens */
  &:disabled {
    background-color: ${props => props.theme?.colors?.border?.medium || '#6c757d'};
    color: ${props => props.theme?.colors?.text?.tertiary || '#6c757d'};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
  
  /* Responsive design using theme breakpoints */
  @media (max-width: ${props => props.theme?.breakpoints?.sm || '768px'}) {
    ${props => {
    const size = props.size || 'md';
    const sizeMap = {
      xs: `${props.theme?.spacing?.xs || '4px'} ${props.theme?.spacing?.xs || '4px'}`,
      sm: `${props.theme?.spacing?.xs || '4px'} ${props.theme?.spacing?.sm || '8px'}`,
      md: `${props.theme?.spacing?.sm || '8px'} ${props.theme?.spacing?.md || '16px'}`,
      lg: `${props.theme?.spacing?.md || '16px'} ${props.theme?.spacing?.lg || '24px'}`,
      xl: `${props.theme?.spacing?.lg || '24px'} ${props.theme?.spacing?.lg || '24px'}`
    };
    return `padding: ${sizeMap[size]};`;
  }}
    
    font-size: ${props => props.theme?.typography?.fontSize?.sm || '14px'};
  }
`;

class CustomButton extends PureComponent<ICustomButtonProps> {
  static defaultProps: Partial<ICustomButtonProps> = {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
    disabled: false
  };

  override render(): ReactNode {
    const {
      forwardedRef,
      label,
      variant,
      size,
      fullWidth,
      disabled,
      ...props
    } = this.props;

    return (
      <CustomButtonContainer
        ref={forwardedRef}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
        {...props}
      >
        {label}
      </CustomButtonContainer>
    );
  }
}

export default withForwardedRefAndErrBoundary(CustomButton);