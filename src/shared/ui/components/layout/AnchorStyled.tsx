/** @jsxImportSource @emotion/react */
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"
import React, { PureComponent } from "react";
import { css } from '@emotion/react';
import { getColor, getTransition } from '../utils';

interface IAnchorStyledProps extends GenericWrapperWithRef {
    href?: string;
    target?: string;
    label?: string;
    theme?: any;
}

class AnchorStyled extends PureComponent<IAnchorStyledProps> {
    override render(): React.ReactNode {
        const {
            href = "",
            target = "_blank",
            label = "blank",
            forwardedRef,
            style,
            theme,
            ...props
        } = this.props;

        const anchorStyles = css`
            text-decoration: none;
            color: ${getColor(theme || {} as any, 'text.primary')};
            cursor: pointer;
            transition: ${getTransition(theme || {} as any, 'color', 'fast', 'ease')};
            
            &:hover {
                color: ${getColor(theme || {} as any, 'brand.500')};
                text-decoration: underline;
            }
            
            &:focus {
                outline: 2px solid ${getColor(theme || {} as any, 'brand.200')};
                outline-offset: 2px;
            }
        `;

        return (
            <a
                ref={forwardedRef}
                href={href}
                target={target}
                css={anchorStyles}
                style={style}
                {...props}
            >
                {label}
            </a>
        )
    }
}

export default withForwardedRefAndErrBoundary(AnchorStyled);