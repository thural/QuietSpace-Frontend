import React from 'react';

interface ConditionalProps {
    isEnabled: boolean;
    children: React.ReactNode;
}

const Conditional: React.FC<ConditionalProps> = ({ isEnabled, children }) => {
    return isEnabled && children ? <>{children}</> : null;
};

export default Conditional;
