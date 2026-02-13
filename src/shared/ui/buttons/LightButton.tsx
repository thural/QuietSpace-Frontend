import { Button } from "@/shared/ui/components/interactive";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';
import { ComponentSize } from '../utils/themeTokenHelpers';

interface ILightButtonProps extends GenericWrapperWithRef {
    name?: string;
    size?: ComponentSize;
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
    handleClick?: (event: React.MouseEvent) => void;
    fullWidth?: boolean;
    disabled?: boolean;
}

class LightButton extends PureComponent<ILightButtonProps> {
    static defaultProps: Partial<ILightButtonProps> = {
        name: "submit",
        size: "md",
        variant: "light",
        fullWidth: false,
        disabled: false
    };

    override render(): ReactNode {
        const {
            forwardedRef,
            name,
            size,
            variant,
            handleClick,
            fullWidth,
            disabled,
            ...props
        } = this.props;

        const buttonProps: any = {
            ref: forwardedRef,
            variant: variant || 'light',
            size: size || 'md',
            fullWidth: fullWidth || false,
            disabled: disabled || false,
            ...props
        };

        if (handleClick) {
            buttonProps.onClick = handleClick;
        }

        return (
            <Button {...buttonProps}>
                {name}
            </Button>
        );
    }
}

export default withForwardedRefAndErrBoundary(LightButton);