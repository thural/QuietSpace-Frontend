/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IBreadcrumbProps, IBreadcrumbItem, IBreadcrumbSeparator } from './interfaces';
import {
  breadcrumbContainerStyles,
  breadcrumbNavStyles,
  breadcrumbListStyles,
  breadcrumbItemStyles,
  breadcrumbLinkStyles,
  breadcrumbTextStyles,
  breadcrumbSeparatorStyles,
  breadcrumbIconStyles,
  breadcrumbTruncatedStyles,
  breadcrumbResponsiveStyles
} from './styles';

/**
 * Breadcrumb Component
 * 
 * Enterprise-grade breadcrumb navigation component with comprehensive theme integration,
 * separators, truncation, and responsive design.
 */
export class Breadcrumb extends PureComponent<IBreadcrumbProps> {
  static defaultProps: Partial<IBreadcrumbProps> = {
    separator: '/',
    maxItems: 5,
    showHome: false,
    responsive: true,
    size: 'medium',
    homeItem: {
      key: 'home',
      label: 'Home',
      href: '/',
      clickable: true,
    },
  };

  /**
   * Handle item click
   */
  private handleItemClick = (item: IBreadcrumbItem, index: number): void => {
    const { onItemClick } = this.props;
    
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick(item);
    }

    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  /**
   * Render separator
   */
  private renderSeparator = (): ReactNode => {
    const { separator } = this.props;
    const theme = useTheme();

    if (typeof separator === 'string') {
      return (
        <span css={breadcrumbSeparatorStyles(theme)}>
          {separator}
        </span>
      );
    }

    if (separator?.render) {
      return separator.render();
    }

    return (
      <span css={breadcrumbSeparatorStyles(theme)}>
        /
      </span>
    );
  };

  /**
   * Render individual breadcrumb item
   */
  private renderItem = (item: IBreadcrumbItem, index: number, isLast: boolean): ReactNode => {
    const { size = 'medium' } = this.props;
    const theme = useTheme();
    const isActive = isLast;
    const isClickable = item.clickable !== false && (item.href || item.onClick);

    // Custom render function
    if (item.render) {
      return (
        <li 
          key={item.key} 
          css={breadcrumbItemStyles(theme, size, isActive, item.disabled || false)}
        >
          {item.render(item)}
          {!isLast && this.renderSeparator()}
        </li>
      );
    }

    // Default rendering
    const content = (
      <>
        {item.icon && <span css={breadcrumbIconStyles(theme)}>{item.icon}</span>}
        <span>{item.label}</span>
      </>
    );

    const itemElement = isClickable ? (
      <a
        href={item.href}
        onClick={() => this.handleItemClick(item, index)}
        css={breadcrumbLinkStyles(theme, size, isActive)}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </a>
    ) : (
      <span css={breadcrumbTextStyles(theme, size, isActive)}>
        {content}
      </span>
    );

    return (
      <li 
        key={item.key} 
        css={breadcrumbItemStyles(theme, size, isActive, item.disabled || false)}
      >
        {itemElement}
        {!isLast && this.renderSeparator()}
      </li>
    );
  };

  /**
   * Render truncated items indicator
   */
  private renderTruncatedItems = (visibleItems: IBreadcrumbItem[], hiddenItems: IBreadcrumbItem[]): ReactNode => {
    const { size = 'medium' } = this.props;
    const theme = useTheme();

    return (
      <li css={breadcrumbTruncatedStyles(theme, size)}>
        <span css={breadcrumbTextStyles(theme, size)}>
          {visibleItems[visibleItems.length - 2]?.icon && 
            <span css={breadcrumbIconStyles(theme)}>{visibleItems[visibleItems.length - 2].icon}</span>}
          ...
        </span>
        {this.renderSeparator()}
        <span css={breadcrumbTextStyles(theme, size)}>
          {hiddenItems[0]?.icon && 
            <span css={breadcrumbIconStyles(theme)}>{hiddenItems[0].icon}</span>}
          {hiddenItems[0]?.label}
        </span>
        {this.renderSeparator()}
        <span css={breadcrumbTextStyles(theme, size)}>
          {hiddenItems[hiddenItems.length - 1]?.icon && 
            <span css={breadcrumbIconStyles(theme)}>{hiddenItems[hiddenItems.length - 1].icon}</span>}
          {hiddenItems[hiddenItems.length - 1]?.label}
        </span>
      </li>
    );
  };

  override render(): ReactNode {
    const {
      items,
      maxItems,
      showHome,
      homeItem,
      responsive,
      size = 'medium',
      className,
      testId,
      id,
      onClick,
      style
    } = this.props;

    const theme = useTheme();

    // Add home item if enabled
    const allItems = showHome && homeItem ? [homeItem as IBreadcrumbItem, ...items] : items;

    // Handle truncation for responsive design
    let visibleItems = allItems;
    let hiddenItems: IBreadcrumbItem[] = [];

    if (responsive && allItems.length > maxItems) {
      const showCount = maxItems - 2; // Keep room for truncation indicator
      visibleItems = allItems.slice(0, showCount);
      hiddenItems = allItems.slice(showCount);
    }

    return (
      <div
        css={[
          breadcrumbContainerStyles(theme),
          breadcrumbResponsiveStyles(theme)
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        <nav css={breadcrumbNavStyles(theme)} aria-label="Breadcrumb navigation">
          <ol css={breadcrumbListStyles(theme)}>
            {visibleItems.map((item, index) => 
              this.renderItem(item, index, index === visibleItems.length - 1 && hiddenItems.length === 0)
            )}
            {hiddenItems.length > 0 && this.renderTruncatedItems(visibleItems, hiddenItems)}
          </ol>
        </nav>
      </div>
    );
  }
}

export default Breadcrumb;
