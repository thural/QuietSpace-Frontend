import { Button } from "@/shared/ui/components";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';

interface IGradientButtonProps extends GenericWrapperWithRef {
    name?: ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
    onClick?: () => void;
}

class GradientButton extends PureComponent<IGradientButtonProps> {
    static defaultProps: Partial<IGradientButtonProps> = {
        name: "submit",
        size: "md",
        variant: "primary"
    };

    render(): ReactNode {
        const { forwardedRef, name, size, variant, onClick } = this.props;

        return (
            <Button
                ref={forwardedRef}
                variant={variant}
                size={size}
                onClick={onClick}
            >
                {name}
            </Button>
        );
    }
}

export default withForwardedRefAndErrBoundary(GradientButton);