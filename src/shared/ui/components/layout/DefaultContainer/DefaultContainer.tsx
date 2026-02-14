/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { defaultContainerWrapperStyles } from './styles';
import { IDefaultContainerProps } from './interfaces';
import Container from '../Container';

/**
 * Enterprise DefaultContainer Component
 * 
 * A versatile default container component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <DefaultContainer 
 *   size="800px"
 *   className="custom-container"
 * >
 *   <Content />
 * </DefaultContainer>
 * ```
 */
class DefaultContainer extends PureComponent<IDefaultContainerProps> {
  static defaultProps: Partial<IDefaultContainerProps> = {
    size: "600px"
  };

  /**
   * Renders the default container with enterprise styling
   * 
   * @returns JSX element representing the default container
   */
  override render(): ReactNode {
    const { forwardedRef, size, children, className, ...props } = this.props;

    return (
      <div css={defaultContainerWrapperStyles(undefined)} className={className}>
        <Container
          ref={forwardedRef}
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
