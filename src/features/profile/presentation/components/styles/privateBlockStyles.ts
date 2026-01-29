import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for private block styling
export const PrivateBlockContainer = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid ${props => props.theme.colors.border.medium};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

export const PrivateBlockHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.xs};
  }
`;

export const PrivateBlockTitle = styled.h3<{ theme: EnhancedTheme }>`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`;

export const PrivateBlockContent = styled.div<{ theme: EnhancedTheme }>`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.5;
`;
