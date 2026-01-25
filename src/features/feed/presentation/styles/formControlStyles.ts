/**
 * Form Control Component Styles - Modern Theme Integration
 * 
 * Enterprise styled-components with modern centralized theme system.
 * Utilizes composable tokens and enhanced theme utilities.
 */

import styled, { css } from 'styled-components';
import { useThemeTokens, EnhancedTheme, createStyledComponent, media } from '../../../../core/theme';

export const Button = createStyledComponent('button') <{
    theme: EnhancedTheme;
    variant?: 'primary' | 'secondary' | 'danger'
}>`
  display: block;
  margin-left: auto;
  padding: 0 ${(props: any) => props.theme.spacing.lg};
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  border-radius: ${(props: any) => props.theme.radius.lg};
  cursor: pointer;
  transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};
  border: none;
  min-height: ${(props: any) => `calc(${props.theme.spacing.lg} * 2)`};
  outline: none;

  /* Variant styles */
  ${(props: any) => {
        switch (props.variant) {
            case 'secondary':
                return css`
          background-color: ${(props: any) => props.theme.colors.background.secondary};
          color: ${(props: any) => props.theme.colors.text.primary};
          border: 1px solid ${(props: any) => props.theme.colors.border.light};
          
          &:hover {
            background-color: ${(props: any) => props.theme.colors.background.tertiary};
            border-color: ${(props: any) => props.theme.colors.border.medium};
          }
          
          &:focus {
            outline: 2px solid ${(props: any) => props.theme.colors.border.medium};
            outline-offset: 2px;
          }
        `;

            case 'danger':
                return css`
          background-color: ${(props: any) => props.theme.colors.semantic.error};
          color: ${(props: any) => props.theme.colors.text.inverse};
          
          &:hover {
            background-color: ${(props: any) => props.theme.colors.semantic.error};
            opacity: 0.8;
            transform: translateY(-1px);
            box-shadow: ${(props: any) => props.theme.shadows.md};
          }
          
          &:focus {
            outline: 2px solid ${(props: any) => props.theme.colors.semantic.error};
            outline-offset: 2px;
          }
        `;

            default: // primary
                return css`
          background-color: ${(props: any) => props.theme.colors.brand[500]};
          color: ${(props: any) => props.theme.colors.text.inverse};
          
          &:hover {
            background-color: ${(props: any) => props.theme.colors.brand[600]};
            transform: translateY(-1px);
            box-shadow: ${(props: any) => props.theme.shadows.md};
          }
          
          &:focus {
            outline: 2px solid ${(props: any) => props.theme.colors.brand[500]};
            outline-offset: 2px;
          }
        `;
        }
    }}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ControlArea = createStyledComponent('div') <{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.lg};
  padding: ${(props: any) => props.theme.spacing.sm};
  border-radius: ${(props: any) => props.theme.radius.md};
  transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};

  svg {
    font-size: ${(props: any) => props.theme.typography.fontSize.lg};
    color: ${(props: any) => props.theme.colors.text.secondary};
    transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};
  }

  &:hover svg {
    color: ${(props: any) => props.theme.colors.brand[500]};
  }

  ${media.mobile(css`
    margin-top: auto;
    flex-wrap: wrap;
    gap: ${(props: any) => props.theme.spacing.md};
  `)}
`;

export const FormContainer = createStyledComponent('div') <{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${(props: any) => props.theme.spacing.md};
  padding: ${(props: any) => props.theme.spacing.lg};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  border-radius: ${(props: any) => props.theme.radius.md};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};

  &:hover {
    border-color: ${(props: any) => props.theme.colors.border.medium};
    box-shadow: ${(props: any) => props.theme.shadows.sm};
  }
`;

export const FormControlGroup = createStyledComponent('div') <{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${(props: any) => props.theme.spacing.sm};
  margin-bottom: ${(props: any) => props.theme.spacing.md};

  label {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
    color: ${(props: any) => props.theme.colors.text.primary};
    margin-bottom: ${(props: any) => props.theme.spacing.xs};
  }
`;

export const ActionButtons = createStyledComponent('div') <{ theme: EnhancedTheme }>`
  display: flex;
  gap: ${(props: any) => props.theme.spacing.sm};
  justify-content: flex-end;
  align-items: center;
  padding-top: ${(props: any) => props.theme.spacing.md};
  border-top: 1px solid ${(props: any) => props.theme.colors.border.light};

  ${media.mobile(css`
    flex-direction: column;
    gap: ${(props: any) => props.theme.spacing.md};
  `)}
`;

// Enhanced components with additional features
export const FormHeader = createStyledComponent('div') <{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props: any) => props.theme.spacing.lg};
  padding-bottom: ${(props: any) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props: any) => props.theme.colors.border.light};
`;

export const FormTitle = createStyledComponent('h4') <{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.lg};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.semibold};
  color: ${(props: any) => props.theme.colors.text.primary};
  margin: 0;
`;

export const FormDescription = createStyledComponent('p') <{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  color: ${(props: any) => props.theme.colors.text.secondary};
  line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
  margin: 0 0 ${(props: any) => props.theme.spacing.md} 0;
`;

export const FormError = createStyledComponent('div') <{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  color: ${(props: any) => props.theme.colors.semantic.error};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.medium};
  margin-top: ${(props: any) => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.xs};
`;

export const FormSuccess = createStyledComponent('div') <{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  color: ${(props: any) => props.theme.colors.semantic.success};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.medium};
  margin-top: ${(props: any) => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.xs};
`;

// Modern export for backward compatibility
export const FormControlStyles = {
    button: Button,
    controlArea: ControlArea,
    form: FormContainer,
    formControlGroup: FormControlGroup,
    actionButtons: ActionButtons,
    header: FormHeader,
    title: FormTitle,
    description: FormDescription,
    error: FormError,
    success: FormSuccess,
};

export default FormControlStyles;
