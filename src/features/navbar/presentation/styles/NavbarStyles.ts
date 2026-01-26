/**
 * Navbar Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const Navbar = styled.nav<{ theme: EnhancedTheme }>`
  top: 0;
  z-index: 4;
  width: 100%;
  margin: 0;
  display: flex;
  position: fixed;
  flex-wrap: nowrap;
  align-items: center;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
  color: ${props => props.theme.colors.text.primary};
  justify-content: space-between;
  -webkit-backdrop-filter: blur(8px);
  background-color: ${props => props.theme.colors.background.transparent};
  font-weight: ${props => props.theme.typography.fontWeight.thin};
  height: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

  &:hover {
    background-color: ${props => props.theme.colors.background.transparent}dd;
  }

  & .badge {
    position: absolute;
    background-color: ${props => props.theme.colors.brand[500]};
    height: ${props => props.theme.spacing.sm};
    width: ${props => props.theme.spacing.sm};
    left: ${props => props.theme.spacing.xl};
    bottom: ${props => props.theme.spacing.md};
    border-radius: 50%;
    transition: ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  }

  & .navbar-item > a > img {
    width: 100%;
    display: block;
    text-align: center;
  }

  & nav {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${props => props.theme.typography.fontWeight.normal};
  }

  & .navbar-item {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: ${props => props.theme.spacing.xl};
    margin: 0 ${props => props.theme.spacing.lg};
    transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

    &:hover {
      transform: translateY(-2px);
    }

    & > a > svg {
      display: block;
      color: ${props => props.theme.colors.text.primary};
      width: ${props => props.theme.spacing.xl};
      font-size: ${props => props.theme.typography.fontSize.lg};
      margin: 0 ${props => props.theme.spacing.lg};
      transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
    }

    &.menu {
      margin: auto;
    }
  }

  & .title {
    margin: auto;
    color: ${props => props.theme.colors.text.primary};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

    &:hover {
      color: ${props => props.theme.colors.brand[500]};
    }
  }

  & a,
  & a:hover,
  & a:focus,
  & a:active {
    color: inherit;
    text-decoration: none;
  }

  & a:focus {
    outline: 2px solid ${props => props.theme.colors.brand[400]};
    outline-offset: 2px;
    border-radius: ${props => props.theme.radius.sm};
  }

  & ul {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.theme.typography.fontSize['3xl']};
    font-weight: ${props => props.theme.typography.fontWeight.thin};
  }

  & li:first-of-type {
    margin-left: 0;
  }

  & li {
    list-style: none;
    margin: 0 ${props => props.theme.spacing.xl};
    transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

    &:hover {
      transform: translateY(-1px);
    }
  }

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    height: ${props => props.theme.spacing.lg};

    & .navbar-item {
      width: ${props => props.theme.spacing.lg};
      margin: 0 ${props => props.theme.spacing.md};

      & > a > svg {
        width: ${props => props.theme.spacing.lg};
        font-size: ${props => props.theme.typography.fontSize.base};
        margin: 0 ${props => props.theme.spacing.md};
      }
    }

    & .title {
      font-size: ${props => props.theme.typography.fontSize.lg};
    }

    & ul {
      font-size: ${props => props.theme.typography.fontSize.xl};
    }

    & li {
      margin: 0 ${props => props.theme.spacing.lg};
    }

    & .badge {
      height: ${props => props.theme.spacing.xs};
      width: ${props => props.theme.spacing.xs};
      left: ${props => props.theme.spacing.lg};
      bottom: ${props => props.theme.spacing.sm};
    }
  }

  @media (max-width: 480px) {
    & .navbar-item {
      width: ${props => props.theme.spacing.md};
      margin: 0 ${props => props.theme.spacing.sm};

      & > a > svg {
        width: ${props => props.theme.spacing.md};
        font-size: ${props => props.theme.typography.fontSize.sm};
        margin: 0 ${props => props.theme.spacing.sm};
      }
    }

    & .title {
      font-size: ${props => props.theme.typography.fontSize.base};
    }

    & .badge {
      height: 6px;
      width: 6px;
      left: ${props => props.theme.spacing.md};
      bottom: ${props => props.theme.spacing.xs};
    }
  }
`;

// Legacy export for backward compatibility during migration
export const NavbarStyles = {
  navbar: Navbar,
};
