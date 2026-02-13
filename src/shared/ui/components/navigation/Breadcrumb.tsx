/**
 * Breadcrumb Component - Enterprise Navigation
 * 
 * A comprehensive breadcrumb navigation component with customizable separators,
 * responsive design, and enterprise-grade features. Follows enterprise patterns
 * with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';
import { TableContainer } from '../data-display/Table.styles';

/**
 * Breadcrumb item interface
 */
export interface IBreadcrumbItem {
  /** Item key */
  key: string;
  /** Item label */
  label: string;
  /** Item href/link */
  href?: string;
  /** Item is clickable */
  clickable?: boolean;
  /** Item is disabled */
  disabled?: boolean;
  /** Item icon */
  icon?: React.ReactNode;
  /** Custom render function */
  render?: (item: IBreadcrumbItem) => React.ReactNode;
  /** Click handler */
  onClick?: (item: IBreadcrumbItem) => void;
}

/**
 * Breadcrumb separator interface
 */
export interface IBreadcrumbSeparator {
  /** Separator content */
  content: React.ReactNode;
  /** Custom render function */
  render?: () => React.ReactNode;
}

/**
 * Breadcrumb component props interface
 */
export interface IBreadcrumbProps {
  /** Breadcrumb items */
  items: IBreadcrumbItem[];
  /** Separator configuration */
  separator?: IBreadcrumbSeparator | string;
  /** Maximum items to show before truncating */
  maxItems?: number;
  /** Show home icon */
  showHome?: boolean;
  /** Home item configuration */
  homeItem?: Partial<IBreadcrumbItem>;
  /** Responsive behavior */
  responsive?: boolean;
  /** Component size */
  size?: 'small' | 'medium' | 'large';
  /** Component CSS class */
  className?: string;
  /** Component style */
  style?: React.CSSProperties;
  /** Click handler */
  onItemClick?: (item: IBreadcrumbItem, index: number) => void;
}

/**
 * Breadcrumb Component
 * 
 * Enterprise-grade breadcrumb navigation with customizable separators,
 * responsive design, and comprehensive accessibility features.
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
  private handleItemClick = (item: IBreadcrumbItem, index: number) => {
    const { onItemClick, onClick } = this.props;
    
    if (item.disabled) return;

    if (onClick) {
      onClick(item);
    }

    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  /**
   * Render separator
   */
  private renderSeparator = () => {
    const { separator } = this.props;

    if (typeof separator === 'string') {
      return <span className="breadcrumb-separator">{separator}</span>;
    }

    if (separator?.render) {
      return separator.render();
    }

    return <span className="breadcrumb-separator">/</span>;
  };

  /**
   * Render item
   */
  private renderItem = (item: IBreadcrumbItem, index: number, isLast: boolean) => {
    const { size } = this.props;
    const isActive = isLast;
    const isClickable = item.clickable !== false && (item.href || item.onClick);

    // Custom render function
    if (item.render) {
      return (
        <div key={item.key} className={`breadcrumb-item breadcrumb-item-${size} ${isActive ? 'breadcrumb-item-active' : ''}`}>
          {item.render(item)}
          {!isLast && this.renderSeparator()}
        </div>
      );
    }

    // Default rendering
    const content = (
      <>
        {item.icon && <span className="breadcrumb-item-icon">{item.icon}</span>}
        <span className="breadcrumb-item-label">{item.label}</span>
      </>
    );

    const itemElement = isClickable ? (
      <a
        href={item.href}
        onClick={() => this.handleItemClick(item, index)}
        className={`breadcrumb-link ${isActive ? 'breadcrumb-link-active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </a>
    ) : (
      <span className={`breadcrumb-text ${isActive ? 'breadcrumb-text-active' : ''}`}>
        {content}
      </span>
    );

    return (
      <div key={item.key} className={`breadcrumb-item breadcrumb-item-${size} ${isActive ? 'breadcrumb-item-active' : ''} ${item.disabled ? 'breadcrumb-item-disabled' : ''}`}>
        {itemElement}
        {!isLast && this.renderSeparator()}
      </div>
    );
  };

  /**
   * Render truncated items indicator
   */
  private renderTruncatedItems = (visibleItems: IBreadcrumbItem[], hiddenItems: IBreadcrumbItem[]) => {
    const { size } = this.props;

    return (
      <div className={`breadcrumb-item breadcrumb-item-${size} breadcrumb-item-truncated`}>
        <span className="breadcrumb-text">
          {visibleItems[visibleItems.length - 2].icon && <span className="breadcrumb-item-icon">{visibleItems[visibleItems.length - 2].icon}</span>}
          <span className="breadcrumb-item-label">...</span>
        </span>
        {this.renderSeparator()}
        <span className="breadcrumb-text">
          {hiddenItems[0].icon && <span className="breadcrumb-item-icon">{hiddenItems[0].icon}</span>}
          <span className="breadcrumb-item-label">{hiddenItems[0].label}</span>
        </span>
        {this.renderSeparator()}
        <span className="breadcrumb-text">
          {hiddenItems[hiddenItems.length - 1].icon && <span className="breadcrumb-item-icon">{hiddenItems[hiddenItems.length - 1].icon}</span>}
          <span className="breadcrumb-item-label">{hiddenItems[hiddenItems.length - 1].label}</span>
        </span>
      </div>
    );
  };

  render() {
    const {
      items,
      maxItems,
      showHome,
      homeItem,
      responsive,
      size,
      className,
      style,
    } = this.props;

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
      <TableContainer className={`breadcrumb breadcrumb-${size} ${className || ''}`} style={style}>
        <nav className="breadcrumb-nav" aria-label="Breadcrumb navigation">
          <ol className="breadcrumb-list">
            {visibleItems.map((item, index) => this.renderItem(item, index, index === visibleItems.length - 1 && hiddenItems.length === 0))}
            {hiddenItems.length > 0 && this.renderTruncatedItems(visibleItems, hiddenItems)}
          </ol>
        </nav>
      </TableContainer>
    );
  }
}

export default Breadcrumb;
