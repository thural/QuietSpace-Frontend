/**
 * Menu Component - Enterprise Navigation
 * 
 * A comprehensive menu component with dropdown, context menu, and
 * navigation capabilities. Follows enterprise patterns with class-based
 * architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent, createRef, RefObject } from 'react';

/**
 * Menu item interface
 */
export interface IMenuItem {
  /** Item key */
  key: string;
  /** Item label */
  label: string;
  /** Item icon */
  icon?: React.ReactNode;
  /** Item href/link */
  href?: string;
  /** Item is disabled */
  disabled?: boolean;
  /** Item is active/selected */
  active?: boolean;
  /** Submenu items */
  children?: IMenuItem[];
  /** Item type */
  type?: 'item' | 'divider' | 'group';
  /** Group title */
  groupTitle?: string;
  /** Click handler */
  onClick?: (item: IMenuItem) => void;
  /** Custom render function */
  render?: (item: IMenuItem) => React.ReactNode;
}

/**
 * Menu component props interface
 */
export interface IMenuProps {
  /** Menu items */
  items: IMenuItem[];
  /** Menu mode */
  mode?: 'vertical' | 'horizontal' | 'inline';
  /** Menu theme */
  theme?: 'light' | 'dark';
  /** Component size */
  size?: 'small' | 'medium' | 'large';
  /** Show icons */
  showIcons?: boolean;
  /** Expand submenus on hover */
  expandOnHover?: boolean;
  /** Default open keys */
  defaultOpenKeys?: string[];
  /** Selected keys */
  selectedKeys?: string[];
  /** Component CSS class */
  className?: string;
  /** Component style */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: (item: IMenuItem) => void;
  /** Select handler */
  onSelect?: (item: IMenuItem) => void;
  /** Open change handler */
  onOpenChange?: (openKeys: string[]) => void;
}

/**
 * Menu state interface
 */
interface IMenuState {
  openKeys: Set<string>;
  selectedKeys: Set<string>;
}

/**
 * Menu Component
 * 
 * Enterprise-grade menu component with dropdown, context menu, and
 * comprehensive navigation features.
 */
export class Menu extends PureComponent<IMenuProps, IMenuState> {
  static defaultProps: Partial<IMenuProps> = {
    mode: 'vertical',
    theme: 'light',
    size: 'medium',
    showIcons: true,
    expandOnHover: false,
    defaultOpenKeys: [],
    selectedKeys: [],
  };

  private menuRef: RefObject<HTMLDivElement | null>;

  constructor(props: IMenuProps) {
    super(props);

    this.state = {
      openKeys: new Set(props.defaultOpenKeys || []),
      selectedKeys: new Set(props.selectedKeys || []),
    };

    this.menuRef = createRef();
  }

  /**
   * Handle item click
   */
  private handleItemClick = (item: IMenuItem) => {
    const { onClick, onSelect } = this.props;

    if (item.disabled) return;

    // Handle submenu toggle
    if (item.children && item.children.length > 0) {
      this.toggleSubmenu(item.key);
      return;
    }

    // Update selected state
    this.setState(prevState => {
      const newSelectedKeys = new Set(prevState.selectedKeys);
      newSelectedKeys.clear();
      newSelectedKeys.add(item.key);
      return { selectedKeys: newSelectedKeys };
    });

    // Call handlers
    if (onClick) {
      onClick(item);
    }

    if (onSelect) {
      onSelect(item);
    }
  };

  /**
   * Toggle submenu
   */
  private toggleSubmenu = (key: string) => {
    const { onOpenChange } = this.props;

    this.setState(prevState => {
      const newOpenKeys = new Set(prevState.openKeys);

      if (newOpenKeys.has(key)) {
        newOpenKeys.delete(key);
      } else {
        newOpenKeys.add(key);
      }

      return { openKeys: newOpenKeys };
    }, () => {
      if (onOpenChange) {
        onOpenChange(Array.from(this.state.openKeys));
      }
    });
  };

  /**
   * Handle submenu hover
   */
  private handleSubmenuHover = (key: string, isEntering: boolean) => {
    const { expandOnHover } = this.props;

    if (!expandOnHover) return;

    this.setState(prevState => {
      const newOpenKeys = new Set(prevState.openKeys);

      if (isEntering) {
        newOpenKeys.add(key);
      } else {
        newOpenKeys.delete(key);
      }

      return { openKeys: newOpenKeys };
    });
  };

  /**
   * Render menu item
   */
  private renderMenuItem = (item: IMenuItem, level: number = 0) => {
    const { mode, size, showIcons, selectedKeys } = this.props;
    const { openKeys } = this.state;
    const isOpen = openKeys.has(item.key);
    const isSelected = (selectedKeys || []).includes(item.key);
    const hasChildren = item.children && item.children.length > 0;

    // Handle divider
    if (item.type === 'divider') {
      return (
        <div key={item.key} className={`menu-divider menu-divider-${mode}`} />
      );
    }

    // Handle group
    if (item.type === 'group') {
      return (
        <div key={item.key} className={`menu-group menu-group-${mode}`}>
          {item.groupTitle && (
            <div className={`menu-group-title menu-group-title-${size}`}>
              {item.groupTitle}
            </div>
          )}
          <div className={`menu-group-items menu-group-items-${mode}`}>
            {item.children?.map(child => this.renderMenuItem(child, level + 1))}
          </div>
        </div>
      );
    }

    // Custom render function
    if (item.render) {
      return (
        <div key={item.key} className={`menu-item menu-item-${mode} ${isSelected ? 'menu-item-selected' : ''} ${item.disabled ? 'menu-item-disabled' : ''}`}>
          {item.render(item)}
        </div>
      );
    }

    // Default rendering
    const content = (
      <>
        {showIcons && item.icon && (
          <span className={`menu-item-icon menu-item-icon-${size}`}>
            {item.icon}
          </span>
        )}
        <span className={`menu-item-label menu-item-label-${size}`}>
          {item.label}
        </span>
        {hasChildren && (
          <span className={`menu-item-arrow menu-item-arrow-${size} ${isOpen ? 'menu-item-arrow-open' : ''}`}>
            ▼
          </span>
        )}
      </>
    );

    const itemElement = item.href ? (
      <a
        href={item.href}
        className={`menu-item-link ${isSelected ? 'menu-item-link-selected' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          this.handleItemClick(item);
        }}
      >
        {content}
      </a>
    ) : (
      <div
        className={`menu-item-content ${isSelected ? 'menu-item-content-selected' : ''}`}
        onClick={() => this.handleItemClick(item)}
      >
        {content}
      </div>
    );

    return (
      <div
        key={item.key}
        className={`menu-item menu-item-${mode} menu-item-${size} ${isSelected ? 'menu-item-selected' : ''} ${item.disabled ? 'menu-item-disabled' : ''}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onMouseEnter={() => hasChildren && this.handleSubmenuHover(item.key, true)}
        onMouseLeave={() => hasChildren && this.handleSubmenuHover(item.key, false)}
      >
        {itemElement}
        {hasChildren && isOpen && (
          <div className={`menu-submenu menu-submenu-${mode}`}>
            {item.children?.map(child => this.renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  override render() {
    const {
      items,
      mode,
      theme,
      size,
      className,
      style,
    } = this.props;

    return (
      <div
        ref={this.menuRef}
        className={`menu menu-${mode} menu-${theme} menu-${size} ${className || ''}`}
        style={style}
        role="menu"
      >
        {items.map(item => this.renderMenuItem(item))}
      </div>
    );
  }
}

export default Menu;
