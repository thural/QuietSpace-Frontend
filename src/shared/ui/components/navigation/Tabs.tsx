/**
 * Enterprise Tabs Component
 * 
 * A versatile tabs component that replaces the original Tabs component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { useState, ReactNode } from 'react';
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
export interface TabProps {
    value: string;
    label?: ReactNode;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    disabled?: boolean;
}

export interface TabsProps extends BaseComponentProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    color?: string;
    justify?: 'center' | 'start' | 'end';
    grow?: boolean;
    children: ReactNode;
}

export interface TabsListProps {
    children: ReactNode;
    justify?: 'center' | 'start' | 'end';
    grow?: boolean;
}

export interface TabPanelProps {
    value: string;
    children: ReactNode;
}

// Individual Tab component
export const Tab: React.FC<TabProps> = ({ value, label, leftSection, rightSection, disabled }) => {
    return (
        <TabButton disabled={disabled}>
            {leftSection}
            {label}
            {rightSection}
        </TabButton>
    );
};

// TabsList component
export const TabsListInternal: React.FC<TabsListProps> = ({ children, justify, grow }) => {
    return (
        <TabsList justify={justify} grow={grow}>
            {children}
        </TabsList>
    );
};

// TabPanel component
export const TabPanelInternal: React.FC<TabPanelProps> = ({ value, children }) => {
    return (
        <div style={{ display: 'none' }}>
            {children}
        </div>
    );
};

// Main Tabs component
const TabsInternal: React.FC<TabsProps> = ({
    defaultValue,
    value: controlledValue,
    onValueChange,
    color,
    justify,
    grow,
    children,
    className,
    testId,
    ...props
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    const handleTabClick = (tabValue: string) => {
        if (isControlled && onValueChange) {
            onValueChange(tabValue);
        } else if (!isControlled) {
            setInternalValue(tabValue);
        }
    };

    // Extract tabs and panels from children
    const tabs: ReactNode[] = [];
    const panels: ReactNode[] = [];
    let activeTabFound = false;

    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
            if (child.type === TabsListInternal) {
                React.Children.forEach(child.props.children, (listChild) => {
                    if (React.isValidElement(listChild) && listChild.type === Tab) {
                        const isActive = listChild.props.value === activeValue;
                        tabs.push(
                            <TabButton
                                key={listChild.props.value}
                                active={isActive}
                                color={color}
                                onClick={() => handleTabClick(listChild.props.value)}
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

    return (
        <TabsContainer className={className} data-testid={testId} {...props}>
            <TabsList justify={justify} grow={grow}>
                {tabs}
            </TabsList>
            {panels}
        </TabsContainer>
    );
};

// Create component with sub-components
const TabsComponent = TabsInternal as typeof TabsInternal & {
    List: typeof TabsListInternal;
    Tab: typeof Tab;
    Panel: typeof TabPanelInternal;
};

TabsComponent.List = TabsListInternal;
TabsComponent.Tab = Tab;
TabsComponent.Panel = TabPanelInternal;

export { TabsComponent as Tabs };
export default TabsComponent;
