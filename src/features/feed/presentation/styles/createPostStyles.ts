/**
 * Create Post Component Styles - Modern Theme Integration
 * 
 * Enterprise styled-components with modern centralized theme system.
 * Utilizes composable tokens and enhanced theme utilities.
 */

import styled, { css } from 'styled-components';
import { useThemeTokens, EnhancedTheme, createStyledComponent, media } from '@core/theme';

export const Button = styled.button<{
  theme: EnhancedTheme;
  variant?: 'primary' | 'secondary' | 'danger'
}>`
  display: block;
  padding: 0 ${(props: any) => props.theme.spacing.lg};
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.medium};
  margin-top: ${(props: any) => props.theme.spacing.md};
  margin-left: auto;
  border-radius: ${(props: any) => props.theme.radius.xl};
  cursor: pointer;
  transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};
  border: none;
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
            color: ${(props: any) => props.theme.colors.text.primary};
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
            color: ${(props: any) => props.theme.colors.text.inverse};
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
            color: ${(props: any) => props.theme.colors.text.inverse};
          }
          
          &:focus {
            outline: 2px solid ${(props: any) => props.theme.colors.brand[500]};
            outline-offset: 2px;
          }
        `;
    }
  }}
`;

export const ControlArea = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.lg};

  & svg {
    font-size: ${(props: any) => props.theme.typography.fontSize.xl};
    color: ${(props: any) => props.theme.colors.text.secondary};
  }
  
  ${media.mobile(css`
    margin-top: auto;
    gap: ${(props: any) => props.theme.spacing.md};
  `)}
`;

export const AccessControls = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  color: ${(props: any) => props.theme.colors.text.secondary};
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  
  ${media.mobile(css`
    gap: ${(props: any) => props.theme.spacing.xs};
  `)}
`;

export const PollToggle = styled.div<{ theme: EnhancedTheme }>`
  cursor: pointer;
  padding: ${(props: any) => props.theme.spacing.xs};
  border-radius: ${(props: any) => props.theme.radius.sm};
  transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.tertiary};
    border-color: ${(props: any) => props.theme.colors.border.medium};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const FormContainer = styled.form<{ theme: EnhancedTheme }>`
  display: flex;
  flex-flow: column nowrap;
  gap: ${(props: any) => props.theme.spacing.md};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  border-radius: ${(props: any) => props.theme.radius.md};
  padding: ${(props: any) => props.theme.spacing.lg};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  
  ${media.mobile(css`
    gap: ${(props: any) => props.theme.spacing.sm};
    padding: ${(props: any) => props.theme.spacing.md};
  `)}
`;

// Enhanced components with additional features
export const CreatePostHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props: any) => props.theme.spacing.md};
  padding-bottom: ${(props: any) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props: any) => props.theme.colors.border.light};
`;

export const CreatePostTitle = styled.h3<{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.lg};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.semibold};
  color: ${(props: any) => props.theme.colors.text.primary};
  margin: 0;
`;

export const CharacterCount = styled.span<{
  theme: EnhancedTheme;
  isOverLimit?: boolean;
}>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  color: ${(props: any) => props.isOverLimit
    ? props.theme.colors.semantic.error
    : props.theme.colors.text.secondary
  };
  font-weight: ${(props: any) => props.theme.typography.fontWeight.medium};
  
  ${(props: any) => props.isOverLimit && css`
    font-weight: ${(props: any) => props.theme.typography.fontWeight.semibold};
  `}
`;

// Modern export for backward compatibility
export const CreatePostStyles = {
  button: Button,
  controlArea: ControlArea,
  accessControls: AccessControls,
  pollToggle: PollToggle,
  form: FormContainer,
  header: CreatePostHeader,
  title: CreatePostTitle,
  characterCount: CharacterCount,
};

export default CreatePostStyles;
