import React, { PureComponent, ReactNode } from 'react';

interface IConditionalProps {
    isEnabled: boolean;
    children: ReactNode;
}

class Conditional extends PureComponent<IConditionalProps> {
    override render(): ReactNode {
        const { isEnabled, children } = this.props;
        return isEnabled && children ? <>{children}</> : null;
    }
}

export default Conditional;
