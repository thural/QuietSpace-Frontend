/**
 * Sidebar Component - Enterprise Navigation
 * 
 * A comprehensive sidebar navigation component with collapsible sections,
 * nested navigation, and responsive design. Follows enterprise patterns
 * with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent, createRef, RefObject } from 'react';
import { Menu, IMenuItem } from './Menu';

/**
 * Sidebar section interface
 */
export interface ISidebarSection {
  /** Section key */
  key: string;
  /** Section title */
  title: string;
  /** Section icon */
  icon?: React.ReactNode;
  /** Section items */
  items: IMenuItem[];
  /** Section is collapsible */
  collapsible?: boolean;
  /** Section is collapsed by default */
  defaultCollapsed?: boolean;
}

/**
 * Sidebar component props interface
 */
export interface ISidebarProps {
  /** Sidebar sections */
  sections: ISidebarSection[];
  /** Sidebar width */
  width?: number | string;
  /** Sidebar is collapsed */
  collapsed?: boolean;
  /** Sidebar is fixed */
  fixed?: boolean;
  /** Sidebar position */
  position?: 'left' | 'right';
  /** Sidebar theme */
  theme?: 'light' | 'dark';
  /** Component size */
  size?: 'small' | 'medium' | 'large';
  /** Show logo */
  showLogo?: boolean;
  /** Logo configuration */
  logo?: {
    src: string;
    alt: string;
    href?: string;
  };
  /** User info */
  user?: {
    name: string;
    avatar?: string;
    email?: string;
    href?: string;
  };
  /** Footer content */
  footer?: React.ReactNode;
  /** Component CSS class */
  className?: string;
  /** Component style */
  style?: React.CSSProperties;
  /** Collapse handler */
  onCollapse?: (collapsed: boolean) => void;
  /** Section toggle handler */
  onSectionToggle?: (sectionKey: string, collapsed: boolean) => void;
}

/**
 * Sidebar state interface
 */
interface ISidebarState {
  collapsedSections: Set<string>;
}

/**
 * Sidebar Component
 * 
 * Enterprise-grade sidebar navigation with collapsible sections,
 * nested navigation, and comprehensive responsive features.
 */
export class Sidebar extends PureComponent<ISidebarProps, ISidebarState> {
  static defaultProps: Partial<ISidebarProps> = {
    width: 280,
    collapsed: false,
    fixed: true,
    position: 'left',
    theme: 'light',
    size: 'medium',
    showLogo: true,
  };

  private sidebarRef: RefObject<HTMLDivElement | null>;

  constructor(props: ISidebarProps) {
    super(props);

    this.state = {
      collapsedSections: new Set(
        props.sections
          .filter(section => section.defaultCollapsed)
          .map(section => section.key)
      ),
    };

    this.sidebarRef = createRef();
  }

  /**
   * Handle sidebar collapse
   */
  private handleCollapse = () => {
    const { onCollapse } = this.props;

    if (onCollapse) {
      onCollapse(!this.props.collapsed);
    }
  };

  /**
   * Handle section toggle
   */
  private handleSectionToggle = (sectionKey: string) => {
    const { onSectionToggle } = this.props;

    this.setState(prevState => {
      const newCollapsedSections = new Set(prevState.collapsedSections);

      if (newCollapsedSections.has(sectionKey)) {
        newCollapsedSections.delete(sectionKey);
      } else {
        newCollapsedSections.add(sectionKey);
      }

      return { collapsedSections: newCollapsedSections };
    }, () => {
      if (onSectionToggle) {
        onSectionToggle(sectionKey, !this.state.collapsedSections.has(sectionKey));
      }
    });
  };

