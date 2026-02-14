/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { conditionalWrapperStyles } from './styles';
import { IConditionalProps } from './interfaces';

/**
 * Enterprise Conditional Component
 * 
 * A versatile conditional rendering component that provides
 * enterprise-grade conditional logic with consistent patterns.
 * Built with enterprise patterns and minimal overhead.
 * 
 * @example
 * ```tsx
 * <Conditional isEnabled={user.isAuthenticated}>
 *   <ProtectedContent />
 * </Conditional>
 * ```
 */
class Conditional extends PureComponent<IConditionalProps> {
  /**
   * Renders children conditionally with enterprise wrapper
   * 
   * @returns JSX element or null based on condition
   */
  override render(): ReactNode {
    const { isEnabled, children } = this.props;
    
    if (!isEnabled) {
      return null;
    }
    
    return (
      <div css={conditionalWrapperStyles(undefined)}>
        {children}
      </div>
    );
  }
}

export default Conditional;
