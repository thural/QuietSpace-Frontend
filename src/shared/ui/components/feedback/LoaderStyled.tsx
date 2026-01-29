import { Loader } from "@/shared/ui/components";
import React, { PureComponent, ReactNode } from 'react';

interface ILoaderStyledProps {
    color?: string;
    size?: number | string;
}

class LoaderStyled extends PureComponent<ILoaderStyledProps> {
    static defaultProps: Partial<ILoaderStyledProps> = {
        color: "gray",
        size: 30
    };

    render(): ReactNode {
        const { color, size } = this.props;
        return (
            <Loader color={color} size={size} />
        );
    }
}

export default LoaderStyled;