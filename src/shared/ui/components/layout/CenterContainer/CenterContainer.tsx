/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { ICenterContainerProps } from './interfaces';
import {
    centerContainerBaseStyles,
    centerContainerResponsiveStyles,
    centerContainerVariantStyles
} from './styles';

/**
 * CenterContainer Component
 * 
 * A specialized container that centers its content both horizontally
 * and vertically using flexbox. Perfect for modals, overlays, and
 * centered layouts. Built using enterprise class-based pattern with theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */
export class CenterContainer extends PureComponent<ICenterContainerProps> {
    static displayName = 'CenterContainer';

    /**
   * Get container styles based on props and theme tokens
   */
    private getContainerStyles = (theme: any) => {
        const { variant = 'default' } = this.props;

        return css`
        ${centerContainerBaseStyles(theme)}
        ${centerContainerResponsiveStyles(theme)}
        ${centerContainerVariantStyles(variant, theme)}
      `;
    };

    override render(): ReactNode {
        const {
            children,
            theme,
            className,
            testId,
            style,
            variant
        } = this.props;

        const containerStyles = this.getContainerStyles(theme);

        return (
            <div
                css={containerStyles}
                className={className}
                data-testid={testId}
                style={style}
            >
                {children}
            </div>
        );
    }
}
