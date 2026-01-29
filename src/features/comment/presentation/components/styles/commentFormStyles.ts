import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for comment form styling
export const CommentCardContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.sm};
  }
`;

export const CommentContent = styled.div<{ theme: EnhancedTheme }>`
  max-width: 100%;
  margin-right: ${props => props.theme.spacing.md};
  flex: 1;
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    margin-right: 0;
    width: 100%;
  }
`;

export const CommentControls = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
    margin-top: ${props => props.theme.spacing.sm};
  }
`;