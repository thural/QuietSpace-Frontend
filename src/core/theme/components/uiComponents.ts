/**
 * UI Components.
 * 
 * Pre-built UI components using styled components.
 * Provides clean separation of UI component logic.
 */

import { css } from 'styled-components';
import { createStyledComponent } from '../factories/styledFactory';

// Extend DefaultTheme to include our enhanced theme
declare module 'styled-components' {
    export interface DefaultTheme {
        primary: {
            [key: string]: string;
        };
        secondary: {
            [key: string]: string;
        };
    }
}

/**
 * Optimized button component with variants
 */
export const StyledButton = createStyledComponent('button') <{
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}>`
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  ${({ variant = 'primary', theme }) => {
        switch (variant) {
            case 'primary':
                return css`
          background: ${theme.primary[500]};
          color: white;
          &:hover {
            background: ${theme.primary[600]};
          }
        `;
            case 'secondary':
                return css`
          background: ${theme.secondary[500]};
          color: white;
          &:hover {
            background: ${theme.secondary[600]};
          }
        `;
            case 'outline':
                return css`
          background: transparent;
          border: 2px solid ${theme.primary[500]};
          color: ${theme.primary[500]};
          &:hover {
            background: ${theme.primary[50]};
          }
        `;
            default:
                return '';
        }
    }}
  
  ${({ size = 'md' }) => {
        switch (size) {
            case 'sm':
                return css`
          padding: 8px 16px;
          font-size: 14px;
        `;
            case 'lg':
                return css`
          padding: 16px 32px;
          font-size: 18px;
        `;
            default:
                return css`
          padding: 12px 24px;
          font-size: 16px;
        `;
        }
    }}
`;
