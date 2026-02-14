/** @jsxImportSource @emotion/react */
import { Children, PureComponent, ReactNode, isValidElement } from 'react';
import { useTheme } from '@/core/modules/theming';
import { ITabsProps, ITabProps, ITabsListProps, ITabPanelProps, ITabsState } from './interfaces';
import {
  tabsContainerStyles,
  tabsListStyles,
  tabButtonStyles,
  tabPanelStyles,
  tabsResponsiveStyles
} from './styles';

/**
 * Individual Tab component
 */
class Tab extends PureComponent<ITabProps> {
  override render(): ReactNode {
    const { value, label, leftSection, rightSection, disabled } = this.props;
    const theme = useTheme();

    return (
      <button
        css={tabButtonStyles(theme, false, undefined)}
        disabled={disabled}
      >
        {leftSection}
        {label}
        {rightSection}
      </button>
    );
  }
}

/**
 * TabsList component
 */
class TabsListInternal extends PureComponent<ITabsListProps> {
  override render(): ReactNode {
    const { children, justify, grow } = this.props;
    const theme = useTheme();

    return (
      <div css={tabsListStyles(theme, justify, grow)}>
        {children}
      </div>
    );
  }
}

/**
 * TabPanel component
 */
class TabPanelInternal extends PureComponent<ITabPanelProps> {
  override render(): ReactNode {
    const { value, children } = this.props;
    const theme = useTheme();

    return (
      <div css={tabPanelStyles(theme, false)} style={{ display: 'none' }}>
        {children}
      </div>
    );
  }
}

/**
 * Tabs Component
 * 
 * Enterprise-grade tabs component with comprehensive theme integration,
 * animations, accessibility features, and responsive design.
 */
export class Tabs extends PureComponent<ITabsProps, ITabsState> {
  static defaultProps: Partial<ITabsProps> = {
    defaultValue: '',
    justify: 'start',
    grow: false,
  };

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
    const theme = useTheme();

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        if (child.type === TabsListInternal) {
          Children.forEach(child.props.children, (listChild) => {
            if (isValidElement(listChild) && listChild.type === Tab) {
              const isActive = listChild.props.value === activeValue;
              tabs.push(
                <button
                  key={listChild.props.value}
                  css={tabButtonStyles(theme, listChild.props.value === activeValue, color)}
                  onClick={() => this.handleTabClick(listChild.props.value)}
                  disabled={listChild.props.disabled}
                >
                  {listChild.props.leftSection}
                  {listChild.props.label}
                  {listChild.props.rightSection}
                </button>
              );
            }
          });
        } else if (child.type === TabPanelInternal) {
          const isActive = child.props.value === activeValue;
          panels.push(
            <div key={child.props.value} css={tabPanelStyles(theme, child.props.value === activeValue)}>
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
      id,
      onClick,
      style,
      children
    } = this.props;

    const theme = useTheme();
    const { tabs, panels } = this.processChildren();

    return (
      <div
        css={[
          tabsContainerStyles(),
          tabsResponsiveStyles(theme)
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        <div css={tabsListStyles(theme, justify, grow)}>
          {tabs}
        </div>
        {panels}
      </div>
    );
  }

  // Static sub-components
  static List = TabsListInternal;
  static Tab = Tab;
  static Panel = TabPanelInternal;
}

export default Tabs;
