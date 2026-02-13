import styled from 'styled-components';
import { getSpacing, getColor, getRadius, getBorderWidth, getTransition } from '../utils';

// Enterprise styled-components for checkbox styling
export const CheckboxWrapper = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  margin: ${props => getSpacing(props.theme, 'xs')} 0;
`;

export const CheckboxInput = styled.input<{ theme: any; variant?: 'default' | 'primary' | 'secondary' }>`
  width: ${props => getSpacing(props.theme, 20)};
  height: ${props => getSpacing(props.theme, 20)};
  appearance: none;
  background: ${props => getColor(props.theme, 'background.primary')};
  border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.medium')};
  border-radius: ${props => getRadius(props.theme, 'full')};
  outline: none;
  cursor: pointer;
  margin-right: ${props => getSpacing(props.theme, 'sm')};
  position: relative;
  transition: ${props => getTransition(props.theme, 'all', 'fast', 'ease')};
  
  &:hover {
    border-color: ${props => getColor(props.theme, 'border.dark')};
  }
  
  &:focus {
    outline: 2px solid ${props => getColor(props.theme, 'brand.300')};
    outline-offset: 2px;
  }
  
  &:checked {
    background: ${props => {
    switch (props.variant) {
      case 'primary':
        return getColor(props.theme, 'brand.500');
      case 'secondary':
        return getColor(props.theme, 'background.secondary');
      default:
        return getColor(props.theme, 'brand.500');
    }
  }};
    border-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return getColor(props.theme, 'brand.500');
      case 'secondary':
        return getColor(props.theme, 'border.medium');
      default:
        return getColor(props.theme, 'brand.500');
    }
  }};
  }
  
  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => getSpacing(props.theme, 6)};
    height: ${props => getSpacing(props.theme, 6)};
    background: ${props => getColor(props.theme, 'text.inverse')};
    border-radius: 50%;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CheckboxLabel = styled.label<{ theme: any }>`
  font-size: ${props => getSpacing(props.theme, 14)};
  color: ${props => getColor(props.theme, 'text.primary')};
  cursor: pointer;
  user-select: none;
  
  &:hover {
    color: ${props => getColor(props.theme, 'text.secondary')};
  }
`;
