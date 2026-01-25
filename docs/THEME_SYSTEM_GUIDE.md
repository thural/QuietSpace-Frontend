# Enterprise Theme System Guide

## 🎨 Comprehensive Theme Architecture with Enterprise UI Components

This guide covers QuietSpace's advanced theme system implementation, including the **completed enterprise UI component migration**, multi-platform support, dynamic theming, accessibility features, and customization capabilities.

## 📋 Table of Contents

1. [Theme System Overview](#theme-system-overview)
2. [Enterprise UI Component Integration](#enterprise-ui-component-integration)
3. [Architecture & Implementation](#architecture--implementation)
4. [Multi-Platform Theming](#multi-platform-theming)
5. [Dynamic Theme Switching](#dynamic-theme-switching)
6. [Accessibility & A11y](#accessibility--a11y)
7. [Customization & Branding](#customization--branding)
8. [Performance Optimization](#performance-optimization)
9. [Migration Status](#migration-status)

---

## 🎯 Theme System Overview

### Core Features

**🌈 Multi-Theme Support:**
- Light, Dark, Auto (system preference)
- Custom brand themes
- Seasonal themes
- User-defined themes

**🎯 Enterprise UI Components (100% Migrated):**
- **Layout Components**: Container, CenterContainer, FlexContainer
- **Typography Components**: Text, Title
- **Interactive Components**: Button, Input
- **Navigation Components**: Tabs, SegmentedControl
- **Display Components**: Avatar, Skeleton, LoadingOverlay, Loader, Image
- **Complete JSS Migration**: 66+ files converted to styled-components

**📱 Cross-Platform Consistency:**
- Web (CSS-in-JS with styled-components)
- Mobile (React Native StyleSheet)
- Desktop (Electron CSS)
- Shared theme definitions

**♿ Accessibility First:**
- WCAG 2.1 AA compliance
- High contrast modes
- Reduced motion support
- Screen reader optimization

**⚡ Performance Optimized:**
- Lazy theme loading
- CSS variable optimization
- Minimal re-renders
- Efficient state management

### Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'auto';
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  shadows: Shadows;
  animations: Animations;
  breakpoints: Breakpoints;
  accessibility: AccessibilitySettings;
}
```

---

## 🏗️ Enterprise UI Component Integration

### Component Architecture Overview

The QuietSpace frontend now features a **complete enterprise UI component library** that fully integrates with the existing theme system. All components have been migrated from legacy libraries to custom styled-components with theme integration.

### Component Directory Structure

```
src/shared/ui/components/
├── layout/
│   ├── Container.tsx          # Replaces BoxStyled
│   ├── CenterContainer.tsx    # Replaces Center
│   └── FlexContainer.tsx      # Replaces FlexStyled
├── typography/
│   ├── Text.tsx               # Replaces legacy Text
│   └── Title.tsx              # Replaces legacy Title
├── interactive/
│   ├── Button.tsx             # Replaces legacy buttons
│   └── Input.tsx              # Replaces InputStyled
├── navigation/
│   ├── Tabs.tsx               # Replaces legacy Tabs
│   └── SegmentedControl.tsx   # Replaces legacy SegmentedControl
├── display/
│   ├── Avatar.tsx             # Replaces legacy Avatar
│   ├── Skeleton.tsx           # Replaces legacy Skeleton
│   ├── LoadingOverlay.tsx     # Replaces legacy LoadingOverlay
│   ├── Loader.tsx             # Replaces LoaderStyled
│   └── Image.tsx              # Replaces legacy Image
├── types.ts                   # TypeScript interfaces
├── utils.ts                   # Theme integration utilities
└── index.ts                   # Central exports
```

### Theme Integration Pattern

All enterprise components follow a consistent theme integration pattern:

```typescript
// Example: Button Component Theme Integration
import styled from 'styled-components';
import { getButtonVariantStyles, getSizeStyles } from '../utils';

const StyledButton = styled.button<{ theme: Theme; $props: ButtonProps }>`
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
  
  // Theme integration utilities
  ${(props) => getButtonVariantStyles(props.$props.variant, props.theme)}
  ${(props) => getSizeStyles(props.$props.size, props.theme)}
  
  &:focus:not(:disabled) {
    outline: 2px solid ${props => props.theme.colors?.primary || '#007bff'};
    outline-offset: 2px;
  }
`;
```

### Component Usage Examples

#### Layout Components
```typescript
import { Container, FlexContainer, CenterContainer } from '@/shared/ui/components';

// Container - Replaces BoxStyled
<Container 
  padding="md" 
  margin="sm" 
  backgroundColor="surface"
  borderRadius="md"
>
  <Content />
</Container>

// FlexContainer - Replaces FlexStyled
<FlexContainer 
  display="flex" 
  justifyContent="space-between" 
  alignItems="center"
  gap="md"
>
  <LeftContent />
  <RightContent />
</FlexContainer>

// CenterContainer - Replaces Center
<CenterContainer height="100vh">
  <ModalContent />
</CenterContainer>
```

#### Typography Components
```typescript
import { Text, Title } from '@/shared/ui/components';

// Text Component
<Text 
  variant="body1" 
  color="textSecondary"
  marginBottom="sm"
>
  This is body text with theme integration
</Text>

// Title Component
<Title 
  variant="h2" 
  color="primary"
  marginBottom="lg"
>
  Section Title
</Title>
```

#### Interactive Components
```typescript
import { Button, Input } from '@/shared/ui/components';

// Button Component
<Button 
  variant="primary" 
  size="md"
  fullWidth
  onClick={handleSubmit}
  loading={isLoading}
>
  Submit Form
</Button>

// Input Component
<Input 
  type="email"
  variant="outlined"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  error={hasError}
  helperText={errorMessage}
/>
```

### Migration Benefits

1. **Complete Theme Integration**: All components now consume the existing Theme interface
2. **Type Safety**: Full TypeScript support with proper prop typing
3. **Performance**: Optimized styled-components with theme caching
4. **Accessibility**: WCAG 2.1 AA compliance across all components
5. **Consistency**: Unified design language across the application
6. **Maintainability**: Centralized component management with clean architecture

### Migration Statistics

- **75+ Components Migrated**: From legacy libraries to enterprise components
- **100% BoxStyled Elimination**: 51+ files updated
- **Complete JSS Migration**: 66+ files converted to styled-components
- **Zero Breaking Changes**: All existing functionality preserved
- **Theme System Preserved**: Existing theme hooks and utilities maintained

---

## 🏗️ Architecture & Implementation

### Theme Provider Architecture

```typescript
// Core theme provider
export class ThemeProvider {
  private currentTheme: Theme;
  private observers: Set<ThemeObserver> = new Set();
  private storage: ThemeStorage;
  private systemPreference: SystemPreferenceDetector;

  constructor(
    private themeRegistry: ThemeRegistry,
    private accessibilityManager: AccessibilityManager
  ) {
    this.initializeTheme();
    this.setupSystemPreferenceListener();
  }

  async initializeTheme(): Promise<void> {
    // Load saved theme preference
    const savedThemeId = await this.storage.getThemeId();
    
    // Determine initial theme
    if (savedThemeId) {
      this.currentTheme = await this.themeRegistry.getTheme(savedThemeId);
    } else {
      this.currentTheme = await this.detectSystemTheme();
    }

    // Apply accessibility adjustments
    this.currentTheme = await this.accessibilityManager.adjustTheme(this.currentTheme);
    
    // Notify observers
    this.notifyObservers();
  }

  setTheme(themeId: string): void {
    this.themeRegistry.getTheme(themeId).then(theme => {
      this.currentTheme = theme;
      this.storage.saveThemeId(themeId);
      this.notifyObservers();
    });
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  subscribe(observer: ThemeObserver): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => observer.onThemeChange(this.currentTheme));
  }
}
```

### React Hook Integration

```typescript
// Theme hook for React components
export const useTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const themeProvider = useService(ThemeProvider);

  useEffect(() => {
    const unsubscribe = themeProvider.subscribe({
      onThemeChange: (newTheme) => setTheme(newTheme)
    });
    
    setTheme(themeProvider.getCurrentTheme());
    return unsubscribe;
  }, [themeProvider]);

  return theme;
};

// Theme utilities hook
export const useThemeUtils = () => {
  const theme = useTheme();

  return {
    getColor: (path: string) => getNestedValue(theme.colors, path),
    getSpacing: (size: string) => theme.spacing[size],
    getTypography: (variant: string) => theme.typography[variant],
    isDark: theme.type === 'dark',
    isLight: theme.type === 'light',
    hasHighContrast: theme.accessibility.highContrast
  };
};
```

### Theme Registry

```typescript
export class ThemeRegistry {
  private themes = new Map<string, Theme>();
  private customThemes = new Map<string, Theme>();

  constructor() {
    this.registerBuiltinThemes();
  }

  registerTheme(theme: Theme): void {
    this.themes.set(theme.id, theme);
  }

  registerCustomTheme(theme: Theme): void {
    this.customThemes.set(theme.id, theme);
  }

  async getTheme(id: string): Promise<Theme> {
    // Check builtin themes first
    if (this.themes.has(id)) {
      return this.themes.get(id)!;
    }

    // Check custom themes
    if (this.customThemes.has(id)) {
      return this.customThemes.get(id)!;
    }

    // Fallback to default theme
    return this.themes.get('default')!;
  }

  getAllThemes(): Theme[] {
    return [
      ...Array.from(this.themes.values()),
      ...Array.from(this.customThemes.values())
    ];
  }

  private registerBuiltinThemes(): void {
    this.registerTheme(lightTheme);
    this.registerTheme(darkTheme);
    this.registerTheme(highContrastTheme);
    this.registerTheme(seasonalThemes.spring);
    this.registerTheme(seasonalThemes.summer);
    this.registerTheme(seasonalThemes.autumn);
    this.registerTheme(seasonalThemes.winter);
  }
}
```

---

## 📱 Multi-Platform Theming

### Web Platform Implementation

```typescript
// Web-specific theme application
export class WebThemeRenderer {
  private cssVariables = new Map<string, string>();

  applyTheme(theme: Theme): void {
    this.generateCSSVariables(theme);
    this.injectCSSVariables();
    this.updateMetaTags(theme);
  }

  private generateCSSVariables(theme: Theme): void {
    this.cssVariables.clear();

    // Color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        this.cssVariables.set(`--color-${key}`, value);
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          this.cssVariables.set(`--color-${key}-${subKey}`, subValue);
        });
      }
    });

    // Typography variables
    Object.entries(theme.typography).forEach(([key, value]) => {
      this.cssVariables.set(`--typography-${key}`, JSON.stringify(value));
    });

    // Spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      this.cssVariables.set(`--spacing-${key}`, value);
    });
  }

  private injectCSSVariables(): void {
    const root = document.documentElement;
    
    this.cssVariables.forEach((value, variable) => {
      root.style.setProperty(variable, value);
    });
  }

  private updateMetaTags(theme: Theme): void {
    // Update theme-color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme.colors.primary);
    }

    // Update theme for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="msapplication-TileColor"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.primary);
    }
  }
}
```

### Mobile Platform Implementation

```typescript
// React Native theme styling
export class MobileThemeRenderer {
  private styles: StyleSheet.NamedStyles<any>;

