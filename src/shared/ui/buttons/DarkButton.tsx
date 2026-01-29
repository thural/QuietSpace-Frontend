import { Button } from "@/shared/ui/components";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';

interface IDarkButtonProps extends GenericWrapperWithRef {
    name?: string;
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    handleClick?: (event: React.MouseEvent) => void;
}

class DarkButton extends PureComponent<IDarkButtonProps> {
    static defaultProps: Partial<IDarkButtonProps> = {
        name: "submit",
        variant: "primary",
        size: "sm"
    };

    render(): ReactNode {
        const {
            forwardedRef,
            name,
            variant,
            size,
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

export default withForwardedRefAndErrBoundary(DarkButton);
