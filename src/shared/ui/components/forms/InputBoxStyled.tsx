/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { getSpacing } from '../utils';

interface IInputBoxStyledProps extends GenericWrapper {
    children?: ReactNode;
}

class InputBoxStyled extends PureComponent<IInputBoxStyledProps> {
    override render(): ReactNode {
        const { children, theme } = this.props;

        const inputBoxStyles = css`
            display: flex;
            flex-direction: column;
            gap: ${getSpacing(theme || {} as any, 'sm')};
        `;

        return (
            <div css={inputBoxStyles}>
                {children}
            </div>
        );
    }
}

export default InputBoxStyled;