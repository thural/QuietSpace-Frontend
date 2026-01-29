import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for comment reply form styling
export const ReplyWrapper = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-flow: row nowrap;
  gap: ${props => props.theme.spacing.xs};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

export const ReplyInputWrapper = styled.div<{ theme: EnhancedTheme }>`
  position: relative;
  width: 16rem;
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.radius.md};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`;

export const ReplyInput = styled.input<{ theme: EnhancedTheme }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
  color: ${props => props.theme.colors.text.primary};
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.md};
  
  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
  }
`;

export const ReplyButton = styled.button<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.inverse};
  background: ${props => props.theme.colors.brand[500]};
  border: none;
  border-radius: ${props => props.theme.radius.md};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background: ${props => props.theme.colors.brand[600]};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.brand[300]};
    outline-offset: 2px;
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border.medium};
    color: ${props => props.theme.colors.text.tertiary};
    cursor: not-allowed;
    transform: none;
  }
`;