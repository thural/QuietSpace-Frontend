/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import Container from '../Container';
import { IDefaultContainerProps, IDefaultContainerState } from './interfaces';
import { defaultContainerWrapperStyles } from './styles';

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
export class DefaultContainer extends BaseClassComponent<IDefaultContainerProps, IDefaultContainerState> {
  static defaultProps: Partial<IDefaultContainerProps> = {
    size: "600px"
  };

  protected override getInitialState(): Partial<IDefaultContainerState> {
    return {};
  }

  protected override renderContent(): React.ReactNode {
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
