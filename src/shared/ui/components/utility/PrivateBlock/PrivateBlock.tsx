/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { 
  privateBlockContainerStyles,
  privateBlockIconStyles,
  privateBlockMessageStyles,
  privateBlockContentStyles
} from './styles';
import { IPrivateBlockProps } from './interfaces';

/**
 * Enterprise PrivateBlock Component
 * 
 * A versatile private content blocking component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <PrivateBlock 
 *   message="This content is private"
 *   Icon={LockIcon}
 * >
 *   <AdditionalContent />
 * </PrivateBlock>
 * ```
 */
class PrivateBlock extends PureComponent<IPrivateBlockProps> {
  /**
   * Renders the private block with enterprise styling
   * 
   * @returns JSX element representing the private block
   */
  override render(): ReactNode {
    const {
      message = "This content is private",
      Icon,
      type = "h4",
      children,
      className
    } = this.props;

    const DefaultIcon = () => (
      <div css={privateBlockIconStyles(undefined)}>
        🔒
      </div>
    );

    const IconComponent = Icon || DefaultIcon;

    return (
      <div css={privateBlockContainerStyles(undefined)} className={className}>
        <div css={privateBlockContentStyles(undefined)}>
          <IconComponent />
          <div css={privateBlockMessageStyles(undefined)}>
            {message}
          </div>
          {children && (
            <div>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default PrivateBlock;
