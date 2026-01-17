/**
 * Responsive Hook.
 * 
 * Hook for detecting display type (mobile vs wide).
 * Provides responsive context and utilities for adaptive UI.
 */

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { breakpoints } from './breakpoints';

export type DisplayType = 'mobile' | 'wide';

interface ResponsiveContextType {
  display: DisplayType;
  isMobile: boolean;
  isWide: boolean;
}

const ResponsiveContext = createContext<ResponsiveContextType | null>(null);

/**
 * Hook for responsive display detection
 */
export const useResponsive = (): DisplayType => {
  const [display, setDisplay] = useState<DisplayType>('mobile');

  useEffect(() => {
    const checkDisplay = () => {
      setDisplay(window.innerWidth <= breakpoints.mobile ? 'mobile' : 'wide');
    };

    checkDisplay();
    window.addEventListener('resize', checkDisplay);
    return () => {
      window.removeEventListener('resize', checkDisplay);
    };
  }, []);

  return display;
};

/**
 * Responsive Provider Component
 */
interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const display = useResponsive();

  const contextValue = {
    display,
    isMobile: display === 'mobile',
    isWide: display === 'wide'
  };

  return React.createElement(
    ResponsiveContext.Provider,
    { value: contextValue, children }
  );
};

/**
 * Hook for using responsive context
 */
export const useResponsiveContext = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsiveContext must be used within ResponsiveProvider');
  }
  return context;
};
