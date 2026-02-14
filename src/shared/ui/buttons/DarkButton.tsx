import { Button } from "@/shared/ui/components";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';
import { ComponentSize } from '../utils/themeTokenHelpers';

interface IDarkButtonProps extends GenericWrapperWithRef {
    name?: string;
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
    size?: ComponentSize;
    handleClick?: (event: React.MouseEvent) => void;
    fullWidth?: boolean;
    disabled?: boolean;
}

class DarkButton extends PureComponent<IDarkButtonProps> {
    static defaultProps: Partial<IDarkButtonProps> = {
        name: "submit",
        variant: "primary",
        size: "md",
        fullWidth: false,
        disabled: false
    };

    override render(): ReactNode {
        const {
            forwardedRef,
            name,
            variant,
            size,
            handleClick,
            fullWidth,
            disabled,
            ...props
        } = this.props;

        const buttonProps: any = {
            ref: forwardedRef,
            variant: variant || 'primary',
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

export default withForwardedRefAndErrBoundary(DarkButton);
