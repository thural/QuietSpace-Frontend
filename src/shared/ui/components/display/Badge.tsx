import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';

interface IBadgeProps extends BaseComponentProps {
    children: ReactNode;
    variant?: 'filled' | 'outline' | 'light';
    color?: string;
    size?: ComponentSize;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}

const BadgeContainer = styled.span<{
    $variant: string;
    $color: string;
    $size: ComponentSize;
    theme?: any;
}>`
  display: inline-flex;
  align-items: center;
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  transition: all ${props => props.theme?.animation?.duration?.fast || '0.2s'} ${props => props.theme?.animation?.easing?.ease || 'ease'};
  
  /* Size variants using theme spacing tokens */
  ${props => {
        const size = props.$size || 'md';
        const gapMap = {
            xs: props.theme?.spacing?.xs || '4px',
            sm: props.theme?.spacing?.sm || '8px',
            md: props.theme?.spacing?.md || '16px',
            lg: props.theme?.spacing?.lg || '24px',
            xl: props.theme?.spacing?.xl || '32px'
        };
        const paddingMap = {
            xs: `${props.theme?.spacing?.xs || '4px'} ${props.theme?.spacing?.sm || '8px'}`,
            sm: `${props.theme?.spacing?.sm || '8px'} ${props.theme?.spacing?.md || '16px'}`,
            md: `${props.theme?.spacing?.sm || '8px'} ${props.theme?.spacing?.lg || '24px'}`,
            lg: `${props.theme?.spacing?.md || '16px'} ${props.theme?.spacing?.xl || '32px'}`,
            xl: `${props.theme?.spacing?.lg || '24px'} ${props.theme?.spacing?.xl || '32px'}`
        };
        const fontSizeMap = {
            xs: props.theme?.typography?.fontSize?.xs || '12px',
            sm: props.theme?.typography?.fontSize?.sm || '14px',
            md: props.theme?.typography?.fontSize?.base || '16px',
            lg: props.theme?.typography?.fontSize?.lg || '18px',
            xl: props.theme?.typography?.fontSize?.xl || '20px'
        };
        const radiusMap = {
            xs: props.theme?.radius?.sm || '4px',
            sm: props.theme?.radius?.sm || '4px',
            md: props.theme?.radius?.md || '6px',
            lg: props.theme?.radius?.lg || '8px',
            xl: props.theme?.radius?.lg || '8px'
        };

        return `
      gap: ${gapMap[size]};
      padding: ${paddingMap[size]};
      font-size: ${fontSizeMap[size]};
      border-radius: ${radiusMap[size]};
    `;
    }}
  
  /* Variant styles using theme tokens */
  background-color: ${props => {
        switch (props.$variant) {
            case 'filled':
                return props.$color || props.theme?.colors?.brand?.[500] || props.theme?.colors?.primary || '#007bff';
            case 'outline':
                return 'transparent';
            case 'light':
                return `${props.$color || props.theme?.colors?.brand?.[500] || props.theme?.colors?.primary || '#007bff'}15`;
            default:
                return props.$color || props.theme?.colors?.brand?.[500] || props.theme?.colors?.primary || '#007bff';
        }
    }};
  
  color: ${props => {
        switch (props.$variant) {
            case 'filled':
                return props.theme?.colors?.text?.inverse || '#ffffff';
            case 'outline':
                return props.$color || props.theme?.colors?.brand?.[500] || props.theme?.colors?.primary || '#007bff';
            case 'light':
                return props.$color || props.theme?.colors?.brand?.[500] || props.theme?.colors?.primary || '#007bff';
            default:
                return props.theme?.colors?.text?.inverse || '#ffffff';
        }
    }};
  
  border: ${props => {
        if (props.$variant === 'outline') {
            return `1px solid ${props.$color || props.theme?.colors?.brand?.[500] || props.theme?.colors?.primary || '#007bff'}`;
        }
        return 'none';
    }};
  
  /* Hover states */
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme?.shadows?.sm || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  }
`;

class Badge extends PureComponent<IBadgeProps> {
    static defaultProps: Partial<IBadgeProps> = {
        variant: 'filled',
        size: 'md'
    };

    // Get badge color based on semantic theme tokens
    private getBadgeColor = (color?: string): string => {
        if (color) return color;
        // Default to brand color from theme
        return '#007bff';
    };

    override render(): ReactNode {
        const {
            children,
            variant,
            color,
            size,
            leftSection,
            rightSection,
            className,
            style,
            testId
        } = this.props;

        const badgeColor = this.getBadgeColor(color);

        return (
            <BadgeContainer
                $variant={variant || 'filled'}
                $color={badgeColor}
                $size={size || 'md'}
                className={className}
                style={style}
                data-testid={testId}
            >
                {leftSection}
                {children}
                {rightSection}
            </BadgeContainer>
        );
    }
}

export default Badge;