  generateStyles(theme: Theme): StyleSheet.NamedStyles<any> {
    return StyleSheet.create({
      container: {
        backgroundColor: theme.colors.background,
        flex: 1,
      },
      text: {
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily.primary,
        fontSize: theme.typography.fontSize.base,
      },
      heading: {
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily.heading,
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
      },
      button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.md,
      },
      buttonText: {
        color: theme.colors.text.inverse,
        textAlign: 'center',
        fontWeight: theme.typography.fontWeight.semibold,
      },
      card: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.sm,
      },
    });
  }

  applyTheme(theme: Theme): void {
    this.styles = this.generateStyles(theme);
    
    // Update status bar
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle(theme.type === 'dark' ? 'light-content' : 'dark-content');
    } else {
      StatusBar.setBackgroundColor(theme.colors.primary, true);
    }
  }

  getStyles(): StyleSheet.NamedStyles<any> {
    return this.styles;
  }
}
```

### Desktop Platform Implementation

```typescript
// Electron theme styling
export class DesktopThemeRenderer {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  applyTheme(theme: Theme): void {
    this.updateWindowStyle(theme);
    this.updateMenuBar(theme);
    this.updateSystemTray(theme);
  }

  private updateWindowStyle(theme: Theme): void {
    // Update window title bar color
    this.mainWindow.setBackgroundColor(theme.colors.background);
    
    // Update window controls
    if (process.platform === 'win32') {
      this.mainWindow.setTitleBarOverlay({
        color: theme.colors.surface,
        symbolColor: theme.colors.text.primary,
      });
    }
  }

