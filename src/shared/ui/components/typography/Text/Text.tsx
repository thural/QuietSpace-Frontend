/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { textStyles } from './styles';
import { ITextProps } from './interfaces';

/**
 * Enterprise Text Component
 * 
 * A versatile text component that provides consistent typography
 * across the application with full theme integration and responsive design.
 * Built with enterprise patterns and Emotion CSS for optimal performance.
 * 
 * @example
 * ```tsx
 * <Text 
 *   variant="body1" 
 *   size="16px" 
 *   weight="medium"
 *   color="text.primary"
 * >
 *   Your text content here
 * </Text>
 * ```
 */
class Text extends PureComponent<ITextProps> {
  /**
   * Renders the text element with enterprise styling
   * 
   * @returns JSX element representing the text component
   */
  override render(): ReactNode {
    const { children, theme, className, testId, ...typographyProps } = this.props;

    return (
      <p
        css={textStyles(theme, typographyProps)}
        className={className}
        data-testid={testId}
      >
        {children}
      </p>
    );
  }
}

export default Text;
