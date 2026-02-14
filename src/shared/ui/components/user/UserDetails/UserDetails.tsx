/**
 * UserDetails Component
 * 
 * Enterprise-grade class-based component for displaying user information
 * with comprehensive theme integration, responsive design, and animations.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentState } from '../../../../components/base/BaseClassComponent';
import { IUserDetailsProps, IUserDetailsState } from './interfaces/IUserDetails';
import {
  userDetailsContainerStyles,
  userNameStyles,
  userEmailStyles,
  userDetailsWrapperStyles,
  userDetailsResponsiveStyles,
  userDetailsScaleStyles,
  userDetailsAnimationStyles
} from './styles/UserDetails.styles';

/** @jsxImportSource @emotion/react */

/**
 * UserDetails Component Class
 * 
 * Displays user information with configurable styling and responsive behavior.
 * Follows enterprise patterns with theme integration and accessibility support.
 */
export class UserDetails extends BaseClassComponent<IUserDetailsProps, IUserDetailsState & IBaseComponentState> {
  /**
   * Get initial state for component
   */
  protected override getInitialState(): Partial<IUserDetailsState & IBaseComponentState> {
    const { scale = 3 } = this.props;

    // Determine the effective size based on the scale prop
    const effectiveSize = (() => {
      if (typeof scale !== "number") return 3; // Default size
      return scale < 1 ? 1 : scale > 6 ? 6 : scale; // Limit scale between 1 and 6
    })();

    // Calculate the font size based on the determined scale
    const calculatedFontSize = (() => {
      const value = 3 / effectiveSize; // Base font size divided by scale
      const normalizedSize = value < 0.8 ? 0.8 : value > 2 ? 2 : value; // Normalize font size
      return `${normalizedSize}rem`;
    })();

    const headingMap = {
      1: 'h1' as const,
      2: 'h2' as const,
      3: 'h3' as const,
      4: 'h4' as const,
      5: 'h5' as const,
      6: 'h6' as const
    };

    const headingType = headingMap[effectiveSize as keyof typeof headingMap];

    return {
      size: effectiveSize,
      fontSize: calculatedFontSize,
      heading: headingType
    };
  }

  /**
   * Update state when props change
   */
  protected override onUpdate(prevProps: IUserDetailsProps): void {
    const { scale = 3 } = this.props;
    const { scale: prevScale = 3 } = prevProps;

    if (scale !== prevScale) {
      // Recalculate size and font size if scale changes
      const effectiveSize = (() => {
        if (typeof scale !== "number") return 3;
        return scale < 1 ? 1 : scale > 6 ? 6 : scale;
      })();

      const calculatedFontSize = (() => {
        const value = 3 / effectiveSize;
        const normalizedSize = value < 0.8 ? 0.8 : value > 2 ? 2 : value;
        return `${normalizedSize}rem`;
      })();

      const headingMap = {
        1: 'h1' as const,
        2: 'h2' as const,
        3: 'h3' as const,
        4: 'h4' as const,
        5: 'h5' as const,
        6: 'h6' as const
      };

      const headingType = headingMap[effectiveSize as keyof typeof headingMap];

      this.safeSetState({
        size: effectiveSize,
        fontSize: calculatedFontSize,
        heading: headingType
      });
    }
  }

  /**
   * Render main content
   */
  protected override renderContent(): React.ReactNode {
    const { user, isDisplayEmail = true, isDisplayName = true, children, className, testId } = this.props;

    if (!user) {
      return null;
    }

    return (
      <div
        css={userDetailsContainerStyles(undefined)}
        className={`user-details ${className || ''}`}
        data-testid={testId || 'user-details'}
        role="article"
        aria-label={`User details for ${user.username || user.email}`}
      >
        {this.renderUserInfo()}
        {children}
      </div>
    );
  }

  /**
   * Render user information
   */
  private renderUserInfo(): React.ReactNode {
    const { user, isDisplayEmail = true, isDisplayName = true } = this.props;
    const { size } = this.state;

    return (
      <div css={userDetailsWrapperStyles(undefined)}>
        {isDisplayName && user?.username && (
          <h3 css={userNameStyles(undefined, size / 3)} className="username">
            {user.username}
          </h3>
        )}
        {isDisplayEmail && user?.email && (
          <p css={userEmailStyles(undefined, size / 3)} className="email">
            {user.email}
          </p>
        )}
      </div>
    );
  }
}

export default UserDetails;
