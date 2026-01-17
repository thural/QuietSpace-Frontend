/**
 * Global User Avatar Widget.
 * 
 * Reusable avatar component used across multiple features.
 * Provides consistent avatar display with fallback to initials.
 * Enhanced with composable theme system and responsive design.
 */

import React from 'react';
import { User } from '../../domain/entities/User';
import { useThemeTokens } from '../../../core/theme';
import { useThemeResponsive } from '../../../platform_shell';
import { createStyledComponent } from '../../../core/theme';

interface UserAvatarProps {
  user: User;
  size?: number;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'circle' | 'square';
  responsive?: boolean;
}

const AvatarContainer = createStyledComponent('div')<{ 
  size?: number; 
  variant?: 'default' | 'circle' | 'square';
  responsive?: boolean;
  onClick?: () => void;
}>`
  ${({ theme, size = 40, variant = 'circle', responsive = true, onClick }) => {
    const baseStyles = `
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: ${onClick ? 'pointer' : 'default'};
      transition: all ${theme.animation.duration.fast} ${theme.animation.easing.ease};
      position: relative;
      overflow: hidden;
      
      &:hover {
        transform: scale(1.05);
        box-shadow: ${theme.shadows.md};
      }
    `;
    
    const variantStyles = {
      default: `
        border-radius: ${theme.radius.md};
        background: linear-gradient(135deg, ${theme.getColor('brand.500')}, ${theme.getColor('brand.600')});
      `,
      circle: `
        border-radius: ${theme.radius.full};
        background: linear-gradient(135deg, ${theme.getColor('brand.500')}, ${theme.getColor('brand.600')});
      `,
      square: `
        border-radius: ${theme.radius.md};
        background: linear-gradient(135deg, ${theme.getColor('brand.500')}, ${theme.getColor('brand.600')});
      `,
    };
    
    const responsiveStyles = responsive ? `
      @media (max-width: ${theme.breakpoints.md}) {
        width: ${Math.max(size * 0.8, 24)}px;
        height: ${Math.max(size * 0.8, 24)}px;
      }
    ` : '';
    
    return `
      ${baseStyles}
      ${variantStyles[variant]}
      ${responsiveStyles}
    `;
  }}
`;

const InitialsContainer = createStyledComponent('div')<{ 
  size?: number; 
  responsive?: boolean;
}>`
  ${({ theme, size = 40, responsive = true }) => `
    width: ${size}px;
    height: ${size}px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: ${theme.typography.fontWeight.semibold};
    font-size: ${Math.max(size * 0.4, 12)}px;
    line-height: 1;
    
    ${responsive && `
      @media (max-width: ${theme.breakpoints.md}) {
        width: ${Math.max(size * 0.8, 24)}px;
        height: ${Math.max(size * 0.8, 24)}px;
        font-size: ${Math.max(size * 0.32, 10)}px;
      }
    `}
  `}
`;

const AvatarImage = createStyledComponent('img')<{ responsive?: boolean }>`
  ${({ theme, responsive = true }) => `
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    
    ${responsive && `
      @media (max-width: ${theme.breakpoints.md}) {
        // Image will scale with container
      }
    `}
  `}
`;

/**
 * Enhanced User Avatar Component
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 40,
  onClick,
  className,
  variant = 'circle',
  responsive = true
}) => {
  const theme = useThemeTokens();
  const { isMobile } = useThemeResponsive();
  
  // Adjust size for mobile if responsive
  const adjustedSize = responsive && isMobile ? Math.max(size * 0.8, 24) : size;
  
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
      size={adjustedSize}
      variant={variant}
      responsive={responsive}
      onClick={handleAvatarClick}
      className={className}
      title={`${user.getDisplayName()}'s avatar`}
      role="button"
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAvatarClick();
        }
      }}
    >
      {getAvatarUrl() ? (
        <AvatarImage 
          src={getAvatarUrl()} 
          alt={`${user.getDisplayName()}'s avatar`}
          responsive={responsive}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent && !parent.querySelector('[data-initials-fallback]')) {
              const initialsElement = document.createElement('div');
              initialsElement.setAttribute('data-initials-fallback', 'true');
              initialsElement.textContent = getInitials();
              initialsElement.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: ${theme.typography.fontWeight.semibold};
                font-size: ${Math.max(adjustedSize * 0.4, 12)}px;
                line-height: 1;
                border-radius: inherit;
                background: linear-gradient(135deg, ${theme.getColor('brand.500')}, ${theme.getColor('brand.600')});
              `;
              parent.appendChild(initialsElement);
            }
          }}
        />
      ) : (
        <InitialsContainer size={adjustedSize} responsive={responsive}>
          {getInitials()}
        </InitialsContainer>
      )}
    </AvatarContainer>
  );
};

export default UserAvatar;
