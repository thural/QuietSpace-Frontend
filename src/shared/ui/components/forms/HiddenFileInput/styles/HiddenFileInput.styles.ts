/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * HiddenFileInput wrapper styles
 */
export const HiddenFileInputWrapper = css`
  position: relative;
  display: inline-block;
`;

/**
 * Hidden file input styles
 */
export const HiddenInput = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
