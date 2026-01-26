/**
 * Chat Headline Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const ChatHeadline = styled.div<{ theme: EnhancedTheme }>`
  gap: ${props => props.theme.spacing.md};
  position: relative;
  padding: ${props => `0 ${props.theme.spacing.sm} ${props.theme.spacing.md} ${props.theme.spacing.sm}`};
  align-items: center;
  background-color: ${props => props.theme.colors.background.primary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  & .title {
    width: 100%;
    position: relative;
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    line-height: ${props => props.theme.typography.lineHeight.tight};
    color: ${props => props.theme.colors.text.primary};
  }
`;

// Legacy export for backward compatibility during migration
export const chatHeadlineStyles = {
  chatHeadline: ChatHeadline,
};

export default chatHeadlineStyles;
