/**
 * Navbar Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const Navbar = styled.nav<{ theme: Theme }>`
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
  color: ${props => props.theme.colors?.textMax || '#ffffff'};
  justify-content: space-between;
  -webkit-backdrop-filter: blur(8px);
  background-color: ${props => props.theme.colors?.backgroundTransparent || 'rgba(255, 255, 255, 0.85)'};
  font-weight: ${props => props.theme.typography.fontWeightThin};
  height: ${props => props.theme.spacing(props.theme.spacingFactor.md * 4)};
  padding: ${props => `${props.theme.spacing(props.theme.spacingFactor.sm)} ${props.theme.spacing(props.theme.spacingFactor.md)}`};

  .badge {
    position: absolute;
    background-color: #ff4848;
    height: ${props => props.theme.spacing(props.theme.spacingFactor.ms)};
    width: ${props => props.theme.spacing(props.theme.spacingFactor.ms)};
    left: ${props => props.theme.spacing(props.theme.spacingFactor.xl)};
    bottom: ${props => props.theme.spacing(props.theme.spacingFactor.md)};
  }

  .navbar-item > a > img {
    width: 100%;
    display: block;
    text-align: center;
  }

  nav {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${props => props.theme.typography.fontWeightRegular};
  }

  .navbar-item {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: ${props => props.theme.spacing(props.theme.spacingFactor.md * 2.5)};
    margin: ${props => `0 ${props.theme.spacing(props.theme.spacingFactor.md * 1.75)}`};
  }

  .navbar-item > a > svg {
    display: block;
    color: ${props => props.theme.colors?.textMax || '#ffffff'};
    width: ${props => props.theme.spacing(props.theme.spacingFactor.md * 2.5)};
    font-size: ${props => props.theme.spacing(props.theme.spacingFactor.md * 1.8)};
    margin: ${props => `0 ${props.theme.spacing(props.theme.spacingFactor.md * 1.75)}`};
  }

  .navbar-item.menu {
    margin: auto;
  }

  .title {
    margin: auto;
    color: ${props => props.theme.colors?.text || '#333333'};
  }

  a, a:hover, a:focus, a:active {
    color: inherit;
    text-decoration: none;
  }

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.theme.typography.fontSize.xLarge};
    font-weight: ${props => props.theme.typography.fontWeightThin};
  }

  li:first-of-type {
    margin-left: 0;
  }

  li {
    list-style: none;
    margin: ${props => `0 ${props.theme.spacing(props.theme.spacingFactor.xl)}`};
  }
`;

// Legacy export for backward compatibility during migration
export const NavbarStyles = {
    navbar: Navbar,
};
