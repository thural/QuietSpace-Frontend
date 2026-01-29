import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for user list styling
export const UserListContainer = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.md};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

export const UserListItem = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.tertiary};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.xs};
    gap: ${props => props.theme.spacing.xs};
  }
`;

export const UserListResultContainer = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  
  // Custom scrollbar styling
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border.medium};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.border.dark};
  }
`;

export const UserListAvatar = styled.div<{ theme: EnhancedTheme; size?: string }>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
  background: ${props => props.theme.colors.background.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
  flex-shrink: 0;
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: ${props => props.size || '32px'};
    height: ${props => props.size || '32px'};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

export const UserListInfo = styled.div<{ theme: EnhancedTheme }>`
  flex: 1;
  min-width: 0;
`;

export const UserListUsername = styled.div<{ theme: EnhancedTheme }>`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
  
  // Truncate long usernames
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserListBio = styled.div<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  
  // Truncate long bios
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;
