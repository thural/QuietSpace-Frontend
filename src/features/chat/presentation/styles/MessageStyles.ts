/**
 * Message Box Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const Message = styled.div<{ theme: Theme }>`
  max-width: 200px;
  position: relative;
  display: flex;
  cursor: pointer;
  flex-flow: column nowrap;
  justify-items: center;
  box-shadow: 0px 0px 16px -16px;
  border-radius: ${props => props.theme.radius.md};
  background-color: ${props => props.theme.colors.backgroundTransparentMax};
  border: 1px solid ${props => props.theme.colors.borderExtra};
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.md * 0.8)};
  margin: ${props => props.theme.spacing(props.theme.spacingFactor.md * 0.3)} 0;

  & .buttons {
    display: flex;
    margin-left: auto;
    align-items: center;
    flex-flow: row nowrap;
    gap: ${props => props.theme.spacing(props.theme.spacingFactor.xs)};
  }

  & button {
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
    border-radius: ${props => props.theme.radius.md};
    padding: ${props => `${props.theme.spacing(props.theme.spacingFactor.xs)} ${props.theme.spacing(props.theme.spacingFactor.md)}`};
  }
`;

export const Delete = styled.div<{ theme: Theme }>`
  width: 100%;
  right: 2.5rem;
  cursor: pointer;
  position: absolute;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.small};
  font-weight: ${props => props.theme.typography.fontWeightThin};
  margin-bottom: ${props => props.theme.spacing(props.theme.spacingFactor.md * 0.2)};
`;

export const Text = styled.div<{ theme: Theme }>`
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: ${props => props.theme.typography.fontWeightThin};

  & p {
    margin: 0;
    padding: 0;
  }
`;

// Legacy export for backward compatibility during migration
export const messageStyles = {
    message: Message,
    delete: Delete,
    text: Text,
};
