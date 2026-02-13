/**
 * Theme Accessibility Features
 *
 * Provides comprehensive accessibility tokens and WCAG compliance features
 * for theme system including contrast ratios, screen reader support, and accessibility testing.
 */

/**
 * WCAG contrast ratio levels
 */
export enum ContrastLevel {
  AA_NORMAL = '4.5',
  AA_LARGE = '3.0',
  AAA_NORMAL = '7.0',
  AAA_LARGE = '4.5'
}

/**
 * Accessibility token types
 */
export interface AccessibilityTokens {
  /** High contrast color combinations */
  highContrast: {
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      overlay: string;
    };
    borders: {
      primary: string;
      secondary: string;
      focus: string;
    };
  };
  /** Screen reader specific tokens */
  screenReader: {
    only: string;
    text: string;
    focused: string;
  };
  /** Focus indicator tokens */
  focus: {
    color: string;
    width: string;
    offset: string;
    style: 'solid' | 'dashed' | 'dotted';
    radius: string;
  };
  /** Reduced motion tokens */
  reducedMotion: {
    duration: string;
    easing: string;
    scale: string;
  };
  /** Color blind friendly palettes */
  colorBlind: {
    protanopia: Record<string, string>;
    deuteranopia: Record<string, string>;
    tritanopia: Record<string, string>;
    achromatopsia: Record<string, string>;
  };
}

/**
 * Contrast ratio calculation result
 */
export interface ContrastResult {
  ratio: number;
  level: 'AA' | 'AAA' | 'FAIL';
  passesAA: boolean;
  passesAAA: boolean;
  isLargeText: boolean;
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  /** Enable high contrast mode */
  enableHighContrast: boolean;
  /** WCAG compliance level */
  wcagLevel: 'AA' | 'AAA';
  /** Enable reduced motion support */
  enableReducedMotion: boolean;
  /** Enable screen reader optimizations */
  enableScreenReader: boolean;
  /** Color blindness support type */
  colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  /** Custom focus indicators */
  customFocus: boolean;
}

/**
 * WCAG Contrast Calculator
 */
export class WCAGContrastCalculator {
  /**
   * Calculate relative luminance of a color
   */
  static calculateLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;

    // Convert RGB to linear values
    const r = this.toLinear(rgb.r / 255);
    const g = this.toLinear(rgb.g / 255);
    const b = this.toLinear(rgb.b / 255);

    // Calculate luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static calculateContrast(color1: string, color2: string): number {
    const lum1 = this.calculateLuminance(color1);
    const lum2 = this.calculateLuminance(color2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Check WCAG compliance
   */
  static checkWCAGCompliance(
    foreground: string,
    background: string,
    isLargeText: boolean = false
  ): ContrastResult {
    const ratio = this.calculateContrast(foreground, background);
    
    const thresholds = isLargeText 
      ? { AA: 3.0, AAA: 4.5 }
      : { AA: 4.5, AAA: 7.0 };

    const passesAA = ratio >= thresholds.AA;
    const passesAAA = ratio >= thresholds.AAA;

    let level: 'AA' | 'AAA' | 'FAIL';
    if (passesAAA) level = 'AAA';
    else if (passesAA) level = 'AA';
    else level = 'FAIL';

    return {
      ratio: Math.round(ratio * 100) / 100,
      level,
      passesAA,
      passesAAA,
      isLargeText
    };
  }

  /**
   * Convert hex to RGB
   */
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Convert to linear RGB value
   */
  private static toLinear(value: number): number {
    return value <= 0.03928 
      ? value / 12.92 
      : Math.pow((value + 0.055) / 1.055, 2.4);
  }
}

/**
 * Accessibility Theme Extensions
 */
export class AccessibilityThemeExtensions {
  /**
   * Generate high contrast tokens
   */
  static generateHighContrastTokens(baseColors: Record<string, string>): AccessibilityTokens['highContrast'] {
    return {
      text: {
        primary: '#FFFFFF',
        secondary: '#E0E0E0',
        disabled: '#808080',
        inverse: '#000000'
      },
      background: {
        primary: '#000000',
        secondary: '#1A1A1A',
        tertiary: '#2D2D2D',
        overlay: 'rgba(0, 0, 0, 0.8)'
      },
      borders: {
        primary: '#FFFFFF',
        secondary: '#C0C0C0',
        focus: '#00FF00'
      }
    };
  }

  /**
   * Generate screen reader tokens
   */
  static generateScreenReaderTokens(): AccessibilityTokens['screenReader'] {
    return {
      only: 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;',
      text: 'clip: rect(1px, 1px, 1px, 1px); clip-path: inset(50%); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px;',
      focused: 'clip: auto; height: auto; overflow: visible; position: static; white-space: normal; width: auto;'
    };
  }

