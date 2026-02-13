/**
 * Enterprise Tabs Component
 * 
 * A versatile tabs component that replaces the original Tabs component
 * with enhanced theme integration and enterprise patterns.
 */

import { Children, PureComponent, ReactNode, isValidElement } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { getBorderWidth, getColor, getSpacing, getTransition, getTypography } from '../utils';

const TabsContainer = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TabsList = styled.div<{ theme: any; justify?: 'center' | 'start' | 'end'; grow?: boolean }>`
  display: flex;
  justify-content: ${props => props.justify || 'start'};
  ${props => props.grow && 'flex: 1;'}
  border-bottom: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.light')};
  margin-bottom: ${props => getSpacing(props.theme, 'md')};
`;

const TabButton = styled.button<{ theme: any; active?: boolean; color?: string }>`
  background: none;
  border: none;
  padding: ${props => getSpacing(props.theme, 'sm')} ${props => getSpacing(props.theme, 'lg')};
  cursor: pointer;
  font-size: ${props => getTypography(props.theme, 'fontSize.base')};
  color: ${props => props.active ?
        getColor(props.theme, props.color || 'brand.500') :
        getColor(props.theme, 'text.secondary')};
  border-bottom: ${props => getBorderWidth(props.theme, 'md')} solid ${props => props.active ?
        getColor(props.theme, props.color || 'brand.500') :
        'transparent'};
  transition: ${props => getTransition(props.theme, 'all', 'fast', 'ease')};
  display: flex;
  align-items: center;
  gap: ${props => getSpacing(props.theme, 'sm')};

  &:hover {
    color: ${props => getColor(props.theme, props.color || 'brand.500')};
    background-color: ${props => getColor(props.theme, 'background.secondary')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${props => getSpacing(props.theme, 2)} solid ${props => getColor(props.theme, 'brand.200')};
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
            <TabButton disabled={disabled} theme={undefined}>
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
            <TabsList justify={justify} grow={grow} theme={undefined}>
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
