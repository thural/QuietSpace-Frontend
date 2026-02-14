/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, MouseEvent } from 'react';
import { menuContainerStyles, menuIconStyles, menuContentStyles } from './styles';
import { IListMenuProps } from './interfaces';

/**
 * ListMenu Component State Interface
 */
interface IListMenuState {
  /** Controls the display state of the menu */
  display: string;
}

/**
 * Enterprise ListMenu Component
 * 
 * A versatile dropdown menu component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <ListMenu 
 *   menuIcon={<MenuIcon />}
 *   styleProps={{ width: '250px' }}
 * >
 *   <MenuItem>Option 1</MenuItem>
 *   <MenuItem>Option 2</MenuItem>
 * </ListMenu>
 * ```
 */
class ListMenu extends PureComponent<IListMenuProps, IListMenuState> {
  constructor(props: IListMenuProps) {
    super(props);
    this.state = {
      display: "none" // State to manage menu visibility
    };
  }

  /**
   * Toggles display state of the menu
   * 
   * @param event - Mouse event triggered by the click
   */
  private toggleDisplay = (event: MouseEvent): void => {
    event.stopPropagation(); // Prevent event from bubbling up
    const { display } = this.state;
    this.setState({ display: display === "none" ? "block" : "none" }); // Toggle display state
  };

  /**
   * Hides menu when clicked
   * 
   * @param event - Mouse event triggered by the click
   */
  private hideMenu = (event: MouseEvent): void => {
    event.stopPropagation(); // Prevent event from bubbling up
    this.setState({ display: "none" }); // Set display to none
  };

  /**
   * Renders the list menu with enterprise styling
   * 
   * @returns JSX element representing the list menu
   */
  override render(): ReactNode {
    const { menuIcon, styleProps, children } = this.props;
    const { display } = this.state;

    return (
      <div css={menuContainerStyles(undefined)}>
        <div css={menuIconStyles(undefined)} onClick={this.toggleDisplay}>{menuIcon}</div>
        <div
          css={menuContentStyles(undefined, { ...styleProps, display })}
          onClick={this.hideMenu}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default ListMenu;
