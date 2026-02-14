/**
 * Enterprise Tabs Component
 * 
 * A versatile tabs component that replaces the original Tabs component
 * with enhanced theme integration and enterprise patterns.
 */

/** @jsxImportSource @emotion/react */
import { Children, PureComponent, ReactNode, isValidElement } from 'react';
import { css } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { getBorderWidth, getColor, getSpacing, getTransition, getTypography } from '../utils';

const tabsContainerStyles = () => css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const tabsListStyles = (theme?: any, justify?: 'center' | 'start' | 'end', grow?: boolean) => css`
  display: flex;
  justify-content: ${justify || 'start'};
  ${grow && 'flex: 1;'}
  border-bottom: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.light')};
  margin-bottom: ${getSpacing(theme, 'md')};
`;

const tabButtonStyles = (theme?: any, active?: boolean, color?: string) => css`
  background: none;
  border: none;
  padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')};
  cursor: pointer;
  font-size: ${getTypography(theme, 'fontSize.base')};
  color: ${active ?
        getColor(theme, color || 'brand.500') :
        getColor(theme, 'text.secondary')};
  border-bottom: ${getBorderWidth(theme, 'md')} solid ${active ?
        getColor(theme, color || 'brand.500') :
        'transparent'};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'sm')};

  &:hover {
    color: ${getColor(theme, color || 'brand.500')};
    background-color: ${getColor(theme, 'background.secondary')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, 2)} solid ${getColor(theme, 'brand.200')};
  }
`;

const tabPanelStyles = (theme?: any, active?: boolean) => css`
  display: ${active ? 'block' : 'none'};
  width: 100%;
`;

// Props interfaces
export interface ITabProps {
    value: string;
    label?: ReactNode;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    disabled?: boolean;
}

export interface ITabsProps extends BaseComponentProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    color?: string;
    justify?: 'center' | 'start' | 'end';
    grow?: boolean;
    children: ReactNode;
}

export interface ITabsListProps {
    children: ReactNode;
    justify?: 'center' | 'start' | 'end';
    grow?: boolean;
}

export interface ITabPanelProps {
    value: string;
    children: ReactNode;
}

interface ITabsState {
    internalValue: string;
}

// Individual Tab component
class Tab extends PureComponent<ITabProps> {
    override render(): ReactNode {
        const { value, label, leftSection, rightSection, disabled } = this.props;

        return (
            <button
                css={tabButtonStyles(undefined, false, undefined)}
                disabled={disabled}
            >
                {leftSection}
                {label}
                {rightSection}
            </button>
        );
    }
}

// TabsList component
class TabsListInternal extends PureComponent<ITabsListProps> {
    override render(): ReactNode {
        const { children, justify, grow } = this.props;

        return (
            <div css={tabsListStyles(undefined, justify, grow)}>
                {children}
            </div>
        );
    }
}

// TabPanel component
class TabPanelInternal extends PureComponent<ITabPanelProps> {
    override render(): ReactNode {
        const { value, children } = this.props;

        return (
            <div css={tabPanelStyles(undefined, false)} style={{ display: 'none' }}>
                {children}
            </div>
        );
    }
}

// Main Tabs component
class TabsInternal extends PureComponent<ITabsProps, ITabsState> {
    constructor(props: ITabsProps) {
        super(props);

        const { defaultValue = '' } = props;
        this.state = {
            internalValue: defaultValue
        };
    }

    /**
     * Handle tab click
     */
    private handleTabClick = (tabValue: string): void => {
        const { value: controlledValue, onValueChange } = this.props;
        const { internalValue } = this.state;
        const isControlled = controlledValue !== undefined;

        if (isControlled && onValueChange) {
            onValueChange(tabValue);
        } else if (!isControlled) {
            this.setState({ internalValue: tabValue });
        }
    };

    /**
     * Get active value
     */
    private getActiveValue = (): string => {
        const { value: controlledValue } = this.props;
        const { internalValue } = this.state;
        const isControlled = controlledValue !== undefined;
        return isControlled ? controlledValue : internalValue;
    };

