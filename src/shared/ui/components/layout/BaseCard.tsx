import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import FlexStyled from "./FlexStyled";
import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for base card styling
const BaseCardContainer = styled.div<{ theme: EnhancedTheme }>`
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.md};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.border.dark};
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm};
  }
`;

const BaseCard: React.FC<GenericWrapper> = ({ children }) => {
    return (
        <BaseCardContainer>
            <FlexStyled>{children}</FlexStyled>
        </BaseCardContainer>
    );
};

export default BaseCard;