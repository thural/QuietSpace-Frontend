/** @jsxImportSource @emotion/react */
/**
 * Enterprise Text Component
 * 
 * A versatile text component that replaces the original Text component
 * with enhanced theme integration and enterprise patterns.
 */

import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { TypographyProps } from '../types';
import { typographyPropsToStyles } from '../utils';

interface ITextProps extends TypographyProps {
    children?: ReactNode;
}

// Emotion CSS implementation
const textStyles = (theme?: any, typographyProps?: TypographyProps) => css`
  margin: 0;
  box-sizing: border-box;
  ${typographyProps ? typographyPropsToStyles(typographyProps, theme) : ''}
`;

/**
 * Text Component
 * 
 * A comprehensive text component that provides consistent typography
 * across the application with full theme integration.
 * 
 * @param props - Typography props for text styling
 * @returns JSX Element
 */
class Text extends PureComponent<ITextProps> {
    override render(): ReactNode {
        const { children, theme, className, testId, ...typographyProps } = this.props;

        return (
            <p
                css={textStyles(theme, typographyProps)}
                className={className}
                data-testid={testId}
            >
                {children}
            </p>
        );
    }
}

export default Text;
