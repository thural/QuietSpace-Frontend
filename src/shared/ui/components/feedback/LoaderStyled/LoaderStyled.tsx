/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { loaderWrapperStyles } from './styles';
import { ILoaderStyledProps, ILoaderStyledState } from './interfaces';
import Loader from '../display/Loader';
import { getSpacing } from '../utils';

/**
 * Enterprise LoaderStyled Component
 * 
 * A styled loader component wrapper with enterprise-grade styling
 * and theme integration. Built with Emotion CSS for optimal performance.
 * 
 * @example
 * ```tsx
 * <LoaderStyled 
 *   color="primary"
 *   size={40}
 *   theme={theme}
 * />
 * ```
 */
export class LoaderStyled extends BaseClassComponent<ILoaderStyledProps, ILoaderStyledState> {
  static defaultProps: Partial<ILoaderStyledProps> = {
    color: "gray",
    size: 30
  };

  protected override getInitialState(): Partial<ILoaderStyledState> {
    return {};
  }

  protected override renderContent(): React.ReactNode {
    const { color, size, theme, className, testId, id, onClick, style } = this.props;

    return (
      <div 
        css={loaderWrapperStyles(theme)}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        <Loader color={color} size={size} />
      </div>
    );
  }
}
