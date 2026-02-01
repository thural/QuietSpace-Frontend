/**
 * Theme Index Test Suite
 * Tests the main theme module exports and API
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock all the dependencies before importing
jest.mock('../public', () => ({
  themeSystem: {
    currentTheme: 'light',
    themes: ['light', 'dark'],
    switchTheme: jest.fn(),
    getTheme: jest.fn(() => ({ colors: { primary: '#000' } }))
  },
  ThemeSystem: jest.fn(),
  ThemeProvider: jest.fn(),
  EnhancedThemeProvider: jest.fn(),
  useEnhancedTheme: jest.fn(() => ({ colors: { primary: '#000' } })),
  useThemeSwitch: jest.fn(() => ({ currentTheme: 'light', switchTheme: jest.fn() })),
  useThemeTokens: jest.fn(() => ({ colors: { primary: '#000' } })),
  useTheme: jest.fn(() => ({ colors: { primary: '#000' } })),
  createStyledComponent: jest.fn(),
  media: jest.fn(),
  animations: jest.fn()
}));

jest.mock('../tokens', () => ({
  ColorTokens: {},
  TypographyTokens: {},
  SpacingTokens: {},
  ShadowTokens: {},
  BreakpointTokens: {},
  RadiusTokens: {},
  AnimationTokens: {}
}));

jest.mock('../interfaces', () => ({
  ColorPalette: {},
  SemanticColors: {},
  BackgroundColors: {},
  TextColors: {},
  BorderColors: {},
  ColorSystem: {},
  ColorUtilities: {},
  FontSize: {},
  FontWeight: {},
  LineHeight: {},
  FontFamily: {},
  TypographySystem: {},
  TypographyUtilities: {},
  Spacing: {},
  Shadow: {},
  Breakpoint: {},
  Radius: {},
  LayoutSystem: {},
  LayoutUtilities: {}
}));

jest.mock('../factory', () => ({
  createTheme: jest.fn(),
  createThemeWithVariant: jest.fn(),
  createDefaultTheme: jest.fn(),
  createCustomTheme: jest.fn()
}));

jest.mock('../composer', () => ({
  ThemeComposer: jest.fn(),
  themeComposer: jest.fn()
}));

jest.mock('../variants', () => ({
  getTheme: jest.fn(),
  getThemeVariants: jest.fn(),
  defaultTheme: { colors: { primary: '#000' } }
}));

jest.mock('../enhancers/themeEnhancers', () => ({
  enhanceTheme: jest.fn()
}));

jest.mock('../styledUtils', () => ({
  Container: jest.fn(),
  FlexContainer: jest.fn(),
  GridContainer: jest.fn(),
  StyledButton: jest.fn()
}));

// Now import the module
import * as themeModule from '../index';

describe('Theme Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Public API Exports', () => {
    test('should export theme system components', () => {
      expect(themeModule.themeSystem).toBeDefined();
      expect(themeModule.ThemeSystem).toBeDefined();
    });

    test('should export provider components', () => {
      expect(themeModule.ThemeProvider).toBeDefined();
      expect(themeModule.EnhancedThemeProvider).toBeDefined();
    });

    test('should export hooks', () => {
      expect(themeModule.useEnhancedTheme).toBeDefined();
      expect(themeModule.useThemeSwitch).toBeDefined();
      expect(themeModule.useThemeTokens).toBeDefined();
      expect(themeModule.useTheme).toBeDefined();
    });

    test('should export utilities', () => {
      expect(themeModule.createStyledComponent).toBeDefined();
      expect(themeModule.media).toBeDefined();
      expect(themeModule.animations).toBeDefined();
    });
  });

  describe('Factory Functions', () => {
    test('should export theme creation functions', () => {
      expect(themeModule.createTheme).toBeDefined();
      expect(themeModule.createThemeWithVariant).toBeDefined();
      expect(themeModule.createDefaultTheme).toBeDefined();
      expect(themeModule.createCustomTheme).toBeDefined();
    });
  });

  describe('Composer Functions', () => {
    test('should export composer utilities', () => {
      expect(themeModule.ThemeComposer).toBeDefined();
      expect(themeModule.themeComposer).toBeDefined();
    });
  });

  describe('Variant Functions', () => {
    test('should export variant utilities', () => {
      expect(themeModule.getTheme).toBeDefined();
      expect(themeModule.getThemeVariants).toBeDefined();
      expect(themeModule.defaultTheme).toBeDefined();
    });
  });

  describe('Enhancer Functions', () => {
    test('should export enhancer utilities', () => {
      expect(themeModule.enhanceTheme).toBeDefined();
    });
  });

  describe('Type Exports', () => {
    test('should export theme token types', () => {
      // These are type exports, so we check they exist as undefined (types are erased at runtime)
      expect(typeof (themeModule as any).ThemeTokens).toBe('undefined');
      expect(typeof (themeModule as any).ColorTokens).toBe('undefined');
    });

    test('should export interface types', () => {
      expect(typeof (themeModule as any).ColorPalette).toBe('undefined');
      expect(typeof (themeModule as any).TypographySystem).toBe('undefined');
    });
  });

  describe('Legacy Exports', () => {
    test('should export legacy UI components with underscore prefix', () => {
      expect(themeModule._Container).toBeDefined();
      expect(themeModule._FlexContainer).toBeDefined();
      expect(themeModule._GridContainer).toBeDefined();
      expect(themeModule._StyledButton).toBeDefined();
    });
  });

  describe('Module Information', () => {
    test('should export module version', () => {
      expect(themeModule.THEME_MODULE_VERSION).toBe('1.0.0');
    });

    test('should export module info', () => {
      expect(themeModule.THEME_MODULE_INFO).toBeDefined();
      expect(themeModule.THEME_MODULE_INFO.name).toBe('Enterprise Theme Module');
      expect(themeModule.THEME_MODULE_INFO.version).toBe('1.0.0');
      expect(themeModule.THEME_MODULE_INFO.description).toBe('Centralized theme management with enterprise patterns');
    });

    test('should include deprecated exports in module info', () => {
      expect(themeModule.THEME_MODULE_INFO.deprecatedExports).toContain('_Container');
      expect(themeModule.THEME_MODULE_INFO.deprecatedExports).toContain('_FlexContainer');
      expect(themeModule.THEME_MODULE_INFO.deprecatedExports).toContain('_GridContainer');
      expect(themeModule.THEME_MODULE_INFO.deprecatedExports).toContain('_StyledButton');
    });

    test('should include migration guide in module info', () => {
      expect(themeModule.THEME_MODULE_INFO.migrationGuide).toBe('Use UI library components instead of theme module UI components');
    });
  });

  describe('API Consistency', () => {
    test('should have consistent naming patterns', () => {
      const exports = Object.keys(themeModule);

      // Check that factory functions follow create* pattern
      const factoryExports = exports.filter(name => name.startsWith('create'));
      expect(factoryExports.length).toBeGreaterThan(0);

      // Check that hooks follow use* pattern
      const hookExports = exports.filter(name => name.startsWith('use') && name !== 'useThemeTokens');
      expect(hookExports.length).toBeGreaterThan(0);
    });

    test('should not export implementation details', () => {
      const exports = Object.keys(themeModule);

      // Check that no internal modules are exported (be more specific to avoid false positives)
      const internalModules = ['internal', 'providers', 'factories'];
      internalModules.forEach(module => {
        exports.forEach(exportName => {
          // Only check if the export name starts with the internal module name
          // to avoid false positives like 'media' containing 'di'
          expect(exportName.toLowerCase()).not.toMatch(`^${module}`);
        });
      });
    });
  });

  describe('Black Box Pattern Compliance', () => {
    test('should only export public API', () => {
      const exports = Object.keys(themeModule);

      // Should not export internal implementation
      expect(exports).not.toContain('ThemeComposerImpl');
      expect(exports).not.toContain('ThemeContextImpl');
      expect(exports).not.toContain('ThemeProviderImpl');
    });

    test('should export factory functions instead of classes', () => {
      expect(themeModule.createTheme).toBeDefined();
      expect(themeModule.createThemeWithVariant).toBeDefined();
      expect(themeModule.createCustomTheme).toBeDefined();
    });

    test('should export interfaces as types only', () => {
      // Type exports should be undefined at runtime
      expect(typeof (themeModule as any).EnhancedTheme).toBe('undefined');
      expect(typeof (themeModule as any).ThemeConfig).toBe('undefined');
    });
  });
});
