/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, createRef, RefObject } from 'react';
import { useTheme } from '@/core/modules/theming';
import { ISidebarProps, ISidebarSection, ISidebarState } from './interfaces';
import {
  sidebarContainerStyles,
  sidebarLogoStyles,
  sidebarLogoImageStyles,
  sidebarLogoTextStyles,
  sidebarUserStyles,
  sidebarUserAvatarStyles,
  sidebarUserInfoStyles,
  sidebarUserNameStyles,
  sidebarUserEmailStyles,
  sidebarContentStyles,
  sidebarSectionStyles,
  sidebarSectionHeaderStyles,
  sidebarSectionTitleContentStyles,
  sidebarSectionIconStyles,
  sidebarSectionTitleStyles,
  sidebarSectionArrowStyles,
  sidebarSectionContentStyles,
  sidebarFooterStyles,
  sidebarToggleStyles,
  sidebarResponsiveStyles
} from './styles';

// Define IMenuItem interface locally to avoid circular dependency
interface IMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  disabled?: boolean;
  active?: boolean;
  children?: IMenuItem[];
  type?: 'item' | 'divider' | 'group';
  groupTitle?: string;
  onClick?: (item: IMenuItem) => void;
  render?: (item: IMenuItem) => ReactNode;
}

/**
 * Sidebar Component
 * 
 * Enterprise-grade sidebar navigation with comprehensive theme integration,
 * collapsible sections, user info, and responsive design.
 */
export class Sidebar extends PureComponent<ISidebarProps, ISidebarState> {
  static defaultProps: Partial<ISidebarProps> = {
    width: 280,
    collapsed: false,
    fixed: true,
    position: 'left',
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
  private handleCollapse = (): void => {
    const { onCollapse } = this.props;

    if (onCollapse) {
      onCollapse(!this.props.collapsed);
    }
  };

  /**
   * Handle section toggle
   */
  private handleSectionToggle = (sectionKey: string): void => {
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
  private renderLogo = (): ReactNode => {
    const { logo, showLogo, collapsed } = this.props;
    const theme = useTheme();

    if (!showLogo || !logo) return null;

    const logoContent = (
      <div css={sidebarLogoStyles(theme, collapsed)}>
        <img src={logo.src} alt={logo.alt} css={sidebarLogoImageStyles(theme)} />
        {!collapsed && (
          <span css={sidebarLogoTextStyles(theme, collapsed)}>QuietSpace</span>
        )}
      </div>
    );

    return logo.href ? (
      <a href={logo.href} css={sidebarLogoStyles(theme, collapsed)}>
        {logoContent}
      </a>
    ) : (
      <div css={sidebarLogoStyles(theme, collapsed)}>
        {logoContent}
      </div>
    );
  };

  /**
   * Render user info
   */
  private renderUser = (): ReactNode => {
    const { user, collapsed } = this.props;
    const theme = useTheme();

    if (!user) return null;

    const userContent = (
      <div css={sidebarUserStyles(theme, collapsed)}>
        {user.avatar && (
          <img src={user.avatar} alt={user.name} css={sidebarUserAvatarStyles(theme)} />
        )}
        {!collapsed && (
          <div css={sidebarUserInfoStyles(theme, collapsed)}>
            <div css={sidebarUserNameStyles(theme)}>{user.name}</div>
            {user.email && (
              <div css={sidebarUserEmailStyles(theme)}>{user.email}</div>
            )}
          </div>
        )}
      </div>
    );

    return user.href ? (
      <a href={user.href} css={sidebarUserStyles(theme, collapsed)}>
        {userContent}
      </a>
    ) : (
      <div css={sidebarUserStyles(theme, collapsed)}>
        {userContent}
      </div>
    );
  };

  /**
   * Render section
   */
  private renderSection = (section: ISidebarSection): ReactNode => {
    const { collapsedSections } = this.state;
    const { collapsed, size = 'medium' } = this.props;
    const isCollapsed = collapsedSections.has(section.key);
    const theme = useTheme();

    return (
      <div key={section.key} css={sidebarSectionStyles(theme, collapsed)}>
        <div
          css={sidebarSectionHeaderStyles(theme, collapsed, section.collapsible || false)}
          onClick={() => section.collapsible && this.handleSectionToggle(section.key)}
        >
          <div css={sidebarSectionTitleContentStyles(theme, collapsed)}>
            {section.icon && (
              <span css={sidebarSectionIconStyles(theme, size)}>
                {section.icon}
              </span>
            )}
            {!collapsed && (
              <span css={sidebarSectionTitleStyles(theme, collapsed)}>
                {section.title}
              </span>
            )}
          </div>
          {section.collapsible && (
            <span css={sidebarSectionArrowStyles(theme, isCollapsed)}>
              ▼
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div css={sidebarSectionContentStyles(theme)}>
            {/* Simple menu rendering - in real implementation, would use Menu component */}
            {section.items.map(item => (
              <div key={item.key} style={{ padding: '8px 16px' }}>
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Render toggle button
   */
  private renderToggleButton = (): ReactNode => {
    const { collapsed, position = 'left' } = this.props;
    const theme = useTheme();

    return (
      <button
        css={sidebarToggleStyles(theme, position, collapsed)}
        onClick={this.handleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span>
          {collapsed ? '→' : '←'}
        </span>
      </button>
    );
  };

  override render(): ReactNode {
    const {
      sections,
      width,
      collapsed = false,
      fixed = true,
      position = 'left',
      sidebarTheme = 'light',
      size = 'medium',
      className,
      testId,
      id,
      onClick,
      style,
      footer,
    } = this.props;

    const theme = useTheme();

    const sidebarStyle = {
      width: collapsed ? 
        (size === 'small' ? 60 : size === 'large' ? 100 : 80) : 
        width,
      ...style,
    };

    return (
      <>
        <div
          ref={this.sidebarRef}
          css={[
            sidebarContainerStyles(theme, position, sidebarTheme, size, collapsed, fixed),
            sidebarResponsiveStyles(theme)
          ]}
          className={className}
          data-testid={testId}
          id={id?.toString()}
          onClick={onClick}
          style={sidebarStyle}
          data-collapsed={collapsed}
        >
          {this.renderLogo()}

          <div css={sidebarContentStyles(theme)}>
            {this.renderUser()}

            <div>
              {sections.map(section => this.renderSection(section))}
            </div>
          </div>

          {footer && (
            <div css={sidebarFooterStyles(theme, collapsed)}>
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
