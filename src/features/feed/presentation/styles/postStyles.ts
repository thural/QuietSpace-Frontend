/**
 * Post Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const PostCard = styled.div<{ theme: EnhancedTheme }>`
  padding: 0;
  position: relative;
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  margin: ${(props: any) => `${props.theme.spacing.md} 0`};

  .badge {
    position: absolute;
    left: ${(props: any) => props.theme.spacing.sm};
    bottom: ${(props: any) => props.theme.spacing.lg};
    min - width: ${(props: any) => props.theme.spacing.sm};
    height: ${(props: any) => props.theme.spacing.sm};
    border - radius: ${(props: any) => props.theme.radius.full};
    background - color: ${(props: any) => props.theme.colors.brand[500]};
    color: ${(props: any) => props.theme.colors.text.primary};
    display: flex;
    align - items: center;
    justify - content: center;
    font - size: ${(props: any) => props.theme.typography.fontSize.sm};
    font - weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    box - shadow: ${(props: any) => props.theme.shadows.sm};
    z - index: ${(props: any) => props.theme.zIndex.above};
}

  .badge - content {
    background - color: ${(props: any) => props.theme.colors.border.light};
    color: ${(props: any) => props.theme.colors.text.primary};
    border - radius: ${(props: any) => props.theme.radius.sm};
    padding: ${(props: any) => props.theme.spacing.xs} ${(props: any) => props.theme.spacing.sm};
    font - size: ${(props: any) => props.theme.typography.fontSize.sm};
    font - weight: ${(props: any) => props.theme.typography.fontWeight.normal};
    white - space: nowrap;
    overflow: hidden;
    text - overflow: ellipsis;
    max - width: ${(props: any) => props.theme.spacing.xl};
}

  hr {
    border: none;
    height: 0.1px;
    background - color: ${(props: any) => props.theme.colors.border.light};
    margin - top: ${(props: any) => props.theme.spacing.md};
}

  &: not(: last - child) {
    border - bottom: 0.1px solid ${(props: any) => props.theme.colors.border.light};
}
`;

export const PostContent = styled.div<{ theme: EnhancedTheme }>`
padding: ${(props: any) => props.theme.spacing.md};
background - color: ${(props: any) => props.theme.colors.background.primary};
border - radius: ${(props: any) => props.theme.radius.md};
border: 1px solid ${(props: any) => props.theme.colors.border.light};
margin - bottom: ${(props: any) => props.theme.spacing.sm};
transition: all 0.2s ease;

  &:hover {
    border - color: ${(props: any) => props.theme.colors.border.base};
    box - shadow: ${(props: any) => props.theme.shadows.sm};
}
`;

export const PostHeader = styled.div<{ theme: EnhancedTheme }>`
display: flex;
align - items: center;
justify - content: space - between;
margin - bottom: ${(props: any) => props.theme.spacing.sm};
padding: 0 ${(props: any) => props.theme.spacing.md};
`;

export const PostTitle = styled.h3<{ theme: EnhancedTheme }>`
font - size: ${(props: any) => props.theme.typography.fontSize.lg};
font - weight: ${(props: any) => props.theme.typography.fontWeight.bold};
color: ${(props: any) => props.theme.colors.text.primary};
margin: 0;
line - height: ${(props: any) => props.theme.typography.lineHeight.tight};
`;

export const PostMeta = styled.div<{ theme: EnhancedTheme }>`
display: flex;
align - items: center;
gap: ${(props: any) => props.theme.spacing.sm};
font - size: ${(props: any) => props.theme.typography.fontSize.sm};
color: ${(props: any) => props.theme.colors.text.secondary};
margin - top: ${(props: any) => props.theme.spacing.xs};
`;

export const PostBody = styled.div<{ theme: EnhancedTheme }>`
color: ${(props: any) => props.theme.colors.text.primary};
line - height: ${(props: any) => props.theme.typography.lineHeight.normal};
margin - bottom: ${(props: any) => props.theme.spacing.sm};

  p {
    margin: 0 0 ${(props: any) => props.theme.spacing.sm} 0;

    &: last - child {
        margin - bottom: 0;
    }
}
`;

export const PostFooter = styled.div<{ theme: EnhancedTheme }>`
display: flex;
align - items: center;
justify - content: space - between;
padding: ${(props: any) => props.theme.spacing.sm} ${(props: any) => props.theme.spacing.md};
border - top: 1px solid ${(props: any) => props.theme.colors.border.light};
background - color: ${(props: any) => props.theme.colors.background.secondary};
border - radius: 0 0 ${(props: any) => props.theme.radius.md} ${(props: any) => props.theme.radius.md};
`;

export const PostActions = styled.div<{ theme: EnhancedTheme }>`
display: flex;
align - items: center;
gap: ${(props: any) => props.theme.spacing.sm};
`;

export const PostTimestamp = styled.span<{ theme: EnhancedTheme }>`
font - size: ${(props: any) => props.theme.typography.fontSize.sm};
color: ${(props: any) => props.theme.colors.text.secondary};
font - weight: ${(props: any) => props.theme.typography.fontWeight.normal};
`;

// Legacy export for backward compatibility during migration
export const PostStyles = {
    postCard: PostCard,
    content: PostContent,
    header: PostHeader,
    title: PostTitle,
    meta: PostMeta,
    body: PostBody,
    footer: PostFooter,
    actions: PostActions,
    timestamp: PostTimestamp,
};

export default PostStyles;
