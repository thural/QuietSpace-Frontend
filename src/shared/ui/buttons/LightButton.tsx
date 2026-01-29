import { Button } from "@/shared/ui/components";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';

interface ILightButtonProps extends GenericWrapperWithRef {
    name?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
    handleClick?: (event: React.MouseEvent) => void;
}

class LightButton extends PureComponent<ILightButtonProps> {
    static defaultProps: Partial<ILightButtonProps> = {
        name: "submit",
        size: "sm",
        variant: "light"
    };

    render(): ReactNode {
        const {
            forwardedRef,
            name,
            size,
            variant,
            handleClick,
            ...props
        } = this.props;

        return (
            <Button
                ref={forwardedRef}
                variant={variant}
                size={size}
                onClick={handleClick}
                {...props}
            >
                {name}
            </Button>
        );
    }
}

export default withForwardedRefAndErrBoundary(LightButton);