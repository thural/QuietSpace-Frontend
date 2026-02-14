/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IFilterTabsProps, IFilterTab, IFilterTabsState } from './interfaces';
import {
  filterTabsContainerStyles,
  filterTabButtonStyles,
  filterTabBadgeStyles,
  filterTabsResponsiveStyles
} from './styles';

/**
 * FilterTabs Component
 * 
 * Enterprise-grade filter tabs component with comprehensive theme integration,
 * animations, accessibility features, and responsive design.
 */
export class FilterTabs extends PureComponent<IFilterTabsProps, IFilterTabsState> {
  static defaultProps: Partial<IFilterTabsProps> = {
    variant: 'default',
    size: 'md',
    fullWidth: false,
    showBadge: true,
    disabled: false,
  };

  constructor(props: IFilterTabsProps) {
    super(props);

    const { activeTabId, defaultTabId, tabs } = props;

    // Determine initial active tab
    const initialTabId = activeTabId || defaultTabId || (tabs.length > 0 ? tabs[0].id : '');

    this.state = {
      activeTabId: initialTabId,
      isAnimating: false
    };
  }

  /**
   * Handle tab click
   */
  private handleTabClick = (tabId: string): void => {
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

    // Trigger animation
    this.setState({ isAnimating: true });

    // Change active tab
    this.setState({ 
      activeTabId: tabId,
      isAnimating: false 
    });

    // Call callback
    if (onTabChange) {
      onTabChange(tabId);
    }
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
          this.handleTabClick(prevTab.id);
        }
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        const nextTab = tabs[nextIndex];
        if (nextTab && !nextTab.disabled) {
          this.handleTabClick(nextTab.id);
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        this.handleTabClick(tabId);
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
      <span css={filterTabBadgeStyles(theme)}>
        {badge > 99 ? '99+' : badge}
      </span>
    );
  };

  /**
   * Render individual filter tab
   */
  private renderTab = (tab: IFilterTab, isActive: boolean): ReactNode => {
    const { 
      variant = 'default', 
      size = 'md', 
      fullWidth = false,
      showBadge = true 
    } = this.props;
    const theme = useTheme();

    return (
      <button
        key={tab.id}
        css={filterTabButtonStyles(
          theme, 
          isActive, 
          variant, 
          size, 
          tab.disabled || false,
          fullWidth
        )}
        onClick={() => this.handleTabClick(tab.id)}
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
          {showBadge && tab.badge && tab.badge > 0 && this.renderBadge(tab.badge)}
        </div>
      </button>
    );
  };

  override render(): ReactNode {
    const { 
      tabs, 
      disabled = false, 
      className = '', 
      variant = 'default',
      fullWidth = false 
    } = this.props;
    const { activeTabId } = this.state;

    if (tabs.length === 0) {
      return null;
    }

    const theme = useTheme();

    return (
      <div
        css={[
          filterTabsContainerStyles(theme, variant, fullWidth),
          filterTabsResponsiveStyles(theme)
        ]}
        className={className}
        role="tablist"
        aria-disabled={disabled}
      >
        {tabs.map((tab) => this.renderTab(tab, tab.id === activeTabId))}
      </div>
    );
  }
}

export default FilterTabs;
