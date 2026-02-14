/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { titleStyles } from './styles';
import { ITitleProps } from './interfaces';

/**
 * Enterprise Title Component
 * 
 * A specialized heading component for titles and headings
 * with consistent styling, theme integration, and responsive design.
 * Built with enterprise patterns and Emotion CSS for optimal performance.
 * 
 * @example
 * ```tsx
 * <Title 
 *   variant="h1" 
 *   size="32px" 
 *   color="text.primary"
 * >
 *   Page Title
 * </Title>
 * ```
 */
class Title extends PureComponent<ITitleProps> {
  /**
   * Renders the title element with enterprise styling
   * 
   * @returns JSX element representing the title component
   */
  override render(): ReactNode {
    const { children, theme, className, testId, ...typographyProps } = this.props;

    return (
      <h1
        css={titleStyles(theme, typographyProps)}
        className={className}
        data-testid={testId}
      >
        {children}
      </h1>
    );
  }
}

export default Title;
