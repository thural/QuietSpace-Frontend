import { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getShadow, getTransition } from '../utils';

interface IBadgeProps extends BaseComponentProps {
    children: ReactNode;
    variant?: 'filled' | 'outline' | 'light';
    color?: string;
    size?: ComponentSize;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    theme?: any;
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
  transition: ${props => getTransition(props.theme, 'all', 'fast', 'ease')};
  
  /* Size variants using theme spacing tokens */
  ${props => {
        const size = props.$size || 'md';
        const gapMap = {
            xs: getSpacing(props.theme, 'xs'),
            sm: getSpacing(props.theme, 'sm'),
            md: getSpacing(props.theme, 'md'),
            lg: getSpacing(props.theme, 'lg'),
            xl: getSpacing(props.theme, 'xl')
        };
        const paddingMap = {
            xs: `${getSpacing(props.theme, 'xs')} ${getSpacing(props.theme, 'sm')}`,
            sm: `${getSpacing(props.theme, 'sm')} ${getSpacing(props.theme, 'md')}`,
            md: `${getSpacing(props.theme, 'sm')} ${getSpacing(props.theme, 'lg')}`,
            lg: `${getSpacing(props.theme, 'md')} ${getSpacing(props.theme, 'xl')}`,
            xl: `${getSpacing(props.theme, 'lg')} ${getSpacing(props.theme, 'xl')}`
        };
        const fontSizeMap = {
            xs: getTypography(props.theme, 'fontSize.xs'),
            sm: getTypography(props.theme, 'fontSize.sm'),
            md: getTypography(props.theme, 'fontSize.base'),
            lg: getTypography(props.theme, 'fontSize.lg'),
            xl: getTypography(props.theme, 'fontSize.xl')
        };
        const radiusMap = {
            xs: getRadius(props.theme, 'sm'),
            sm: getRadius(props.theme, 'sm'),
            md: getRadius(props.theme, 'md'),
            lg: getRadius(props.theme, 'lg'),
            xl: getRadius(props.theme, 'lg')
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
                return getColor(props.theme, props.$color || 'brand.500');
            case 'outline':
                return 'transparent';
            case 'light':
                return `${getColor(props.theme, props.$color || 'brand.500')}15`;
            default:
                return getColor(props.theme, props.$color || 'brand.500');
        }
    }};
  
  color: ${props => {
        switch (props.$variant) {
            case 'filled':
                return getColor(props.theme, 'text.inverse');
            case 'outline':
                return getColor(props.theme, props.$color || 'brand.500');
            case 'light':
                return getColor(props.theme, props.$color || 'brand.500');
            default:
                return getColor(props.theme, 'text.inverse');
        }
    }};
  
  border: ${props => {
        if (props.$variant === 'outline') {
            return `${getBorderWidth(props.theme, 'sm')} solid ${getColor(props.theme, props.$color || 'brand.500')}`;
        }
        return 'none';
    }};
  
  /* Hover states */
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => getShadow(props.theme, 'sm')};
  }
`;

class Badge extends PureComponent<IBadgeProps> {
    static defaultProps: Partial<IBadgeProps> = {
        variant: 'filled',
        size: 'md'
    };

    // Get badge color using theme tokens
    private getBadgeColor = (theme: any, color?: string): string => {
        if (color) return getColor(theme, color);
        // Default to brand color from theme
        return getColor(theme, 'brand.500');
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
            testId,
            theme
        } = this.props;

        const badgeColor = this.getBadgeColor(theme, color);

        return (
            <BadgeContainer
                $variant={variant || 'filled'}
                $color={badgeColor}
                $size={size || 'md'}
                className={className}
                style={style}
                data-testid={testId}
                theme={theme}
            >
                {leftSection}
                {children}
                {rightSection}
            </BadgeContainer>
        );
    }
}

export default Badge;
