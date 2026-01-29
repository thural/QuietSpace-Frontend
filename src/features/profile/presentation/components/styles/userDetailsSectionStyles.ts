import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for user details section styling
export const UserDetailsSectionContainer = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.md};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

export const UserDetailsSectionHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.xs};
  }
`;

export const UserDetailsSectionTitle = styled.h2<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin: 0;
  color: ${props => props.theme.colors.text.primary};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.lg};
  }
`;

export const UserDetailsSectionContent = styled.div<{ theme: EnhancedTheme }>`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.base};
  line-height: 1.6;
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

export const UserDetailsSectionItem = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.xs};
  }
`;

export const UserDetailsSectionLabel = styled.span<{ theme: EnhancedTheme }>`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

export const UserDetailsSectionValue = styled.span<{ theme: EnhancedTheme }>`
  color: ${props => props.theme.colors.text.secondary};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;
