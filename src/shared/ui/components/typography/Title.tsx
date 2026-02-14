/** @jsxImportSource @emotion/react */
/**
 * Enterprise Title Component
 * 
 * A title component that replaces the original Title component
 * with enhanced theme integration and enterprise patterns.
 */

import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { TypographyProps } from '../types';
import { typographyPropsToStyles } from '../utils';

interface ITitleProps extends TypographyProps {
    children?: ReactNode;
}

// Emotion CSS implementation
const titleStyles = (theme?: any, typographyProps?: TypographyProps) => css`
  margin: 0;
  box-sizing: border-box;
  font-weight: bold;
  ${typographyProps ? typographyPropsToStyles(typographyProps, theme) : ''}
`;

/**
 * Title Component
 * 
 * A specialized heading component for titles and headings
 * with consistent styling and theme integration.
 * 
 * @param props - Typography props for title styling
 * @returns JSX Element
 */
class Title extends PureComponent<ITitleProps> {
    override render(): ReactNode {
        const { children, theme, className, testId, ...typographyProps } = this.props;

        return (
            <h1
                css={titleStyles(theme, typographyProps)}
                className={className}
                data-testid={testId}
            >
                {children}
            </h1>
        );
    }
}

export default Title;
