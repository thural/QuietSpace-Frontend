/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { ITabNavigationProps, INavigationTab, ITabNavigationState } from './interfaces';
import {
  tabNavigationContainerStyles,
  tabListStyles,
  tabButtonStyles,
  tabContentContainerStyles,
  tabPanelStyles,
  tabBadgeStyles,
  tabNavigationResponsiveStyles
} from './styles';

/**
 * TabNavigation Component
 * 
 * Enterprise-grade tab navigation component with comprehensive theme integration,
 * animations, accessibility features, and responsive design.
 */
export class TabNavigation extends PureComponent<ITabNavigationProps, ITabNavigationState> {
  static defaultProps: Partial<ITabNavigationProps> = {
    variant: 'default',
    size: 'md',
    orientation: 'horizontal',
    showContent: true,
    disabled: false,
  };

  constructor(props: ITabNavigationProps) {
    super(props);

    const { defaultTabId, tabs } = props;

    // Determine initial active tab
    const initialTabId = defaultTabId || (tabs.length > 0 ? tabs[0].id : '');

    this.state = {
      activeTabId: initialTabId,
      isTransitioning: false
    };
  }

  /**
   * Handle tab change with transition
   */
  private handleTabChange = (tabId: string): void => {
    const { onTabChange, disabled } = this.props;

    if (disabled) {
      return;
    }

    const tab = this.props.tabs.find(t => t.id === tabId);
    if (tab?.disabled) {
      return;
    }

    if (tabId === this.state.activeTabId) {
      return; // Already active
    }

    // Trigger transition
    this.setState({ isTransitioning: true });

    // Change active tab with transition
    setTimeout(() => {
      this.setState({ 
        activeTabId: tabId,
        isTransitioning: false 
      });

      // Call callback
      if (onTabChange) {
        onTabChange(tabId);
      }
    }, 150);
  };

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown = (e: React.KeyboardEvent, tabId: string): void => {
    const { tabs } = this.props;
    const currentIndex = tabs.findIndex(tab => tab.id === tabId);

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        const prevTab = tabs[prevIndex];
        if (prevTab && !prevTab.disabled) {
          this.handleTabChange(prevTab.id);
        }
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        const nextTab = tabs[nextIndex];
        if (nextTab && !nextTab.disabled) {
          this.handleTabChange(nextTab.id);
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        this.handleTabChange(tabId);
        break;
    }
  };

  /**
   * Render badge for tab notifications
   */
  private renderBadge = (badge: number): ReactNode => {
    if (!badge || badge <= 0) {
      return null;
    }

    const theme = useTheme();

    return (
      <span css={tabBadgeStyles(theme)}>
        {badge > 99 ? '99+' : badge}
      </span>
    );
  };

  /**
   * Render individual tab
   */
  private renderTab = (tab: INavigationTab, isActive: boolean): ReactNode => {
    const { variant = 'default', size = 'md', orientation = 'horizontal' } = this.props;
    const theme = useTheme();

    return (
      <button
        key={tab.id}
        css={tabButtonStyles(theme, isActive, variant, size, orientation, tab.disabled || false)}
        onClick={() => this.handleTabChange(tab.id)}
        onKeyDown={(e) => this.handleKeyDown(e, tab.id)}
        disabled={tab.disabled}
        role="tab"
        aria-selected={isActive}
        aria-disabled={tab.disabled}
        tabIndex={isActive ? 0 : -1}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing?.spacing?.sm || '8px' }}>
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge && tab.badge > 0 && this.renderBadge(tab.badge)}
        </div>
      </button>
    );
  };

  /**
   * Render tab content panel
   */
  private renderTabContent = (): ReactNode => {
    const { tabs, showContent = true, contentClassName = '' } = this.props;
    const { activeTabId, isTransitioning } = this.state;

    if (!showContent) {
      return null;
    }

    const activeTab = tabs.find(tab => tab.id === activeTabId);

    if (!activeTab || !activeTab.content) {
      return null;
    }

    const theme = useTheme();

    return (
      <div 
        css={[
          tabContentContainerStyles(theme, this.props.orientation || 'horizontal'),
          tabPanelStyles(theme, isTransitioning)
        ]}
        role="tabpanel"
        aria-labelledby={`tab-${activeTabId}`}
        className={contentClassName}
      >
        {activeTab.content}
      </div>
    );
  };

  override render(): ReactNode {
    const { tabs, disabled = false, className = '', variant = 'default', orientation = 'horizontal' } = this.props;
    const { activeTabId } = this.state;

    if (tabs.length === 0) {
      return null;
    }

    const theme = useTheme();

    return (
      <div
        css={[
          tabNavigationContainerStyles(theme),
          tabNavigationResponsiveStyles(theme)
        ]}
        className={className}
      >
        {/* Tab Navigation */}
        <div 
          css={tabListStyles(theme, variant, orientation)}
          role="tablist"
          aria-disabled={disabled}
        >
          {tabs.map((tab) => this.renderTab(tab, tab.id === activeTabId))}
        </div>

        {/* Tab Content */}
        {this.renderTabContent()}
      </div>
    );
  }
}

export default TabNavigation;
