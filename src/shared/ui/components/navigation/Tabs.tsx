/**
 * Enterprise Tabs Component
 * 
 * A versatile tabs component that replaces the original Tabs component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode, isValidElement, Children } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
const TabsContainer = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TabsList = styled.div<{ theme: any; justify?: 'center' | 'start' | 'end'; grow?: boolean }>`
  display: flex;
  justify-content: ${props => props.justify || 'start'};
  ${props => props.grow && 'flex: 1;'}
  border-bottom: 1px solid ${props => props.theme.colors?.border || '#e0e0e0'};
  margin-bottom: ${props => props.theme.spacing(props.theme.spacingFactor.md)};
`;

const TabButton = styled.button<{ theme: any; active?: boolean; color?: string }>`
  background: none;
  border: none;
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.sm)} ${props => props.theme.spacing(props.theme.spacingFactor.lg)};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.primary};
  color: ${props => props.active ?
        (props.color || props.theme.colors?.primary || '#007bff') :
        props.theme.colors?.textSecondary || '#666'};
  border-bottom: 2px solid ${props => props.active ?
        (props.color || props.theme.colors?.primary || '#007bff') :
        'transparent'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(props.theme.spacingFactor.sm)};

  &:hover {
    color: ${props => props.color || props.theme.colors?.primary || '#007bff'};
    background-color: ${props => props.theme.colors?.backgroundSecondary || '#f5f5f5'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props => props.theme.colors?.primary || '#007bff') + '20'};
  }
`;

const TabPanel = styled.div<{ theme: any; active?: boolean }>`
  display: ${props => props.active ? 'block' : 'none'};
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
            <TabButton disabled={disabled}>
                {leftSection}
                {label}
                {rightSection}
            </TabButton>
        );
    }
}

// TabsList component
class TabsListInternal extends PureComponent<ITabsListProps> {
    override render(): ReactNode {
        const { children, justify, grow } = this.props;

        return (
            <TabsList justify={justify} grow={grow}>
                {children}
            </TabsList>
        );
    }
}

// TabPanel component
class TabPanelInternal extends PureComponent<ITabPanelProps> {
    override render(): ReactNode {
        const { value, children } = this.props;

        return (
            <div style={{ display: 'none' }}>
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
                                <TabButton
                                    key={listChild.props.value}
                                    active={isActive}
                                    color={color}
                                    onClick={() => this.handleTabClick(listChild.props.value)}
                                    disabled={listChild.props.disabled}
                                >
                                    {listChild.props.leftSection}
                                    {listChild.props.label}
                                    {listChild.props.rightSection}
                                </TabButton>
                            );
                            if (isActive) activeTabFound = true;
                        }
                    });
                } else if (child.type === TabPanelInternal) {
                    const isActive = child.props.value === activeValue;
                    panels.push(
                        <TabPanel key={child.props.value} active={isActive}>
                            {child.props.children}
                        </TabPanel>
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
            <TabsContainer className={className} data-testid={testId} {...props}>
                <TabsList justify={justify} grow={grow}>
                    {tabs}
                </TabsList>
                {panels}
            </TabsContainer>
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
                                <TabButton
                                    key={listChild.props.value}
                                    active={isActive}
                                    color={color}
                                    onClick={() => this.handleTabClick(listChild.props.value)}
                                    disabled={listChild.props.disabled}
                                >
                                    {listChild.props.leftSection}
                                    {listChild.props.label}
                                    {listChild.props.rightSection}
                                </TabButton>
                            );
                            if (isActive) activeTabFound = true;
                        }
                    });
                } else if (child.type === TabPanelInternal) {
                    const isActive = child.props.value === activeValue;
                    panels.push(
                        <TabPanel key={child.props.value} active={isActive}>
                            {child.props.children}
                        </TabPanel>
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
            <TabsContainer className={className} data-testid={testId} {...props}>
                <TabsList justify={justify} grow={grow}>
                    {tabs}
                </TabsList>
                {panels}
            </TabsContainer>
        );
    }
}

// Assign static sub-components
TabsComponent.List = TabsListInternal;
TabsComponent.Tab = Tab;
TabsComponent.Panel = TabPanelInternal;

export { TabsComponent as Tabs };
export default TabsComponent;
