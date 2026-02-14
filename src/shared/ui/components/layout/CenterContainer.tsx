/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { LayoutProps } from '../types';
import { layoutPropsToStyles } from '../utils';

// Emotion CSS implementation
const centerContainerStyles = (theme?: any, layoutProps?: LayoutProps) => css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  ${layoutPropsToStyles(layoutProps || {}, theme)}
`;

/**
 * CenterContainer Component
 * 
 * A specialized container that centers its content both horizontally
 * and vertically using flexbox. Perfect for modals, overlays, and
 * centered layouts.
 * 
 * @param props - Layout props for styling and positioning
 * @returns JSX Element
 */
class CenterContainer extends PureComponent<LayoutProps> {
    static displayName = 'CenterContainer';

    override render(): ReactNode {
        const { children, theme, className, testId, ...layoutProps } = this.props;

        return (
            <div
                css={centerContainerStyles(theme, layoutProps)}
                className={className}
                data-testid={testId}
            >
                {children}
            </div>
        );
    }
}

export default CenterContainer;
