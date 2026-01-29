import { LoadingOverlay } from "@/shared/ui/components";
import React, { PureComponent, ReactNode } from 'react';

interface IFullLoadingOverlayProps {
    visible?: boolean;
    radius?: string;
    blur?: number;
}

class FullLoadingOverlay extends PureComponent<IFullLoadingOverlayProps> {
    static defaultProps: Partial<IFullLoadingOverlayProps> = {
        visible: true,
        radius: "sm",
        blur: 2
    };

    render(): ReactNode {
        const { visible } = this.props;
        return <LoadingOverlay visible={visible} />;
    }
}

export default FullLoadingOverlay;