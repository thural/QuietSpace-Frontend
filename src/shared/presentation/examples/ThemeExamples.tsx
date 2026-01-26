/**
 * Theme-Aware Component Examples.
 * 
 * Examples demonstrating how to use the composable theme system
 * for creating responsive, accessible, and maintainable components.
 */

import React from 'react';
import {
  useThemeTokens,
  useThemeSwitch,
  createStyledComponent
} from '@core/theme';
import { useThemeResponsive } from '@platform_shell';
import { ThemeContainer, ThemeButton, ThemeText, ThemeFlexContainer } from '@platform_shell/components/ThemeComponents';
import { UserAvatar } from '../widgets/UserAvatar';
import { User } from '../../domain/entities/User';

/**
 * Example Card Component
 */
const ExampleCard = createStyledComponent('div') <{ variant?: 'default' | 'elevated' | 'bordered' }>`
  ${({ theme, variant = 'default' }) => {
    const baseStyles = `
      padding: ${theme.spacing.lg};
      border-radius: ${theme.radius.lg};
      background: ${theme.getColor('background.primary')};
      color: ${theme.getColor('text.primary')};
      transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
    `;

    const variantStyles = {
      default: `
        border: 1px solid ${theme.getColor('border.light')};
      `,
      elevated: `
        box-shadow: ${theme.shadows.lg};
        border: 1px solid ${theme.getColor('border.light')};
        
        &:hover {
          box-shadow: ${theme.shadows.xl};
          transform: translateY(-2px);
        }
      `,
      bordered: `
        border: 2px solid ${theme.getColor('brand.500')};
        background: ${theme.getColor('background.secondary')};
      `,
    };

    return `
      ${baseStyles}
      ${variantStyles[variant]}
    `;
  }}
`;

/**
 * Example Input Component
 */
const ExampleInput = createStyledComponent('input') <{
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}>`
  ${({ theme, variant = 'default', size = 'md', error = false }) => {
    const baseStyles = `
      border: 2px solid ${error ? theme.getColor('semantic.error') : theme.getColor('border.medium')};
      border-radius: ${theme.radius.md};
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-size: ${theme.typography.fontSize.base};
      font-family: ${theme.typography.fontFamily.sans.join(', ')};
      transition: all ${theme.animation.duration.fast} ${theme.animation.easing.ease};
      outline: none;
      
      &:focus {
        border-color: ${error ? theme.getColor('semantic.error') : theme.getColor('brand.500')};
        box-shadow: 0 0 0 3px ${error ? theme.getColor('semantic.error') + '20' : theme.getColor('brand.500') + '20'};
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: ${theme.getColor('background.secondary')};
      }
    `;

    const sizeStyles = {
      sm: `
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.typography.fontSize.sm};
      `,
      md: `
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSize.base};
      `,
      lg: `
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSize.lg};
      `,
    };

    const variantStyles = {
      default: `
        background: ${theme.getColor('background.primary')};
      `,
      outlined: `
        background: transparent;
        border-color: ${theme.getColor('border.medium')};
        
        &:focus {
          border-color: ${theme.getColor('brand.500')};
          background: ${theme.getColor('background.primary')};
        }
      `,
      filled: `
        background: ${theme.getColor('background.secondary')};
        border-color: transparent;
        
        &:focus {
          background: ${theme.getColor('background.primary')};
          border-color: ${theme.getColor('brand.500')};
        }
      `,
    };

    return `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
    `;
  }}
`;

/**
 * Example Badge Component
 */
const ExampleBadge = createStyledComponent('span') <{
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}>`
  ${({ theme, variant = 'default', size = 'md' }) => {
    const baseStyles = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: ${theme.typography.fontWeight.semibold};
      border-radius: ${theme.radius.full};
      text-transform: uppercase;
      letter-spacing: ${theme.typography.letterSpacing.wide};
    `;

    const sizeStyles = {
      sm: `
        padding: ${theme.spacing.xs} ${theme.spacing.sm};
        font-size: ${theme.typography.fontSize.xs};
      `,
      md: `
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSize.sm};
      `,
      lg: `
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSize.base};
      `,
    };

    const variantStyles = {
      default: `
        background: ${theme.getColor('neutral.100')};
        color: ${theme.getColor('neutral.700')};
      `,
      success: `
        background: ${theme.getColor('semantic.success')};
        color: white;
      `,
      warning: `
        background: ${theme.getColor('semantic.warning')};
        color: white;
      `,
      error: `
        background: ${theme.getColor('semantic.error')};
        color: white;
      `,
    };

    return `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
    `;
  }}
`;

/**
 * Example Progress Component
 */
const ExampleProgress = createStyledComponent('div') <{
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}>`
  ${({ theme, value, max = 100, variant = 'default', size = 'md' }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const baseStyles = `
      width: 100%;
      background: ${theme.getColor('background.secondary')};
      border-radius: ${theme.radius.full};
      overflow: hidden;
      position: relative;
    `;

    const sizeStyles = {
      sm: `
        height: 4px;
      `,
      md: `
        height: 8px;
      `,
      lg: `
        height: 12px;
      `,
    };

    const variantStyles = {
      default: `
        background: ${theme.getColor('brand.500')};
      `,
      success: `
        background: ${theme.getColor('semantic.success')};
      `,
      warning: `
        background: ${theme.getColor('semantic.warning')};
      `,
      error: `
        background: ${theme.getColor('semantic.error')};
      `,
    };

    return `
      ${baseStyles}
      ${sizeStyles[size]}
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: ${percentage}%;
        background: ${variantStyles[variant].replace('background: ', '').replace(';', '')};
        transition: width ${theme.animation.duration.normal} ${theme.animation.easing.ease};
      }
    `;
  }}