  /**
   * Render logo
   */
  private renderLogo = () => {
    const { logo, showLogo, collapsed } = this.props;

    if (!showLogo || !logo) return null;

    const logoContent = (
      <div className={`sidebar-logo ${collapsed ? 'sidebar-logo-collapsed' : ''}`}>
        <img src={logo.src} alt={logo.alt} className="sidebar-logo-image" />
        {!collapsed && (
          <span className="sidebar-logo-text">QuietSpace</span>
        )}
      </div>
    );

    return logo.href ? (
      <a href={logo.href} className="sidebar-logo-link">
        {logoContent}
      </a>
    ) : (
      <div className="sidebar-logo-container">
        {logoContent}
      </div>
    );
  };

  /**
   * Render user info
   */
  private renderUser = () => {
    const { user, collapsed } = this.props;

    if (!user) return null;

    const userContent = (
      <div className={`sidebar-user ${collapsed ? 'sidebar-user-collapsed' : ''}`}>
        {user.avatar && (
          <img src={user.avatar} alt={user.name} className="sidebar-user-avatar" />
        )}
        {!collapsed && (
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            {user.email && (
              <div className="sidebar-user-email">{user.email}</div>
            )}
          </div>
        )}
      </div>
    );

    return user.href ? (
      <a href={user.href} className="sidebar-user-link">
        {userContent}
      </a>
    ) : (
      <div className="sidebar-user-container">
        {userContent}
      </div>
    );
  };

  /**
   * Render section
   */
  private renderSection = (section: ISidebarSection) => {
    const { collapsedSections } = this.state;
    const { collapsed, size } = this.props;
    const isCollapsed = collapsedSections.has(section.key);

    return (
      <div key={section.key} className={`sidebar-section ${isCollapsed ? 'sidebar-section-collapsed' : ''}`}>
        <div
          className={`sidebar-section-header ${isCollapsed ? 'sidebar-section-header-collapsed' : ''}`}
          onClick={() => section.collapsible && this.handleSectionToggle(section.key)}
        >
          <div className="sidebar-section-title-content">
            {section.icon && (
              <span className={`sidebar-section-icon sidebar-section-icon-${size}`}>
                {section.icon}
              </span>
            )}
            {!collapsed && (
              <span className="sidebar-section-title">{section.title}</span>
            )}
          </div>
          {section.collapsible && (
            <span className={`sidebar-section-arrow ${isCollapsed ? 'sidebar-section-arrow-collapsed' : ''}`}>
              ▼
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className="sidebar-section-content">
            <Menu
              items={section.items}
              mode="vertical"
              theme={this.props.theme}
              size={size}
              showIcons={true}
            />
          </div>
        )}
      </div>
    );
  };

  /**
   * Render toggle button
   */
  private renderToggleButton = () => {
    const { collapsed, position } = this.props;

    return (
      <button
        className={`sidebar-toggle sidebar-toggle-${position} ${collapsed ? 'sidebar-toggle-collapsed' : ''}`}
        onClick={this.handleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="sidebar-toggle-icon">
          {collapsed ? '→' : '←'}
        </span>
      </button>
    );
  };

  override render() {
    const {
      sections,
      width,
      collapsed,
      fixed,
      position,
      theme,
      size,
      className,
      style,
      footer,
    } = this.props;

    const sidebarStyle = {
      width: collapsed ? (size === 'small' ? 60 : size === 'large' ? 100 : 80) : width,
      ...style,
    };

    return (
      <>
        <div
          ref={this.sidebarRef}
          className={`sidebar sidebar-${position} sidebar-${theme} sidebar-${size} ${collapsed ? 'sidebar-collapsed' : ''} ${fixed ? 'sidebar-fixed' : ''} ${className || ''}`}
          style={sidebarStyle}
        >
          {this.renderLogo()}

          <div className="sidebar-content">
            {this.renderUser()}

            <div className="sidebar-sections">
              {sections.map(section => this.renderSection(section))}
            </div>
          </div>

          {footer && (
            <div className={`sidebar-footer ${collapsed ? 'sidebar-footer-collapsed' : ''}`}>
              {footer}
            </div>
          )}
        </div>

        {fixed && this.renderToggleButton()}
      </>
    );
  }
}

export default Sidebar;
