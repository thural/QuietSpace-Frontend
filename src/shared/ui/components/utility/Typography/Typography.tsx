/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { typographyWrapperStyles } from './styles';
import { ITypographyProps, headingSize } from './interfaces';
import Text from '../typography/Text';
import Title from '../typography/Title';

/**
 * Enterprise Typography Component
 * 
 * A versatile typography wrapper component that provides
 * enterprise-grade text rendering with consistent patterns.
 * Built with enterprise patterns and minimal overhead.
 * 
 * @example
 * ```tsx
 * <Typography type="h1">
 *   Page Title
 * </Typography>
 * ```
 */
class Typography extends PureComponent<ITypographyProps> {
  /**
   * Renders the appropriate typography component based on type
   * 
   * @returns JSX element representing the typography
   */
  override render(): ReactNode {
    const { type, children, ...props } = this.props;

    switch (type) {
      case "h1": 
        return <Title variant="h1" {...props}>{children}</Title>;
      case "h2": 
        return <Title variant="h2" {...props}>{children}</Title>;
      case "h3": 
        return <Title variant="h3" {...props}>{children}</Title>;
      case "h4": 
        return <Title variant="h4" {...props}>{children}</Title>;
      case "h5": 
        return <Title variant="h5" {...props}>{children}</Title>;
      case "h6": 
        return <Title variant="h6" {...props}>{children}</Title>;
      case "small": 
        return <Text variant="caption" {...props}>{children}</Text>;
      default: 
        return <Text {...props}>{children}</Text>;
    }
  }
}

export default Typography;
