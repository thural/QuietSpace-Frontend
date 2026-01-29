/**
 * Enterprise Base Styled Components
 * 
 * Modern base styled components that integrate directly with the EnhancedTheme system.
 * No legacy adapters or migration code - pure modern theme integration.
 * These components provide consistent styling patterns and accessibility features.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';
import {
    BaseComponentProps,
    LayoutProps,
    FlexProps,
    TypographyProps,
    ButtonProps,
    InputProps,
    ComponentVariant,
    ComponentSize
} from '../components/types';
import {
    getSpacing,
    getColor,
    getTypography,
    getRadius,
    getShadow,
    getTransition,
    getFocusStyles,
    getDisabledStyles,
    layoutPropsToStyles,
    typographyPropsToStyles
} from '../components/utils';

/**
 * Base container component with theme integration
 */
export const BaseContainer = styled.div<BaseComponentProps>`
    box-sizing: border-box;
    ${({ theme }) => `
        transition: ${getTransition(theme)};
    `}
`;

/**
 * Base button component with enterprise styling
 */
export const BaseButton = styled.button<
    BaseComponentProps & LayoutProps & TypographyProps
>`
    box-sizing: border-box;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    
    ${({ theme }) => `
        font-family: ${theme.typography.fontFamily.sans};
        font-weight: ${theme.typography.fontWeight.medium};
        border-radius: ${theme.radius.md};
        transition: ${getTransition(theme)};
        
        /* Default styling */
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSize.base};
        background-color: ${getColor(theme, 'brand.500')};
        color: ${getColor(theme, 'text.inverse')};
        
        ${getFocusStyles(theme)}
        ${getDisabledStyles(theme)}
        
        &:hover {
            opacity: 0.8;
        }
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
    
    /* Apply typography props */
    ${({ theme, ...props }) => typographyPropsToStyles(props as TypographyProps, theme)}
