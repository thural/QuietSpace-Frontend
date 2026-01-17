/**
 * Global User Avatar Widget.
 * 
 * Reusable avatar component used across multiple features.
 * Provides consistent avatar display with fallback to initials.
 */

import React from 'react';
import styled from 'styled-components';
import { User } from '../../domain/entities/User';

interface UserAvatarProps {
  user: User;
  size?: number;
  onClick?: () => void;
  className?: string;
}

const AvatarContainer = styled.div<{ size?: number }>`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const InitialsContainer = styled.div`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => (props.size || 40) * 0.4}px;
`;

/**
 * User Avatar Component
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 40,
  onClick,
  className 
}) => {
  const handleAvatarClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getInitials = () => {
    const names = user.getDisplayName().split(' ');
    return names.map(name => name.charAt(0).toUpperCase()).join('');
  };

  const getAvatarUrl = () => {
    if (user.hasAvatar()) {
      return user.avatar;
    }
    return null;
  };

  return (
    <AvatarContainer 
      size={size} 
      onClick={handleAvatarClick}
      className={className}
      title={`${user.getDisplayName()}'s avatar`}
    >
      {getAvatarUrl() ? (
        <img 
          src={getAvatarUrl()} 
          alt={`${user.getDisplayName()}'s avatar`}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            borderRadius: '50%'
          }} 
        />
      ) : (
        <InitialsContainer size={size}>
          {getInitials()}
        </InitialsContainer>
      )}
    </AvatarContainer>
  );
};

export default UserAvatar;