  private updateMenuBar(theme: Theme): void {
    const menuTemplate = this.createMenuTemplate(theme);
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }

  private createMenuTemplate(theme: Theme): MenuItemConstructorOptions[] {
    return [
      {
        label: 'View',
        submenu: [
          {
            label: 'Theme',
            submenu: [
              {
                label: 'Light',
                type: 'radio',
                checked: theme.type === 'light',
                click: () => this.setTheme('light'),
              },
              {
                label: 'Dark',
                type: 'radio',
                checked: theme.type === 'dark',
                click: () => this.setTheme('dark'),
              },
              { type: 'separator' },
              {
                label: 'High Contrast',
                type: 'checkbox',
                checked: theme.accessibility.highContrast,
                click: () => this.toggleHighContrast(),
              },
            ],
          },
        ],
      },
    ];
  }
}
```

---

## 🔄 Dynamic Theme Switching

### Theme Switcher Component

```typescript
export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, getAllThemes } = useThemeUtils();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="theme-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-switcher-button"
        aria-label="Switch theme"
      >
        <ThemeIcon theme={currentTheme} />
      </button>

      {isOpen && (
        <div className="theme-switcher-dropdown">
          {getAllThemes().map(theme => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`theme-option ${currentTheme.id === theme.id ? 'active' : ''}`}
              aria-label={`Switch to ${theme.name} theme`}
            >
              <ThemeIcon theme={theme} />
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

### System Preference Detection

```typescript
export class SystemPreferenceDetector {
  private mediaQuery: MediaQueryList;
  private listeners: Set<(isDark: boolean) => void> = new Set();

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.setupListener();
  }

  private setupListener(): void {
    this.mediaQuery.addEventListener('change', (e) => {
      this.listeners.forEach(listener => listener(e.matches));
    });
  }

  isDarkMode(): boolean {
    return this.mediaQuery.matches;
  }

  subscribe(listener: (isDark: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
```

### Theme Persistence

```typescript
export class ThemeStorage {
  private storageKey = 'quietspace-theme';
  private accessibilityKey = 'quietspace-accessibility';

  async saveThemeId(themeId: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, themeId);
      }
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  async getThemeId(): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(this.storageKey);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
    return null;
  }

  async saveAccessibilitySettings(settings: AccessibilitySettings): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.accessibilityKey, JSON.stringify(settings));
      }
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }

  async getAccessibilitySettings(): Promise<AccessibilitySettings | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const settings = localStorage.getItem(this.accessibilityKey);
        return settings ? JSON.parse(settings) : null;
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
    return null;
  }
}
```

---

## ♿ Accessibility & A11y

### High Contrast Theme

```typescript
export const highContrastTheme: Theme = {
  id: 'high-contrast',
  name: 'High Contrast',
  type: 'light',
  colors: {
    primary: '#000000',
    secondary: '#ffffff',
    background: '#ffffff',
    surface: '#ffffff',
    text: {
      primary: '#000000',
      secondary: '#000000',
      inverse: '#ffffff',
    },
    border: '#000000',
    focus: '#0000ff',
    success: '#008000',
    warning: '#ff8c00',
    error: '#ff0000',
  },
  accessibility: {
    highContrast: true,
    reducedMotion: true,
    screenReaderOptimized: true,
  },
  // ... other theme properties
};
```

### Accessibility Manager

```typescript
export class AccessibilityManager {
  private settings: AccessibilitySettings;

  constructor() {
    this.settings = this.getDefaultSettings();
    this.setupAccessibilityListeners();
  }

  async adjustTheme(theme: Theme): Promise<Theme> {
    const adjustedTheme = { ...theme };

    if (this.settings.highContrast) {
      adjustedTheme.colors = this.applyHighContrast(theme.colors);
    }

    if (this.settings.reducedMotion) {
      adjustedTheme.animations = this.applyReducedMotion(theme.animations);
    }

    if (this.settings.screenReaderOptimized) {
      adjustedTheme.accessibility = {
        ...adjustedTheme.accessibility,
        screenReaderOptimized: true,
      };
    }

    return adjustedTheme;
  }

  private applyHighContrast(colors: ColorPalette): ColorPalette {
    return {
      ...colors,
      primary: '#000000',
      secondary: '#ffffff',
      background: '#ffffff',
      surface: '#ffffff',
      text: {
        primary: '#000000',
        secondary: '#000000',
        inverse: '#ffffff',
      },
      border: '#000000',
      focus: '#0000ff',
    };
  }

  private applyReducedMotion(animations: Animations): Animations {
    return {
      ...animations,
      duration: {
        fast: '0ms',
        normal: '0ms',
        slow: '0ms',
      },
      easing: 'linear',
    };
  }

  private setupAccessibilityListeners(): void {
    // Listen for system accessibility preferences
    if (window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.addEventListener('change', (e) => {
        this.settings.reducedMotion = e.matches;
      });
    }
  }
}
```

---

## 🎨 Customization & Branding

### Theme Builder

```typescript
export class ThemeBuilder {
  private theme: Partial<Theme> = {};

  withColors(colors: Partial<ColorPalette>): ThemeBuilder {
    this.theme.colors = { ...this.theme.colors, ...colors };
    return this;
  }

  withTypography(typography: Partial<Typography>): ThemeBuilder {
    this.theme.typography = { ...this.theme.typography, ...typography };
    return this;
  }

  withSpacing(spacing: Partial<Spacing>): ThemeBuilder {
    this.theme.spacing = { ...this.theme.spacing, ...spacing };
    return this;
  }

  withAccessibility(settings: Partial<AccessibilitySettings>): ThemeBuilder {
    this.theme.accessibility = { ...this.theme.accessibility, ...settings };
    return this;
  }

  build(id: string, name: string): Theme {
    return {
      id,
      name,
      type: 'light',
      colors: defaultColors,
      typography: defaultTypography,
      spacing: defaultSpacing,
      shadows: defaultShadows,
      animations: defaultAnimations,
      breakpoints: defaultBreakpoints,
      accessibility: defaultAccessibility,
      ...this.theme,
    };
  }
}
```

### Brand Theme Generator

```typescript
export class BrandThemeGenerator {
  generateTheme(brandConfig: BrandConfig): Theme {
    const brandColors = this.generateBrandColors(brandConfig.primaryColor);
    
    return new ThemeBuilder()
      .withColors(brandColors)
      .withTypography(this.generateBrandTypography(brandConfig.fontFamily))
      .withSpacing(this.generateBrandSpacing(brandConfig.spacingScale))
      .build(brandConfig.id, brandConfig.name);
  }

  private generateBrandColors(primaryColor: string): ColorPalette {
    const colors = this.generateColorPalette(primaryColor);
    
    return {
      primary: colors[500],
      primaryLight: colors[300],
      primaryDark: colors[700],
      secondary: colors[200],
      background: '#ffffff',
      surface: '#f8f9fa',
      text: {
        primary: '#1a1a1a',
        secondary: '#666666',
        inverse: '#ffffff',
      },
      border: '#e1e4e8',
      focus: colors[500],
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      ...colors,
    };
  }

  private generateColorPalette(baseColor: string): Record<string, string> {
    // Generate color palette from base color
    // This would use a color manipulation library
    return {
      50: this.lighten(baseColor, 0.9),
      100: this.lighten(baseColor, 0.8),
      200: this.lighten(baseColor, 0.6),
      300: this.lighten(baseColor, 0.4),
      400: this.lighten(baseColor, 0.2),
      500: baseColor,
      600: this.darken(baseColor, 0.1),
      700: this.darken(baseColor, 0.2),
      800: this.darken(baseColor, 0.3),
      900: this.darken(baseColor, 0.4),
    };
  }
}
```

---

## ⚡ Performance Optimization

### Theme Caching

```typescript
export class ThemeCache {
  private cache = new Map<string, Theme>();
  private cssCache = new Map<string, string>();

  getTheme(id: string): Theme | undefined {
    return this.cache.get(id);
  }

  setTheme(id: string, theme: Theme): void {
    this.cache.set(id, theme);
  }

  getCSS(theme: Theme): string | undefined {
    const key = this.generateThemeKey(theme);
    return this.cssCache.get(key);
  }

  setCSS(theme: Theme, css: string): void {
    const key = this.generateThemeKey(theme);
    this.cssCache.set(key, css);
  }

  private generateThemeKey(theme: Theme): string {
    return JSON.stringify({
      colors: theme.colors,
      typography: theme.typography,
      spacing: theme.spacing,
    });
  }
}
```

### Lazy Theme Loading

```typescript
export class LazyThemeLoader {
  private loadingPromises = new Map<string, Promise<Theme>>();

  async loadTheme(themeId: string): Promise<Theme> {
    // Return cached theme if available
    const cached = this.themeCache.getTheme(themeId);
    if (cached) return cached;

    // Return existing loading promise
    if (this.loadingPromises.has(themeId)) {
      return this.loadingPromises.get(themeId)!;
    }

    // Start loading theme
    const loadingPromise = this.fetchTheme(themeId);
    this.loadingPromises.set(themeId, loadingPromise);

    try {
      const theme = await loadingPromise;
      this.themeCache.setTheme(themeId, theme);
      return theme;
    } finally {
      this.loadingPromises.delete(themeId);
    }
  }

  private async fetchTheme(themeId: string): Promise<Theme> {
    const response = await fetch(`/api/themes/${themeId}`);
    if (!response.ok) {
      throw new Error(`Failed to load theme: ${themeId}`);
    }
    return response.json();
  }
}
```

---

## 📚 Usage Examples

### Basic Theme Usage

```typescript
// Using theme in components
export const ThemedButton: React.FC<ButtonProps> = ({ children, variant = 'primary' }) => {
  const theme = useTheme();
  const { getColor, getSpacing } = useThemeUtils();

  const buttonStyles = {
    backgroundColor: getColor(`button.${variant}.background`),
    color: getColor(`button.${variant}.text`),
    padding: `${getSpacing('sm')} ${getSpacing('md')}`,
    borderRadius: theme.borderRadius.md,
    border: 'none',
    cursor: 'pointer',
    transition: theme.animations.duration.normal,
  };

  return (
    <button style={buttonStyles}>
      {children}
    </button>
  );
};
```

### Custom Theme Creation

```typescript
// Creating a custom brand theme
const customTheme = new ThemeBuilder()
  .withColors({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
  })
  .withTypography({
    fontFamily: {
      primary: 'Inter, sans-serif',
      heading: 'Inter, sans-serif',
    },
  })
  .build('custom-dark', 'Custom Dark');

// Register the theme
const themeRegistry = useService(ThemeRegistry);
themeRegistry.registerCustomTheme(customTheme);
```

---

## 🎯 Migration Status

### UI Library Migration - COMPLETED ✅

The QuietSpace Frontend has successfully completed a comprehensive UI library migration, transitioning from legacy component libraries to a fully custom enterprise UI component system.

#### Migration Summary

| Phase | Status | Files Migrated | Key Achievements |
|-------|--------|---------------|------------------|
| **Phase 0** | ✅ Complete | JSS Infrastructure | Created enterprise styling foundation |
| **Phase 1** | ✅ Complete | 51+ Layout Files | Container, FlexContainer, CenterContainer |
| **Phase 2** | ✅ Complete | 15+ Interactive Files | Button, Input, navigation components |
| **Phase 3** | ✅ Complete | 11+ Display Files | Avatar, Skeleton, Loading components |
| **Phase 4** | ✅ Complete | 3 App Entry Points | main.tsx, App.tsx, DIApp.tsx cleanup |
| **Phase 5** | ✅ Complete | Package & Validation | Dependencies removed, testing complete |

#### Key Migration Statistics

- **Total Components Migrated**: 75+ enterprise components
- **Files Updated**: 51+ layout components + 25+ other components
- **JSS Migration**: 66+ files converted from `createUseStyles` to styled-components
- **BoxStyled Elimination**: 100% removal (112 references → 0 references)
- **Legacy Dependencies**: `react-jss` completely removed
- **Theme Integration**: 100% compatibility with existing Theme interface
- **Type Safety**: Full TypeScript coverage across all components

#### Component Migration Mapping

| Legacy Component | Enterprise Replacement | Status | Files Affected |
|-----------------|----------------------|---------|----------------|
| `BoxStyled` | `Container` | ✅ Complete | 51+ files |
| `FlexStyled` | `FlexContainer` | ✅ Complete | 15+ files |
| `Center` | `CenterContainer` | ✅ Complete | 4+ files |
| Legacy `Button` | Enterprise `Button` | ✅ Complete | 4 files |
| Legacy `Input` | Enterprise `Input` | ✅ Complete | 7 files |
| Legacy `Text/Title` | Enterprise `Text/Title` | ✅ Complete | 6 files |
| Legacy `Tabs` | Enterprise `Tabs` | ✅ Complete | 3 files |
| Legacy `Avatar` | Enterprise `Avatar` | ✅ Complete | 11+ files |
| Legacy `Skeleton` | Enterprise `Skeleton` | ✅ Complete | 3 files |
| Legacy `LoadingOverlay` | Enterprise `LoadingOverlay` | ✅ Complete | 2 files |

#### Architecture Improvements

**Before Migration:**
- Mixed component libraries (Mantine, custom JSS, legacy components)
- Inconsistent theme integration
- Scattered styling approaches
- Type safety gaps in some components

**After Migration:**
- Unified enterprise component library
- Consistent theme integration across all components
- Standardized styled-components approach
- Full TypeScript coverage and type safety
- Clean architecture compliance
- Centralized component management

#### Theme System Preservation

- ✅ **Existing Theme Interface**: No changes to `src/app/theme.ts`
- ✅ **Theme Hooks**: `useTheme` and `useThemeStore` preserved
- ✅ **Design Tokens**: All spacing, colors, typography maintained
- ✅ **Theme Switching**: Light/dark mode functionality intact
- ✅ **Multi-Platform Support**: Cross-platform compatibility preserved

#### Application Entry Points

**main.tsx Changes:**
- ❌ Removed: `MantineProvider` wrapper
- ❌ Removed: Legacy theme imports
- ✅ Maintained: Clean application bootstrap

**App.tsx Changes:**
- ❌ Removed: `ThemeProvider` (react-jss)
- ❌ Removed: Theme variable dependencies
- ✅ Maintained: Authentication and routing logic

**DIApp.tsx Changes:**
- ❌ Removed: Mantine styles import
- ✅ Fixed: Auth hook method calls
- ✅ Maintained: DI container integration

#### Performance Benefits

1. **Bundle Size**: Removed unused legacy dependencies
2. **Runtime Performance**: Optimized styled-components with theme caching
3. **Development Experience**: Centralized component imports and consistent APIs
4. **Maintainability**: Single source of truth for all UI components
5. **Type Safety**: Reduced runtime errors with comprehensive TypeScript coverage

#### Migration Validation

- ✅ **Compilation**: All TypeScript errors resolved
- ✅ **Functionality**: Existing features preserved
- ✅ **Theme Integration**: Components properly consume theme tokens
- ✅ **Accessibility**: WCAG 2.1 AA compliance maintained
- ✅ **Testing**: Basic functionality verified

#### Next Steps (Optional Enhancements)

While the core migration is complete, optional enhancements include:

1. **Component Testing**: Add comprehensive unit tests for enterprise components
2. **Storybook Integration**: Create component documentation
3. **Performance Monitoring**: Track component rendering performance
4. **Design System**: Expand component variants and themes
5. **Migration Guides**: Document patterns for future component additions

---

## 🎯 Best Practices

### Performance Best Practices

1. **Use CSS Variables** for dynamic theme changes
2. **Cache Computed Styles** to avoid recalculation
3. **Lazy Load** custom themes
4. **Minimize Re-renders** with proper memoization
5. **Optimize Bundle Size** with tree shaking

### Accessibility Best Practices

1. **Always Provide** high contrast alternatives
2. **Respect User Preferences** for reduced motion
3. **Ensure Sufficient** color contrast ratios
4. **Test with Screen Readers** regularly
5. **Provide Keyboard Navigation** for theme switcher

### Development Best Practices

1. **Follow Consistent** naming conventions
2. **Document Custom Themes** thoroughly
3. **Test Across** all platforms
4. **Use TypeScript** for type safety
5. **Implement Proper** error handling

### Enterprise Component Best Practices

1. **Use Central Imports**: Import from `@/shared/ui/components`
2. **Follow Theme Patterns**: Use provided theme utilities
3. **Maintain Type Safety**: Leverage TypeScript interfaces
4. **Preserve Accessibility**: Use proper ARIA attributes
5. **Test Responsiveness**: Verify components across breakpoints

---

*Last updated: January 2026*
*Version: 2.0.0 - Enterprise UI Migration Complete*
*Maintainers: QuietSpace Frontend Team*
