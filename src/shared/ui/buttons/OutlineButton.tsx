import { Button } from "@/shared/ui/components/interactive";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';
import { ComponentSize } from '../utils/themeTokenHelpers';

interface IOutlineButtonProps extends GenericWrapperWithRef {
    name?: string;
    size?: ComponentSize;
    onClick?: (event: React.MouseEvent) => void;
    fullWidth?: boolean;
    disabled?: boolean;
}

class OutlineButton extends PureComponent<IOutlineButtonProps> {
    static defaultProps: Partial<IOutlineButtonProps> = {
        size: "md",
        name: "submit",
        fullWidth: false,
        disabled: false
    };

    override render(): ReactNode {
        const {
            forwardedRef,
            onClick,
            size,
            name,
            fullWidth,
            disabled,
            ...props
        } = this.props;

        const buttonProps: any = {
            ref: forwardedRef,
            variant: "secondary",
            size: size || 'md',
            fullWidth: fullWidth || false,
            disabled: disabled || false,
            outlined: true,
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

export default withForwardedRefAndErrBoundary(OutlineButton);