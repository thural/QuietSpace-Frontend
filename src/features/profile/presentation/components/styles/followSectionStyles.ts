import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for follow section styling
export const FollowSectionContainer = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.md};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

export const FollowSectionTitle = styled.h3<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  color: ${props => props.theme.colors.text.primary};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

export const FollowButton = styled.button<{ theme: EnhancedTheme; isFollowing?: boolean }>`
  background-color: ${props => props.isFollowing ? props.theme.colors.background.tertiary : props.theme.colors.brand[500]};
  color: ${props => props.isFollowing ? props.theme.colors.text.primary : props.theme.colors.text.inverse};
  border: 1px solid ${props => props.isFollowing ? props.theme.colors.border.medium : props.theme.colors.brand[500]};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background-color: ${props => props.isFollowing ? props.theme.colors.background.secondary : props.theme.colors.brand[600]};
    border-color: ${props => props.isFollowing ? props.theme.colors.border.dark : props.theme.colors.brand[600]};
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
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

export const FollowStats = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.sm};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    gap: ${props => props.theme.spacing.sm};
  }
`;

export const FollowStat = styled.div<{ theme: EnhancedTheme }>`
  text-align: center;
  
  .stat-number {
    display: block;
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.text.primary};
  }
  
  .stat-label {
    display: block;
    font-size: ${props => props.theme.typography.fontSize.xs};
    color: ${props => props.theme.colors.text.tertiary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;
