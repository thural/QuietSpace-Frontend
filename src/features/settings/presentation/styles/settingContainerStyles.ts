/**
 * Settings Container Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const Panel = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  margin: 0 ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin: 0 ${props => props.theme.spacing.md};
    padding: ${props => props.theme.spacing.sm};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin: 0 ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.xs};
  }
`;

export const Tabs = styled.div<{ theme: EnhancedTheme }>`
  margin: 0;
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-wrap: wrap;
    gap: ${props => props.theme.spacing.xs};
  }
`;

export const TabItem = styled.button<{ theme: EnhancedTheme; isActive?: boolean }>`
  background: none;
  border: none;
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.md}`};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.isActive ? props.theme.typography.fontWeight.bold : props.theme.typography.fontWeight.normal};
  color: ${props => props.isActive ? props.theme.colors.brand[600] : props.theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${props => props.theme.radius.md} ${props => props.theme.radius.md} 0 0;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  position: relative;
  
  &:hover {
    color: ${props => props.theme.colors.brand[500]};
    background-color: ${props => props.theme.colors.background.secondary};
  }
  
  ${props => props.isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -${props.theme.spacing.sm};
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${props.theme.colors.brand[600]};
      border-radius: ${props.theme.radius.sm} ${props.theme.radius.sm} 0 0;
    }
  `}
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

export const SettingsContent = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.md} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

export const SettingsSection = styled.div<{ theme: EnhancedTheme }>`
  margin-bottom: ${props => props.theme.spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.base};
    margin: 0 0 ${props => props.theme.spacing.sm} 0;
  }
`;

export const SectionDescription = styled.p<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  line-height: 1.5;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.xs};
    margin: 0 0 ${props => props.theme.spacing.sm} 0;
  }
`;

// Backward compatibility exports
export const SettingContainerStyles = {
  panel: Panel,
  tabs: Tabs,
  tabItem: TabItem,
  content: SettingsContent,
  section: SettingsSection,
  title: SectionTitle,
  description: SectionDescription,
};

export default SettingContainerStyles;