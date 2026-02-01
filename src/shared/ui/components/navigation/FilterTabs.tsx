/**
 * Filter Tabs Component
 * 
 * A reusable tab-based filtering component with active state management
 * and flexible styling options. Provides tab navigation for filtering.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Filter Tab interface
 */
export interface IFilterTab {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

/**
 * Filter Tabs Props
 */
export interface IFilterTabsProps extends IBaseComponentProps {
  tabs: IFilterTab[];
  activeTabId?: string;
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showBadge?: boolean;
}

/**
 * Filter Tabs State
 */
export interface IFilterTabsState extends IBaseComponentState {
  activeTabId: string;
  isAnimating: boolean;
}

/**
 * Filter Tabs Component
 * 
 * Provides tab-based filtering with:
 * - Multiple tab variants (default, pills, underline)
 * - Badge support for tab counts
 * - Active state management with animations
 * - Keyboard navigation support
 * - Responsive design and accessibility
 * - Flexible styling and sizing options
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class FilterTabs extends BaseClassComponent<IFilterTabsProps, IFilterTabsState> {
  
  protected override getInitialState(): Partial<IFilterTabsState> {
    const { activeTabId, defaultTabId, tabs } = this.props;

    // Determine initial active tab
    const initialTabId = activeTabId || defaultTabId || (tabs.length > 0 ? tabs[0].id : '');

    return {
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
    this.safeSetState({ isAnimating: true });

    // Change active tab
    this.safeSetState({ 
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
        if (!prevTab.disabled) {
          this.handleTabClick(prevTab.id);
        }
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        const nextTab = tabs[nextIndex];
        if (!nextTab.disabled) {
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
   * Get tab styles based on variant and state
   */
  private getTabStyles = (tab: IFilterTab, isActive: boolean): string => {
    const { variant = 'default', size = 'md', fullWidth = false } = this.props;
    const { isAnimating } = this.state;

    const baseStyles = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    
    const sizeStyles = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantStyles = {
      default: isActive
        ? 'bg-blue-500 text-white shadow-sm'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      
      pills: isActive
        ? 'bg-blue-500 text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full',
      
      underline: isActive
        ? 'text-blue-600 border-b-2 border-blue-500 bg-transparent'
        : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent bg-transparent'
    };

    const disabledStyles = tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    const widthStyles = fullWidth ? 'flex-1' : '';

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${widthStyles}`;
  };

  /**
   * Get container styles based on variant
   */
  private getContainerStyles = (): string => {
    const { variant = 'default', fullWidth = false, className = '' } = this.props;

    const baseStyles = 'flex';
    const variantStyles = {
      default: 'space-x-1',
      pills: 'space-x-2',
      underline: 'space-x-6 border-b border-gray-200'
    };
    const widthStyles = fullWidth ? 'w-full' : '';

    return `${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`;
  };

  /**
   * Render badge
   */
  private renderBadge = (badge: number): React.ReactNode => {
    return (
      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        {badge > 99 ? '99+' : badge}
      </span>
    );
  };

  /**
   * Render tab
   */
  private renderTab = (tab: IFilterTab, isActive: boolean): React.ReactNode => {
    const { showBadge = true } = this.props;

    return (
      <button
        key={tab.id}
        onClick={() => this.handleTabClick(tab.id)}
        onKeyDown={(e) => this.handleKeyDown(e, tab.id)}
        disabled={tab.disabled}
        className={this.getTabStyles(tab, isActive)}
        role="tab"
        aria-selected={isActive}
        aria-disabled={tab.disabled}
        tabIndex={isActive ? 0 : -1}
      >
        <div className="flex items-center space-x-2">
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
          {showBadge && tab.badge && tab.badge > 0 && this.renderBadge(tab.badge)}
        </div>
      </button>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { tabs, disabled = false } = this.props;
    const { activeTabId } = this.state;

    if (tabs.length === 0) {
      return null;
    }

    return (
      <div 
        className={this.getContainerStyles()}
        role="tablist"
        aria-disabled={disabled}
      >
        {tabs.map((tab) => this.renderTab(tab, tab.id === activeTabId))}
      </div>
    );
  }
}

export default FilterTabs;
