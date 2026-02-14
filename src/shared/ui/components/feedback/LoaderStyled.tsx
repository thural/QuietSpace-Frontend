/** @jsxImportSource @emotion/react */
import Loader from "../display/Loader";
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { getSpacing } from '../utils';

interface ILoaderStyledProps {
    color?: string;
    size?: number | string;
    theme?: any;
}

class LoaderStyled extends PureComponent<ILoaderStyledProps> {
    static defaultProps: Partial<ILoaderStyledProps> = {
        color: "gray",
        size: 30
    };

    override render(): ReactNode {
        const { color, size, theme } = this.props;

        const loaderWrapperStyles = css`
            display: flex;
            align-items: center;
            justify-content: center;
            padding: ${getSpacing(theme || {} as any, 'sm')};
        `;

        return (
            <div css={loaderWrapperStyles}>
                <Loader color={color} size={size} />
            </div>
        );
    }
}

export default LoaderStyled;