/**
 * Repost Card Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const RepostCard = styled.div<{ theme: EnhancedTheme }>`
  padding: 0;
  position: relative;
  align-items: center;
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  margin: ${(props: any) => `${props.theme.spacing.md} 0`};
  gap: ${(props: any) => props.theme.spacing.sm};
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: ${(props: any) => props.theme.spacing.xl};
    width: 2px;
    height: 100%;
    background-color: ${(props: any) => props.theme.colors.border.light};
  }

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }
`;

export const RepostHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  padding: ${(props: any) => props.theme.spacing.sm};
  border-bottom: 1px solid ${(props: any) => props.theme.colors.border.light};
  margin-bottom: ${(props: any) => props.theme.spacing.sm};
`;

export const RepostIcon = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props: any) => props.theme.spacing.lg};
  height: ${(props: any) => props.theme.spacing.lg};
  border-radius: ${(props: any) => props.theme.radius.full};
  background-color: ${(props: any) => props.theme.colors.brand[500]}20;
  color: ${(props: any) => props.theme.colors.brand[500]};
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.colors.brand[500]}30;
    color: ${(props: any) => props.theme.colors.brand[600]};
    transform: scale(1.1);
  }
`;

export const Username = styled.span<{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.lg};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  color: ${(props: any) => props.theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props: any) => props.theme.colors.brand[500]};
    text-decoration: underline;
  }
`;

export const ReplyText = styled.p<{ theme: EnhancedTheme }>`
  font-weight: ${(props: any) => props.theme.typography.fontWeight.light};
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  color: ${(props: any) => props.theme.colors.text.secondary};
  line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
  padding: ${(props: any) => props.theme.spacing.sm};
  border-radius: ${(props: any) => props.theme.radius.sm};
  background-color: ${(props: any) => props.theme.colors.background.secondary};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.primary};
    border-color: ${(props: any) => props.theme.colors.border.base};
  }
`;

export const RepostContent = styled.div<{ theme: EnhancedTheme }>`
  padding: ${(props: any) => props.theme.spacing.sm};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  border-radius: ${(props: any) => props.theme.radius.md};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  margin: ${(props: any) => props.theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props: any) => props.theme.colors.border.base};
    box-shadow: ${(props: any) => props.theme.shadows.sm};
  }
`;

export const RepostCardContainer = styled.div<{ theme: EnhancedTheme }>`
  position: relative;
  padding-left: ${(props: any) => props.theme.spacing.xl};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }
`;

// Legacy export for backward compatibility during migration
export const RepostCardStyles = {
  repostCard: RepostCard,
  repostHeader: RepostHeader,
  repostIcon: RepostIcon,
  username: Username,
  replyText: ReplyText,
  repostContent: RepostContent,
  container: RepostCardContainer,
};

export default RepostCardStyles;
