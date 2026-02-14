/**
 * Navigation Components Index
 * 
 * Exports all navigation components from the shared UI library.
 * Includes Breadcrumb, Pagination, Menu, Sidebar, Tabs, and future navigation-related components.
 */

export { Breadcrumb } from './Breadcrumb';
export type { IBreadcrumbProps, IBreadcrumbItem, IBreadcrumbSeparator } from './Breadcrumb';

export { Pagination } from './Pagination';
export type { IPaginationConfig, IPaginationProps } from './Pagination';

export { Menu } from './Menu';
export type { IMenuProps, IMenuItem, IMenuState } from './Menu';

export { Sidebar } from './Sidebar';
export type { ISidebarProps, ISidebarSection, ISidebarState } from './Sidebar';

export { Tabs } from './Tabs';
export type { ITabsProps, ITabProps, ITabsListProps, ITabPanelProps } from './Tabs';

export { SegmentedControl } from './SegmentedControl';
export type { ISegmentedControlProps, ISegmentedControlItem, ISegmentedControlState } from './SegmentedControl';

export { TabNavigation } from './TabNavigation';
export type { ITabNavigationProps, INavigationTab, ITabNavigationState } from './TabNavigation';

export { FilterTabs } from './FilterTabs';
export type { IFilterTabsProps, IFilterTab, IFilterTabsState } from './FilterTabs';
