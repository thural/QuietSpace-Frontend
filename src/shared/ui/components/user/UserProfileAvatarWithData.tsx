/**
 * User Profile Avatar with Data Component
 * 
 * A bridge component that provides the same API as UserAvatarPhoto
 * but uses UserProfileAvatar internally for migration purposes.
 */

import React from 'react';
import { ResId } from "@/shared/api/models/commonNative";
import { UserProfileAvatar } from "@/shared/ui/components";

/**
 * User Profile Avatar with Data Props
 */
interface IUserProfileAvatarWithDataProps {
  userId: ResId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
  showStatus?: boolean;
  showName?: boolean;
  showUsername?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  shape?: 'circle' | 'square' | 'rounded';
  statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  useTheme?: boolean;
}

/**
 * User Profile Avatar with Data component.
 * 
 * This component provides the same API as UserAvatarPhoto
 * but uses UserProfileAvatar internally for migration purposes.
 * For now, it displays user initials without fetching data.
 * 
 * @param {IUserProfileAvatarWithDataProps} props - The component props.
 * @returns {JSX.Element} - The rendered component.
 */
const UserProfileAvatarWithData: React.FC<IUserProfileAvatarWithDataProps> = ({
  userId,
  size = "md",
  showStatus = false,
  showName = false,
  showUsername = false,
  clickable = false,
  onClick,
  shape = "circle",
  statusPosition = "bottom-right",
  useTheme = true
}) => {
  // For now, just display initials based on userId
  // In a real implementation, this would fetch user data
  const initials = `U${userId.toString().slice(-2)}`;

  return (
    <UserProfileAvatar
      name={initials}
      size={size}
      showStatus={showStatus}
      showName={showName}
      showUsername={showUsername}
      clickable={clickable}
      onClick={onClick || (() => { })}
      fallback={initials}
      shape={shape}
      statusPosition={statusPosition}
      useTheme={useTheme}
    />
  );
};

export default UserProfileAvatarWithData;