    /**
     * Process children to extract tabs and panels
     */
    private processChildren = (): { tabs: ReactNode[]; panels: ReactNode[] } => {
        const { children, color } = this.props;
        const activeValue = this.getActiveValue();
        const tabs: ReactNode[] = [];
        const panels: ReactNode[] = [];
        let activeTabFound = false;

        Children.forEach(children, (child) => {
            if (isValidElement(child)) {
                if (child.type === TabsListInternal) {
                    Children.forEach(child.props.children, (listChild) => {
                        if (isValidElement(listChild) && listChild.type === Tab) {
                            const isActive = listChild.props.value === activeValue;
                            tabs.push(
                                <button
                                    key={listChild.props.value}
                                    css={tabButtonStyles(undefined, listChild.props.value === activeValue, color)}
                                    onClick={() => this.handleTabClick(listChild.props.value)}
                                    disabled={listChild.props.disabled}
                                >
                                    {listChild.props.leftSection}
                                    {listChild.props.label}
                                    {listChild.props.rightSection}
                                </button>
                            );
                            if (isActive) activeTabFound = true;
                        }
                    });
                } else if (child.type === TabPanelInternal) {
                    const isActive = child.props.value === activeValue;
                    panels.push(
                        <div key={child.props.value} css={tabPanelStyles(undefined, child.props.value === activeValue)}>
                            {child.props.children}
                        </div>
                    );
                }
            }
        });

        return { tabs, panels };
    };

    override render(): ReactNode {
        const {
            color,
            justify,
            grow,
            className,
            testId,
            ...props
        } = this.props;

        const { tabs, panels } = this.processChildren();

        return (
            <div css={tabsContainerStyles()} className={className} data-testid={testId} {...props}>
                <div css={tabsListStyles(undefined, justify, grow)}>
                    {tabs}
                </div>
                {panels}
            </div>
        );
    }
}

// Create component with sub-components
class TabsComponent extends PureComponent<ITabsProps, ITabsState> {
    static List = TabsListInternal;
    static Tab = Tab;
    static Panel = TabPanelInternal;

    constructor(props: ITabsProps) {
        super(props);
        this.state = {
            internalValue: props.defaultValue || ''
        };
    }

    /**
     * Handle tab click
     */
    private handleTabClick = (tabValue: string): void => {
        const { value: controlledValue, onValueChange } = this.props;
        const { internalValue } = this.state;
        const isControlled = controlledValue !== undefined;

        if (isControlled && onValueChange) {
            onValueChange(tabValue);
        } else if (!isControlled) {
            this.setState({ internalValue: tabValue });
        }
    };

    /**
     * Get active value
     */
    private getActiveValue = (): string => {
        const { value: controlledValue } = this.props;
        const { internalValue } = this.state;
        const isControlled = controlledValue !== undefined;
        return isControlled ? controlledValue : internalValue;
    };

    /**
     * Process children to extract tabs and panels
     */
    private processChildren = (): { tabs: ReactNode[]; panels: ReactNode[] } => {
        const { children, color } = this.props;
        const activeValue = this.getActiveValue();
        const tabs: ReactNode[] = [];
        const panels: ReactNode[] = [];
        let activeTabFound = false;

        Children.forEach(children, (child) => {
            if (isValidElement(child)) {
                if (child.type === TabsListInternal) {
                    Children.forEach(child.props.children, (listChild) => {
                        if (isValidElement(listChild) && listChild.type === Tab) {
                            const isActive = listChild.props.value === activeValue;
                            tabs.push(
                                <button
                                    key={listChild.props.value}
                                    css={tabButtonStyles(undefined, listChild.props.value === activeValue, color)}
                                    onClick={() => this.handleTabClick(listChild.props.value)}
                                    disabled={listChild.props.disabled}
                                >
                                    {listChild.props.leftSection}
                                    {listChild.props.label}
                                    {listChild.props.rightSection}
                                </button>
                            );
                            if (isActive) activeTabFound = true;
                        }
                    });
                } else if (child.type === TabPanelInternal) {
                    const isActive = child.props.value === activeValue;
                    panels.push(
                        <div key={child.props.value} css={tabPanelStyles(undefined, child.props.value === activeValue)}>
                            {child.props.children}
                        </div>
                    );
                }
            }
        });

        return { tabs, panels };
    };

    override render(): ReactNode {
        const {
            color,
            justify,
            grow,
            className,
            testId,
            ...props
        } = this.props;

        const { tabs, panels } = this.processChildren();

        return (
            <div css={tabsContainerStyles()} className={className} data-testid={testId} {...props}>
                <div css={tabsListStyles(undefined, justify, grow)}>
                    {tabs}
                </div>
                {panels}
            </div>
        );
    }
}

// Assign static sub-components
TabsComponent.List = TabsListInternal;
TabsComponent.Tab = Tab;
TabsComponent.Panel = TabPanelInternal;

export { TabsComponent as Tabs };
export default TabsComponent;
