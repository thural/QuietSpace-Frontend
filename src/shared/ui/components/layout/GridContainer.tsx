/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getSpacing } from '../utils';

/**
 * Optimized grid container
 */
export const GridContainer = ({ columns = 1, gap = '0', className, ...props }: {
  columns?: number;
  gap?: string;
  className?: string;
  [key: string]: any;
}) => {
  const gridStyles = css`
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: ${gap};
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `;

  return (
    <div css={gridStyles} className={className} {...props} />
  );
};
