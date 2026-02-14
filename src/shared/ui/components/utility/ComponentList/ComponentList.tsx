/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { 
  componentListContainerStyles,
  componentListItemStyles
} from './styles';
import { IComponentListProps } from './interfaces';

/**
 * Enterprise ComponentList Component
 * 
 * A versatile list rendering component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <ComponentList 
 *   Component={ItemComponent}
 *   list={items}
 * />
 * ```
 */
class ComponentList extends PureComponent<IComponentListProps> {
  /**
   * Renders the list of components with enterprise styling
   * 
   * @returns JSX element representing the component list
   */
  override render(): ReactNode {
    const { Component, list, ...props } = this.props;

    return (
      <div css={componentListContainerStyles(undefined)}>
        {list.map((elemData: Object, index: number) => (
          <div key={index} css={componentListItemStyles(undefined)}>
            <Component {...elemData} {...props} />
          </div>
        ))}
      </div>
    );
  }
}

export default ComponentList;
