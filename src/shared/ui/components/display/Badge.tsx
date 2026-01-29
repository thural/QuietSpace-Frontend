import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

interface IBadgeProps extends BaseComponentProps {
    children: ReactNode;
    variant?: 'filled' | 'outline' | 'light';
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    leftSection?: ReactNode;
    rightSection?: ReactNode;
}

const BadgeContainer = styled.span<{ $variant: string; $color: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.$size === 'sm' ? '0.25rem' : props.$size === 'lg' ? '0.75rem' : '0.5rem'};
  padding: ${props => props.$size === 'sm' ? '0.125rem 0.5rem' : props.$size === 'lg' ? '0.375rem 1rem' : '0.25rem 0.75rem'};
  font-size: ${props => props.$size === 'sm' ? '0.75rem' : props.$size === 'lg' ? '1rem' : '0.875rem'};
  font-weight: 500;
  border-radius: ${props => props.$size === 'sm' ? '0.125rem' : props.$size === 'lg' ? '0.375rem' : '0.25rem'};
  background-color: ${props => {
        switch (props.$variant) {
            case 'filled':
                return props.$color || (props.theme as any)?.colors?.primary || '#007bff';
            case 'outline':
                return 'transparent';
            case 'light':
                return `${props.$color || (props.theme as any)?.colors?.primary || '#007bff'}15`;
            default:
                return props.$color || (props.theme as any)?.colors?.primary || '#007bff';
        }
    }};
  color: ${props => {
        switch (props.$variant) {
            case 'filled':
                return 'white';
            case 'outline':
                return props.$color || (props.theme as any)?.colors?.primary || '#007bff';
            case 'light':
                return props.$color || (props.theme as any)?.colors?.primary || '#007bff';
            default:
                return 'white';
        }
    }};
  border: ${props => {
        if (props.$variant === 'outline') {
            return `1px solid ${props.$color || (props.theme as any)?.colors?.primary || '#007bff'}`;
        }
        return 'none';
    }};
  transition: all 0.2s ease;
`;

class Badge extends PureComponent<IBadgeProps> {
    static defaultProps: Partial<IBadgeProps> = {
        variant: 'filled',
        size: 'md'
    };

    render(): ReactNode {
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

        return (
            <BadgeContainer
                $variant={variant || 'filled'}
                $color={color || ''}
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
