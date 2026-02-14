/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, createRef, RefObject } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IMenuProps, IMenuItem, IMenuState } from './interfaces';
import {
  menuContainerStyles,
  menuItemStyles,
  menuIconStyles,
  menuLabelStyles,
  menuArrowStyles,
  menuDividerStyles,
  menuGroupStyles,
  menuGroupTitleStyles,
  submenuStyles,
  menuResponsiveStyles
} from './styles';

/**
 * Menu Component
 * 
 * Enterprise-grade menu component with comprehensive theme integration,
 * submenus, groups, and responsive design.
 */
export class Menu extends PureComponent<IMenuProps, IMenuState> {
  static defaultProps: Partial<IMenuProps> = {
    mode: 'vertical',
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
  private handleItemClick = (item: IMenuItem): void => {
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
  private toggleSubmenu = (key: string): void => {
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
  private handleSubmenuHover = (key: string, isEntering: boolean): void => {
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
  private renderMenuItem = (item: IMenuItem, level: number = 0): ReactNode => {
    const { mode = 'vertical', size = 'medium', showIcons = true } = this.props;
    const { openKeys, selectedKeys } = this.state;
    const isOpen = openKeys.has(item.key);
    const isSelected = selectedKeys.has(item.key);
    const hasChildren = item.children && item.children.length > 0;
    const theme = useTheme();

    // Handle divider
    if (item.type === 'divider') {
      return (
        <div key={item.key} css={menuDividerStyles(theme, mode)} />
      );
    }

    // Handle group
    if (item.type === 'group') {
      return (
        <div key={item.key} css={menuGroupStyles(theme, mode)}>
          {item.groupTitle && (
            <div css={menuGroupTitleStyles(theme, size)}>
              {item.groupTitle}
            </div>
          )}
          <div>
            {item.children?.map(child => this.renderMenuItem(child, level + 1))}
          </div>
        </div>
      );
    }

    // Custom render function
    if (item.render) {
      return (
        <div 
          key={item.key} 
          css={menuItemStyles(theme, mode, size, isSelected, item.disabled || false, level)}
        >
          {item.render(item)}
        </div>
      );
    }

    // Default rendering
    const content = (
      <>
        {showIcons && item.icon && (
          <span css={menuIconStyles(theme, size)}>
            {item.icon}
          </span>
        )}
        <span css={menuLabelStyles(theme, size)}>
          {item.label}
        </span>
        {hasChildren && (
          <span css={menuArrowStyles(theme, size, isOpen)}>
            ▼
          </span>
        )}
      </>
    );

    const itemElement = item.href ? (
      <a
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          this.handleItemClick(item);
        }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {content}
      </a>
    ) : (
      <div onClick={() => this.handleItemClick(item)}>
        {content}
      </div>
    );

    return (
      <div
        key={item.key}
        css={menuItemStyles(theme, mode, size, isSelected, item.disabled || false, level)}
        onMouseEnter={() => hasChildren && this.handleSubmenuHover(item.key, true)}
        onMouseLeave={() => hasChildren && this.handleSubmenuHover(item.key, false)}
      >
        {itemElement}
        {hasChildren && isOpen && (
          <div css={submenuStyles(theme, mode)}>
            {item.children?.map(child => this.renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  override render(): ReactNode {
    const { 
      items, 
      mode = 'vertical', 
      size = 'medium', 
      menuTheme = 'light',
      className,
      testId,
      id,
      onClick,
      style
    } = this.props;

    const theme = useTheme();

    return (
      <div
        ref={this.menuRef}
        css={[
          menuContainerStyles(theme, mode, size, menuTheme),
          menuResponsiveStyles(theme)
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
        role="menu"
      >
        {items.map(item => this.renderMenuItem(item))}
      </div>
    );
  }
}

export default Menu;
