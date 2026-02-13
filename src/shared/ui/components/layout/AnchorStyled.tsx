import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"
import React, { PureComponent } from "react";

interface IAnchorStyledProps extends GenericWrapperWithRef {
    href?: string;
    target?: string;
    label?: string;
}

class AnchorStyled extends PureComponent<IAnchorStyledProps> {
    override render(): React.ReactNode {
        const {
            href = "",
            target = "_blank",
            label = "blank",
            forwardedRef,
            style,
            ...props
        } = this.props;

        return (
            <a
                ref={forwardedRef}
                href={href}
                target={target}
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    ...style
                }}
                {...props}
            >
                {label}
            </a>
        )
    }
}

export default withForwardedRefAndErrBoundary(AnchorStyled);