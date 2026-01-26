import styled from 'styled-components';
import { EnhancedTheme } from '../../core/theme';

export const FormContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

export const FormGroup = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const FormLabel = styled.label<{ theme: EnhancedTheme }>`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

export const FormError = styled.div<{ theme: EnhancedTheme }>`
  color: ${props => props.theme.colors.brand[500]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.xs};
`;

export const FormSuccess = styled.div<{ theme: EnhancedTheme }>`
  color: ${props => props.theme.colors.success || '#10b981'};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.xs};
`;

// Legacy export for backward compatibility during migration
const styles = () => ({
  form: '',
  formGroup: '',
  label: '',
  error: '',
  success: '',
});

export default styles;
