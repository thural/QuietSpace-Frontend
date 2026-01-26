/**
 * Poll Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '@core/theme';

export const PollContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-flow: column nowrap;
  gap: ${(props: any) => props.theme.spacing.sm};
  margin: ${(props: any) => `${props.theme.spacing.md} 0`};
`;

export const ProgressContainer = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  height: ${(props: any) => props.theme.spacing.lg};
  background-color: ${(props: any) => props.theme.colors.background.secondary};
  border-radius: ${(props: any) => props.theme.radius.md};
  overflow: hidden;
  position: relative;
`;

export const ProgressBar = styled.div<{ theme: EnhancedTheme; percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${(props: any) => props.theme.colors.brand[500]}, ${(props: any) => props.theme.colors.brand[600]});
  border-radius: ${(props: any) => props.theme.radius.md};
  transition: width 0.3s ease;
  width: ${(props: any) => props.percentage}%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const PollOption = styled.div<{ theme: EnhancedTheme; isSelected?: boolean; isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  padding: ${(props: any) => props.theme.spacing.md};
  border-radius: ${(props: any) => props.theme.radius.md};
  background-color: ${(props: any) => {
    if (props.isSelected) return props.theme.colors.brand[500] + '10';
    return props.theme.colors.background.secondary;
  }};
  border: 2px solid ${(props: any) => {
    if (props.isSelected) return props.theme.colors.brand[500];
    return props.theme.colors.border.light;
  }};
  cursor: ${(props: any) => props.isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${(props: any) => {
    if (props.isDisabled) return props.theme.colors.background.secondary;
    if (props.isSelected) return props.theme.colors.brand[500] + '20';
    return props.theme.colors.background.primary;
  }};
    border-color: ${(props: any) => {
    if (props.isDisabled) return props.theme.colors.border.light;
    if (props.isSelected) return props.theme.colors.brand[600];
    return props.theme.colors.border.base;
  }};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const PollOptionText = styled.span<{ theme: EnhancedTheme; isSelected?: boolean }>`
  flex: 1;
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  font-weight: ${(props: any) => props.isSelected ? props.theme.typography.fontWeight.bold : props.theme.typography.fontWeight.normal};
  color: ${(props: any) => props.isSelected ? props.theme.colors.brand[600] : props.theme.colors.text.primary};
  transition: all 0.2s ease;
`;

export const PollOptionPercentage = styled.span<{ theme: EnhancedTheme; isSelected?: boolean }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  color: ${(props: any) => props.isSelected ? props.theme.colors.brand[600] : props.theme.colors.text.secondary};
  min-width: 40px;
  text-align: right;
  transition: all 0.2s ease;
`;

export const PollOptionRadio = styled.div<{ theme: EnhancedTheme; isSelected?: boolean }>`
  width: ${(props: any) => props.theme.spacing.lg};
  height: ${(props: any) => props.theme.spacing.lg};
  border-radius: ${(props: any) => props.theme.radius.full};
  border: 2px solid ${(props: any) => props.isSelected ? props.theme.colors.brand[500] : props.theme.colors.border.light};
  background-color: ${(props: any) => props.isSelected ? props.theme.colors.brand[500] : props.theme.colors.background.primary};
  position: relative;
  transition: all 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(${(props: any) => props.isSelected ? 1 : 0});
    width: ${(props: any) => props.theme.spacing.sm};
    height: ${(props: any) => props.theme.spacing.sm};
    border-radius: ${(props: any) => props.theme.radius.full};
    background-color: ${(props: any) => props.theme.colors.text.primary};
    transition: transform 0.2s ease;
  }
`;

export const PollFooter = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props: any) => props.theme.spacing.md};
  padding-top: ${(props: any) => props.theme.spacing.md};
  border-top: 1px solid ${(props: any) => props.theme.colors.border.light};
`;

export const PollTotalVotes = styled.span<{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  color: ${(props: any) => props.theme.colors.text.secondary};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
`;

export const PollActions = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  gap: ${(props: any) => props.theme.spacing.sm};
`;

// Legacy export for backward compatibility during migration
export const PollStyles = {
  container: PollContainer,
  progressContainer: ProgressContainer,
  progressBar: ProgressBar,
  option: PollOption,
  optionText: PollOptionText,
  optionPercentage: PollOptionPercentage,
  optionRadio: PollOptionRadio,
  footer: PollFooter,
  totalVotes: PollTotalVotes,
  actions: PollActions,
};

export default PollStyles;
