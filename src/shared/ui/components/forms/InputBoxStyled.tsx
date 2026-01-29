import React, { PureComponent, ReactNode } from 'react';
import { FlexContainer } from '@/shared/ui/components/layout/FlexContainer';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

interface IInputBoxStyledProps extends GenericWrapper {
    children?: ReactNode;
}

class InputBoxStyled extends PureComponent<IInputBoxStyledProps> {
    render(): ReactNode {
        const { children } = this.props;

        return (
            <FlexContainer flexDirection="column" gap="0.5rem">
                {children}
            </FlexContainer>
        );
    }
}

export default InputBoxStyled;