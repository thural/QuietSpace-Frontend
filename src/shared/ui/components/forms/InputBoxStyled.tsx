import React from 'react';
import { FlexContainer } from '@/shared/ui/components/layout/FlexContainer';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

const InputBoxStyled: React.FC<GenericWrapper> = ({ children }) => {
    return (
        <FlexContainer flexDirection="column" gap="0.5rem">
            {children}
        </FlexContainer>
    )
}

export default InputBoxStyled