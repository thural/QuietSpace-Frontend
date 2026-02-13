import { Button } from "@/shared/ui/components/interactive";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';
import { ComponentSize } from '../utils/themeTokenHelpers';

interface IGradientButtonProps extends GenericWrapperWithRef {
    name?: ReactNode;
    size?: ComponentSize;
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
    onClick?: (event: React.MouseEvent) => void;
    fullWidth?: boolean;
    disabled?: boolean;
}

class GradientButton extends PureComponent<IGradientButtonProps> {
    static defaultProps: Partial<IGradientButtonProps> = {
        name: "submit",
        size: "md",
        variant: "primary",
        fullWidth: false,
        disabled: false
    };

    override render(): ReactNode {
        const {
            forwardedRef,
            name,
            size,
            variant,
            onClick,
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
            gradient: true,
            ...props
        };

        if (onClick) {
            buttonProps.onClick = onClick;
        }

        return (
            <Button {...buttonProps}>
                {name}
            </Button>
        );
    }
}

export default withForwardedRefAndErrBoundary(GradientButton);