  /**
   * Generate focus indicator tokens
   */
  static generateFocusTokens(): AccessibilityTokens['focus'] {
    return {
      color: '#0066CC',
      width: '2px',
      offset: '2px',
      style: 'solid',
      radius: '4px'
    };
  }

  /**
   * Generate reduced motion tokens
   */
  static generateReducedMotionTokens(): AccessibilityTokens['reducedMotion'] {
    return {
      duration: '0s',
      easing: 'linear',
      scale: '1'
    };
  }

  /**
   * Generate color blind friendly palettes
   */
  static generateColorBlindPalettes(baseColors: Record<string, string>): AccessibilityTokens['colorBlind'] {
    return {
      protanopia: {
        red: '#0066CC',
        green: '#FF9900',
        blue: '#0066CC',
        yellow: '#FFCC00',
        orange: '#FF9900',
        purple: '#9933CC'
      },
      deuteranopia: {
        red: '#0066CC',
        green: '#FF9900',
        blue: '#0066CC',
        yellow: '#FFCC00',
        orange: '#FF9900',
        purple: '#9933CC'
      },
      tritanopia: {
        red: '#CC0000',
        green: '#009900',
        blue: '#FF6600',
        yellow: '#FFCC00',
        orange: '#FF6600',
        purple: '#CC00CC'
      },
      achromatopsia: {
        red: '#666666',
        green: '#999999',
        blue: '#333333',
        yellow: '#CCCCCC',
        orange: '#999999',
        purple: '#666666'
      }
    };
  }

  /**
   * Generate complete accessibility tokens
   */
  static generateAccessibilityTokens(baseColors: Record<string, string>): AccessibilityTokens {
    return {
      highContrast: this.generateHighContrastTokens(baseColors),
      screenReader: this.generateScreenReaderTokens(),
      focus: this.generateFocusTokens(),
      reducedMotion: this.generateReducedMotionTokens(),
      colorBlind: this.generateColorBlindPalettes(baseColors)
    };
  }
}

/**
 * Accessibility Testing Utilities
 */
export class AccessibilityTestingUtils {
  /**
   * Test color contrast compliance
   */
  static testColorContrast(
    colors: Record<string, string>,
    combinations: Array<{ foreground: string; background: string; isLargeText?: boolean }>
  ): Array<{ name: string; result: ContrastResult; passes: boolean }> {
    return combinations.map(({ foreground, background, isLargeText }, index) => {
      const result = WCAGContrastCalculator.checkWCAGCompliance(
        colors[foreground],
        colors[background],
        isLargeText
      );
      
      return {
        name: `Contrast Test ${index + 1}: ${foreground} on ${background}`,
        result,
        passes: result.passesAA
      };
    });
  }

  /**
   * Generate accessibility report
   */
  static generateAccessibilityReport(themeName: string, tokens: AccessibilityTokens): {
    themeName: string;
    timestamp: Date;
    tests: {
      contrast: Array<{ name: string; result: ContrastResult; passes: boolean }>;
      focus: boolean;
      screenReader: boolean;
      reducedMotion: boolean;
    };
    summary: {
      passed: number;
      failed: number;
      total: number;
      compliance: 'AA' | 'AAA' | 'PARTIAL' | 'FAIL';
    };
  } {
    // Test common color combinations
    const contrastTests = this.testColorContrast(tokens.highContrast.text, [
      { foreground: 'primary', background: 'primary' },
      { foreground: 'secondary', background: 'primary' },
      { foreground: 'primary', background: 'secondary' }
    ]);

    const passed = contrastTests.filter(test => test.passes).length;
    const failed = contrastTests.length - passed;
    const total = contrastTests.length;

    let compliance: 'AA' | 'AAA' | 'PARTIAL' | 'FAIL';
    if (passed === total && contrastTests.every(test => test.result.level === 'AAA')) {
      compliance = 'AAA';
    } else if (passed >= total * 0.8) {
      compliance = 'AA';
    } else if (passed >= total * 0.5) {
      compliance = 'PARTIAL';
    } else {
      compliance = 'FAIL';
    }

    return {
      themeName,
      timestamp: new Date(),
      tests: {
        contrast: contrastTests,
        focus: !!tokens.focus,
        screenReader: !!tokens.screenReader,
        reducedMotion: !!tokens.reducedMotion
      },
      summary: {
        passed,
        failed,
        total,
        compliance
      }
    };
  }
}
