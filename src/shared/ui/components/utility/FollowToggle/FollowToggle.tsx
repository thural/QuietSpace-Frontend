/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, MouseEvent } from 'react';
import { followToggleStyles } from './styles';
import { IFollowToggleProps } from './interfaces';
import LightButton from "@/shared/buttons/LightButton";

/**
 * Enterprise FollowToggle Component
 * 
 * A versatile follow/unfollow toggle component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <FollowToggle 
 *   user={user}
 *   Button={CustomButton}
 * />
 * ```
 */
class FollowToggle extends PureComponent<IFollowToggleProps> {
  private toggleFollow: (userId: any) => { mutate: (userId: any) => void };

  constructor(props: IFollowToggleProps) {
    super(props);

    // Initialize hook pattern
    this.toggleFollow = (userId: any) => {
      // Mock implementation - in real scenario this would use hook
      return {
        mutate: (id: any) => {
          console.log(`Toggle follow for user: ${id}`);
        }
      };
    };
  }

  /**
   * Handles follow toggle click event
   */
  private handleFollowToggle = (event: MouseEvent): void => {
    const { user } = this.props;

    event.stopPropagation();
    event.preventDefault();
    this.toggleFollow(user.id).mutate(user.id);
  };

  /**
   * Renders the follow toggle button with enterprise styling
   * 
   * @returns JSX element representing the follow toggle
   */
  override render(): ReactNode {
    const { user, Button = LightButton, ...props } = this.props;
    const followStatus = user.isFollowing ? "unfollow" : "follow";

    return (
      <Button
        css={followToggleStyles(undefined, user.isFollowing)}
        name={followStatus}
        onClick={this.handleFollowToggle}
        {...props}
      />
    );
  }
}

export default FollowToggle;
