/**
 * Profile Modifier Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const ListItem = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  }
`;

export const ListItemContent = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
`;

export const ListItemText = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

export const ListItemTitle = styled.h4<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeightMedium};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

export const ListItemDescription = styled.p<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

export const ListItemAction = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

export const ActionButton = styled.button<{ theme: EnhancedTheme; variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.md}`};
  border: 1px solid ${props => props.variant === 'danger' ? props.theme.colors.error[500] : props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeightMedium};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  background-color: ${props => {
        switch (props.variant) {
            case 'primary':
                return props.theme.colors.brand[500];
            case 'danger':
                return props.theme.colors.error[500];
            default:
                return props.theme.colors.background.primary;
        }
    }};
  color: ${props => {
        switch (props.variant) {
            case 'primary':
            case 'danger':
                return props.theme.colors.text.inverse;
            default:
                return props.theme.colors.text.primary;
        }
    }};
  
  &:hover {
    background-color: ${props => {
        switch (props.variant) {
            case 'primary':
                return props.theme.colors.brand[600];
            case 'danger':
                return props.theme.colors.error[600];
            default:
                return props.theme.colors.background.secondary;
        }
    }};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

export const ProfilePhotoContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.background.secondary};
  border: 2px solid ${props => props.theme.colors.border};
  overflow: hidden;
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 60px;
    height: 60px;
  }
`;

export const ProfilePhoto = styled.img<{ theme: EnhancedTheme }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const ProfilePhotoPlaceholder = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: ${props => props.theme.typography.fontSize.xl};
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.background.tertiary};
`;

export const UploadButton = styled.label<{ theme: EnhancedTheme }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  background-color: ${props => props.theme.colors.brand[500]};
  color: ${props => props.theme.colors.text.inverse};
  border-radius: ${props => props.theme.radius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeightMedium};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background-color: ${props => props.theme.colors.brand[600]};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  input[type="file"] {
    display: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
    font-size: ${props => props.theme.typography.fontSize.xs};
  }
`;

// Backward compatibility exports
export const ProfileModifierStyles = {
    listItem: ListItem,
    listItemContent: ListItemContent,
    listItemText: ListItemText,
    listItemTitle: ListItemTitle,
    listItemDescription: ListItemDescription,
    listItemAction: ListItemAction,
    actionButton: ActionButton,
    profilePhotoContainer: ProfilePhotoContainer,
    profilePhoto: ProfilePhoto,
    profilePhotoPlaceholder: ProfilePhotoPlaceholder,
    uploadButton: UploadButton,
};

export default ProfileModifierStyles;