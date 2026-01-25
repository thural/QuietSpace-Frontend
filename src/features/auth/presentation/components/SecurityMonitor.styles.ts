/**
 * Security Monitor Component Styles - Enterprise Styled-Components
 * 
 * Modernized from CSS to styled-components with EnhancedTheme
 * and direct token access for consistent theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const SecurityAnalyticsDashboard = styled.div<{ theme: EnhancedTheme }>`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, ${props => props.theme.colors.background.primary} 0%, ${props => props.theme.colors.background.secondary} 100%);
  min-height: 100vh;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
`;

export const LoadingState = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

export const LoadingSpinner = styled.div<{ theme: EnhancedTheme }>`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.background.secondary};
  border-top: 4px solid ${props => props.theme.colors.brand[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorState = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

export const ErrorMessage = styled.div<{ theme: EnhancedTheme }>`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  background: #fee;
  border: 1px solid #fcc;
  border-radius: ${props => props.theme.radius.md};
  color: #c33;
`;

export const RetryButton = styled.button<{ theme: EnhancedTheme }>`
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.md}`};
  background: ${props => props.theme.colors.brand[500]};
  color: ${props => props.theme.colors.text.inverse};
  border: none;
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background: ${props => props.theme.colors.brand[600]};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const DashboardHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const HeaderLeft = styled.div<{ theme: EnhancedTheme }>`
  h2 {
    margin: 0 0 ${props => props.theme.spacing.xs} 0;
    color: ${props => props.theme.colors.text.primary};
    font-size: ${props => props.theme.typography.fontSize.xl};
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: ${props => props.theme.colors.text.secondary};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

export const HeaderControls = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

export const TimeframeSelector = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.radius.sm};
`;

export const TimeframeButton = styled.button<{ theme: EnhancedTheme; active?: boolean }>`
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.md}`};
  border: none;
  background: ${props => props.active ? props.theme.colors.brand[500] : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text.inverse : props.theme.colors.text.secondary};
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  font-weight: 500;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.brand[600] : props.theme.colors.background.tertiary};
    color: ${props => props.active ? props.theme.colors.text.inverse : props.theme.colors.text.primary};
  }
  
  ${props => props.active && `
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  `}
`;

export const AutoRefreshToggle = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  cursor: pointer;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

export const DetailsToggle = styled.button<{ theme: EnhancedTheme }>`
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.md}`};
  background: ${props => props.theme.colors.text.secondary};
  color: ${props => props.theme.colors.text.inverse};
  border: none;
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  font-weight: 500;
  
  &:hover {
    background: ${props => props.theme.colors.text.primary};
    transform: translateY(-2px);
  }
`;

export const SecurityMetricsGrid = styled.div<{ theme: EnhancedTheme }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

export const MetricCard = styled.div<{ theme: EnhancedTheme; variant?: string }>`
  background: ${props => props.theme.colors.background.primary};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  border-left: 4px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.variant === 'threat-level' && `
    border-left-color: #dc3545;
  `}
  
  ${props => props.variant === 'health-score' && `
    border-left-color: #28a745;
  `}
  
  ${props => props.variant === 'blocked-ips' && `
    border-left-color: #fd7e14;
  `}
  
  ${props => props.variant === 'failed-attempts' && `
    border-left-color: #dc3545;
  `}
  
  ${props => props.variant === 'security-events' && `
    border-left-color: #17a2b8;
  `}
  
  ${props => props.variant === 'rate-limits' && `
    border-left-color: ${props.theme.colors.brand[600]};
  `}
`;

export const MetricHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  h3 {
    margin: 0;
    color: ${props => props.theme.colors.text.primary};
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: 600;
  }
`;

export const MetricIcon = styled.span<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.lg};
  opacity: 0.7;
`;

export const MetricValue = styled.div<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.xs};
  line-height: 1;
`;

export const MetricDescription = styled.div<{ theme: EnhancedTheme }>`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: 500;
`;

// Modern export for backward compatibility during migration
export const SecurityMonitorStyles = {
  securityAnalyticsDashboard: SecurityAnalyticsDashboard,
  loading: LoadingState,
  loadingSpinner: LoadingSpinner,
  error: ErrorState,
  errorMessage: ErrorMessage,
  retryBtn: RetryButton,
  dashboardHeader: DashboardHeader,
  headerLeft: HeaderLeft,
  headerControls: HeaderControls,
  timeframeSelector: TimeframeSelector,
  timeframeBtn: TimeframeButton,
  autoRefreshToggle: AutoRefreshToggle,
  detailsToggle: DetailsToggle,
  securityMetricsGrid: SecurityMetricsGrid,
  metricCard: MetricCard,
  metricHeader: MetricHeader,
  metricIcon: MetricIcon,
  metricValue: MetricValue,
  metricDescription: MetricDescription,
};

export default SecurityMonitorStyles;