`;

/**
 * Complete Example Component
 */
export const ThemeExamples: React.FC = () => {
  const theme = useThemeTokens();
  const { currentVariant, switchTheme, availableVariants } = useThemeSwitch();
  const { isMobile } = useThemeResponsive();

  return (
    <ThemeContainer variant="card" responsive>
      <ThemeFlexContainer direction="column" gap="lg">
        {/* Theme Switcher */}
        <ThemeFlexContainer justify="space-between" align="center">
          <ThemeText variant="heading" size="lg">
            Theme System Examples
          </ThemeText>
          <ThemeFlexContainer gap="sm">
            {availableVariants.map((variant) => (
              <ThemeButton
                key={variant}
                variant={currentVariant === variant ? 'primary' : 'outline'}
                size="sm"
                onClick={() => switchTheme(variant)}
              >
                {variant}
              </ThemeButton>
            ))}
          </ThemeFlexContainer>
        </ThemeFlexContainer>

        {/* Responsive Info */}
        <ThemeContainer variant="default">
          <ThemeText size="sm">
            Current Display: {isMobile ? 'Mobile' : 'Wide'} | Theme: {currentVariant}
          </ThemeText>
        </ThemeContainer>

        {/* Avatar Examples */}
        <ThemeFlexContainer direction="column" gap="md">
          <ThemeText variant="subheading">Avatar Components</ThemeText>
          <ThemeFlexContainer gap="md" align="center">
            <UserAvatar
              user={new User(
                '1',
                'john_doe',
                new Date(),
                new Date(),
                'john@example.com',
                'Software Developer',
                null,
                true,
                true
              )}
              size={40}
              variant="circle"
              responsive
            />
            <UserAvatar
              user={new User(
                '2',
                'jane_smith',
                new Date(),
                new Date(),
                'jane@example.com',
                'Product Designer',
                null,
                true,
                true
              )}
              size={32}
              variant="square"
              responsive
            />
            <UserAvatar
              user={new User(
                '3',
                'bob_wilson',
                new Date(),
                new Date(),
                'bob@example.com',
                'Data Scientist',
                null,
                true,
                false
              )}
              size={48}
              variant="default"
              responsive
            />
          </ThemeFlexContainer>
        </ThemeFlexContainer>

        {/* Button Examples */}
        <ThemeFlexContainer direction="column" gap="md">
          <ThemeText variant="subheading">Button Components</ThemeText>
          <ThemeFlexContainer gap="md" wrap>
            <ThemeButton variant="primary" size="sm">Primary Small</ThemeButton>
            <ThemeButton variant="secondary" size="md">Secondary Medium</ThemeButton>
            <ThemeButton variant="outline" size="lg">Outline Large</ThemeButton>
            <ThemeButton variant="ghost" size="md">Ghost Medium</ThemeButton>
          </ThemeFlexContainer>
        </ThemeFlexContainer>

        {/* Input Examples */}
        <ThemeFlexContainer direction="column" gap="md">
          <ThemeText variant="subheading">Input Components</ThemeText>
          <ThemeFlexContainer direction="column" gap="sm">
            <ExampleInput placeholder="Default input" />
            <ExampleInput variant="outlined" placeholder="Outlined input" />
            <ExampleInput variant="filled" placeholder="Filled input" />
            <ExampleInput error placeholder="Error state" />
          </ThemeFlexContainer>
        </ThemeFlexContainer>

        {/* Badge Examples */}
        <ThemeFlexContainer direction="column" gap="md">
          <ThemeText variant="subheading">Badge Components</ThemeText>
          <ThemeFlexContainer gap="md" align="center">
            <ExampleBadge variant="default" size="sm">Default</ExampleBadge>
            <ExampleBadge variant="success" size="md">Success</ExampleBadge>
            <ExampleBadge variant="warning" size="lg">Warning</ExampleBadge>
            <ExampleBadge variant="error" size="md">Error</ExampleBadge>
          </ThemeFlexContainer>
        </ThemeFlexContainer>

        {/* Progress Examples */}
        <ThemeFlexContainer direction="column" gap="md">
          <ThemeText variant="subheading">Progress Components</ThemeText>
          <ThemeFlexContainer direction="column" gap="sm">
            <ExampleProgress value={75} variant="default" size="sm" />
            <ExampleProgress value={60} variant="success" size="md" />
            <ExampleProgress value={30} variant="warning" size="lg" />
            <ExampleProgress value={90} variant="error" size="md" />
          </ThemeFlexContainer>
        </ThemeFlexContainer>

        {/* Card Examples */}
        <ThemeFlexContainer direction="column" gap="md">
          <ThemeText variant="subheading">Card Components</ThemeText>
          <ThemeFlexContainer gap="md" wrap>
            <ExampleCard variant="default">
              <ThemeText size="sm">Default Card</ThemeText>
            </ExampleCard>
            <ExampleCard variant="elevated">
              <ThemeText size="sm">Elevated Card</ThemeText>
            </ExampleCard>
            <ExampleCard variant="bordered">
              <ThemeText size="sm">Bordered Card</ThemeText>
            </ExampleCard>
          </ThemeFlexContainer>
        </ThemeFlexContainer>
      </ThemeFlexContainer>
    </ThemeContainer>
  );
};

export default ThemeExamples;
