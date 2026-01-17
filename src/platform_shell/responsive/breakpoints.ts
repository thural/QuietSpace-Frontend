/**
 * Responsive Breakpoints.
 * 
 * Defines standard breakpoints for responsive design.
 * Used across mobile and wide display components.
 */

export const breakpoints = {
  mobile: 768,
  wide: 769,
} as const;

export type BreakpointKey = keyof typeof breakpoints;
