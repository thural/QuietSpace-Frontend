/**
 * Tab Navigation Component
 * 
 * A reusable tab navigation component for multi-section interfaces.
 * Provides tab switching with content management and state handling.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Navigation Tab interface
 */
export interface INavigationTab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: number;
  content?: React.ReactNode;
}

/**
 * Tab Navigation Props
 */
export interface ITabNavigationProps extends IBaseComponentProps {
  tabs: INavigationTab[];
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'pills' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  showContent?: boolean;
  contentClassName?: string;
}

/**
 * Tab Navigation State
 */
export interface ITabNavigationState extends IBaseComponentState {
  activeTabId: string;
  isTransitioning: boolean;
}

/**
 * Tab Navigation Component
 * 
 * Provides tab navigation with:
 * - Multiple tab variants (default, pills, cards)
 * - Content management and transitions
 * - Badge support for tab notifications
 * - Horizontal and vertical orientations
 * - Keyboard navigation and accessibility
 * - Flexible styling and sizing options
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class TabNavigation extends BaseClassComponent<ITabNavigationProps, ITabNavigationState> {
  
  protected override getInitialState(): Partial<ITabNavigationState> {
    const { defaultTabId, tabs } = this.props;

    // Determine initial active tab
    const initialTabId = defaultTabId || (tabs.length > 0 ? tabs[0].id : '');

    return {
      activeTabId: initialTabId,
      isTransitioning: false
    };
  }

  /**
   * Handle tab change
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
    this.safeSetState({ isTransitioning: true });

    // Change active tab with transition
    setTimeout(() => {
      this.safeSetState({ 
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
   * Get tab styles based on variant and state
   */
  private getTabStyles = (tab: INavigationTab, isActive: boolean): string => {
    const { variant = 'default', size = 'md', orientation = 'horizontal' } = this.props;

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
        ? 'bg-blue-500 text-white shadow-md rounded-full'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full',
      
      cards: isActive
        ? 'bg-white text-blue-600 border-2 border-blue-500 shadow-md'
        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
    };

    const orientationStyles = orientation === 'vertical' ? 'w-full text-left' : '';
    const disabledStyles = tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${orientationStyles} ${disabledStyles}`;
  };

  /**
   * Get container styles based on variant and orientation
   */
  private getContainerStyles = (): string => {
    const { variant = 'default', orientation = 'horizontal', className = '' } = this.props;

    const baseStyles = orientation === 'vertical' ? 'flex flex-col space-y-1' : 'flex';
    const variantStyles = {
      default: orientation === 'vertical' ? 'space-y-1' : 'space-x-1',
      pills: orientation === 'vertical' ? 'space-y-2' : 'space-x-2',
      cards: orientation === 'vertical' ? 'space-y-3' : 'space-x-3'
    };

    return `${baseStyles} ${variantStyles[variant]} ${className}`;
  };

  /**
   * Get content container styles
   */
  private getContentContainerStyles = (): string => {
    const { orientation = 'horizontal', contentClassName = '' } = this.props;

    const baseStyles = 'mt-4';
    const orientationStyles = orientation === 'vertical' ? 'ml-4 mt-0' : '';

    return `${baseStyles} ${orientationStyles} ${contentClassName}`;
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
  private renderTab = (tab: INavigationTab, isActive: boolean): React.ReactNode => {
    return (
      <button
        key={tab.id}
        onClick={() => this.handleTabChange(tab.id)}
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
          {tab.badge && tab.badge > 0 && this.renderBadge(tab.badge)}
        </div>
      </button>
    );
  };

  /**
   * Render tab content
   */
  private renderTabContent = (): React.ReactNode => {
    const { tabs, showContent = true } = this.props;
    const { activeTabId, isTransitioning } = this.state;

    if (!showContent) {
      return null;
    }

    const activeTab = tabs.find(tab => tab.id === activeTabId);

    if (!activeTab || !activeTab.content) {
      return null;
    }

    return (
      <div 
        className={this.getContentContainerStyles()}
        role="tabpanel"
        aria-labelledby={`tab-${activeTabId}`}
      >
        <div className={`transition-opacity duration-150 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          {activeTab.content}
        </div>
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { tabs, disabled = false } = this.props;
    const { activeTabId } = this.state;

    if (tabs.length === 0) {
      return null;
    }

    return (
      <div className="tab-navigation">
        {/* Tab Navigation */}
        <div 
          className={this.getContainerStyles()}
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