`;

/**
 * Base input component with enterprise styling
 */
export const BaseInput = styled.input<
    BaseComponentProps & LayoutProps & TypographyProps
>`
    box-sizing: border-box;
    border: 1px solid;
    
    ${({ theme }) => `
        font-family: ${theme.typography.fontFamily.sans};
        font-size: ${theme.typography.fontSize.base};
        border-radius: ${theme.radius.sm};
        transition: ${getTransition(theme)};
        background-color: ${getColor(theme, 'background.secondary')};
        color: ${getColor(theme, 'text.primary')};
        border-color: ${getColor(theme, 'border.light')};
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        
        ${getFocusStyles(theme, 'brand.500')}
        ${getDisabledStyles(theme)}
        
        &:focus {
            border-color: ${getColor(theme, 'brand.500')};
            box-shadow: 0 0 0 2px ${getColor(theme, 'brand.500')}20;
        }
        
        &::placeholder {
            color: ${getColor(theme, 'text.secondary')};
        }
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
    
    /* Apply typography props */
    ${({ theme, ...props }) => typographyPropsToStyles(props as TypographyProps, theme)}
`;

/**
 * Base text component with typography integration
 */
export const BaseText = styled.span<
    BaseComponentProps & LayoutProps & TypographyProps
>`
    box-sizing: border-box;
    
    ${({ theme }) => `
        font-family: ${theme.typography.fontFamily.sans};
        color: ${getColor(theme, 'text.primary')};
        
        /* Default body text */
        font-size: ${theme.typography.fontSize.base};
        font-weight: ${theme.typography.fontWeight.normal};
        line-height: ${theme.typography.lineHeight.normal};
        transition: ${getTransition(theme)};
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
    
    /* Apply typography props */
    ${({ theme, ...props }) => typographyPropsToStyles(props as TypographyProps, theme)}
    
    /* Apply color props */
    ${({ theme, color }) => color ? `color: ${getColor(theme, color)};` : ''}
`;

/**
 * Base flex container component
 */
export const BaseFlex = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    display: flex;
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

/**
 * Base center container component
 */
export const BaseCenter = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

/**
 * Base skeleton component for loading states
 */
export const BaseSkeleton = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    
    ${({ theme }) => `
        background-color: ${getColor(theme, 'background.secondary')};
        border-radius: ${theme.radius.sm};
        
        /* Animation for skeleton loading */
        @keyframes skeleton-loading {
            0% {
                background-color: ${getColor(theme, 'background.secondary')};
            }
            50% {
                background-color: ${getColor(theme, 'border.light')};
            }
            100% {
                background-color: ${getColor(theme, 'background.secondary')};
            }
        }
        
        animation: skeleton-loading 1.5s ease-in-out infinite;
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

/**
 * Base loading overlay component
 */
export const BaseLoadingOverlay = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    ${({ theme }) => `
        background-color: ${getColor(theme, 'background.transparent')};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

/**
 * Base spinner component
 */
export const BaseSpinner = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border: 2px solid;
    
    ${({ theme }) => `
        border-color: ${getColor(theme, 'border.light')};
        border-top: 2px solid ${getColor(theme, 'brand.500')};
        border-radius: 50%;
        
        /* Animation for spinner */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        animation: spin 1s linear infinite;
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

/**
 * Base avatar component
 */
export const BaseAvatar = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    ${({ theme }) => `
        background-color: ${getColor(theme, 'background.secondary')};
        color: ${getColor(theme, 'text.primary')};
        font-weight: ${theme.typography.fontWeight.bold};
        border-radius: 50%;
        
        /* Default size */
        width: 40px;
        height: 40px;
        font-size: 16px;
        transition: ${getTransition(theme)};
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
    
    /* Apply color props */
    ${({ theme, color }) => color ? `color: ${getColor(theme, color)};` : ''}
`;

/**
 * Base progress bar component
 */
export const BaseProgress = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    width: 100%;
    height: 8px;
    
    ${({ theme }) => `
        background-color: ${getColor(theme, 'background.secondary')};
        border-radius: ${theme.radius.sm};
        overflow: hidden;
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

export const BaseProgressBar = styled.div<{
    progress?: number;
    theme: EnhancedTheme;
} & BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    height: 100%;
    
    ${({ theme, progress }) => `
        background-color: ${getColor(theme, 'semantic.success')};
        border-radius: ${theme.radius.sm};
        transition: ${getTransition(theme, 'width')};
        width: ${progress ? `${progress}%` : '0%'};
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

/**
 * Base tabs container
 */
export const BaseTabsContainer = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

export const BaseTabsList = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    display: flex;
    
    ${({ theme }) => `
        border-bottom: 1px solid ${getColor(theme, 'border.light')};
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;

export const BaseTab = styled.button<{
    active?: boolean;
    theme: EnhancedTheme;
} & BaseComponentProps & LayoutProps & TypographyProps>`
    box-sizing: border-box;
    border: none;
    background: none;
    cursor: pointer;
    
    ${({ theme, active }) => `
        font-family: ${theme.typography.fontFamily.sans};
        font-size: ${theme.typography.fontSize.base};
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        color: ${active ? getColor(theme, 'brand.500') : getColor(theme, 'text.secondary')};
        border-bottom: 2px solid ${active ? getColor(theme, 'brand.500') : 'transparent'};
        transition: ${getTransition(theme)};
        
        ${getFocusStyles(theme)}
        
        &:hover {
            color: ${getColor(theme, 'brand.500')};
        }
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
    
    /* Apply typography props */
    ${({ theme, ...props }) => typographyPropsToStyles(props as TypographyProps, theme)}
    
    /* Apply color props */
    ${({ theme, color }) => color ? `color: ${getColor(theme, color)};` : ''}
`;

export const BaseTabContent = styled.div<BaseComponentProps & LayoutProps>`
    box-sizing: border-box;
    
    ${({ theme }) => `
        padding: ${theme.spacing.lg};
    `}
    
    /* Apply layout props */
    ${({ theme, ...props }) => layoutPropsToStyles(props as LayoutProps, theme)}
`;
