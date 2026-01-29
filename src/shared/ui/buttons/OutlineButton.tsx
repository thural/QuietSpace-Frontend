import { Button } from "@/shared/ui/components";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';

interface IOutlineButtonProps extends GenericWrapperWithRef {
    name?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    onClick?: (event: React.MouseEvent) => void;
}

class OutlineButton extends PureComponent<IOutlineButtonProps> {
    static defaultProps: Partial<IOutlineButtonProps> = {
        size: "md",
        name: "submit"
    };

    render(): ReactNode {
        const {
            forwardedRef,
            onClick,
            size,
            name,
            ...props
        } = this.props;

        return (
            <Button
                ref={forwardedRef}
                variant="secondary"
                size={size}
                onClick={onClick}
                {...props}
            >
                {name}
            </Button>
        );
    }
}

export default withForwardedRefAndErrBoundary(OutlineButton);