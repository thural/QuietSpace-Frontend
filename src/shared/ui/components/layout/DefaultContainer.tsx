/** @jsxImportSource @emotion/react */
import { Container } from "@/shared/ui/components/layout/Container";
import { css } from '@emotion/react';
import React, { PureComponent, ReactNode } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { getSpacing, getColor, getBorderWidth } from '../utils';

// Enterprise Emotion CSS for default container styling
const defaultContainerWrapperStyles = (theme?: any) => css`
  padding-top: ${getSpacing(theme, 'xl')};
  
  & hr {
    border: none;
    height: 0.1px;
    background: ${getColor(theme, 'border.medium')};
    margin-top: ${getSpacing(theme, 'md')};
  }
  
  &:not(:last-child) {
    border-bottom: ${getBorderWidth(theme, 'hairline')} solid ${getColor(theme, 'border.light')};
  }
  
  // Responsive design
  @media (max-width: 768px) {
    padding-top: ${getSpacing(theme, 'lg')};
  }
`;

/**
 * Enterprise Default Container Component
 * 
 * Replaces JSS-based defaultContainerStyles with enterprise styled-components
 * following theme system patterns and class component best practices.
 */
class DefaultContainer extends PureComponent<GenericWrapper> {
  static defaultProps: Partial<GenericWrapper> = {
    size: "600px"
  };

  override render(): ReactNode {
    const { forwardRef, size, children, className, ...props } = this.props;

    return (
      <div css={defaultContainerWrapperStyles()} className={className}>
        <Container
          ref={forwardRef}
          maxWidth={size}
          {...props}
        >
          {children}
        </Container>
      </div>
    );
  }
}

export default DefaultContainer;