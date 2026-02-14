/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getSpacing } from '../../utils';

/**
 * InputBoxStyled wrapper styles
 */
export const InputBoxWrapper = (theme: any) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme || {} as any, 'sm')};
  width: 100%;
`;
