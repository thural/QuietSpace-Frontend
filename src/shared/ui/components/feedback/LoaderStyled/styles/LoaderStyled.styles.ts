/**
 * LoaderStyled Component Styles
 */

import { css } from '@emotion/react';
import { getSpacing } from '../../utils';

/**
 * Loader wrapper styles
 */
export const loaderWrapperStyles = (theme: any) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${getSpacing(theme || {} as any, 'sm')};
`;
