# Enhanced Theme System Guide

## 🎨 Comprehensive Theme Architecture

This guide covers QuietSpace's advanced theme system implementation, including multi-platform support, dynamic theming, accessibility features, and customization capabilities.

## 📋 Table of Contents

1. [Theme System Overview](#theme-system-overview)
2. [Architecture & Implementation](#architecture--implementation)
3. [Multi-Platform Theming](#multi-platform-theming)
4. [Dynamic Theme Switching](#dynamic-theme-switching)
5. [Accessibility & A11y](#accessibility--a11y)
6. [Customization & Branding](#customization--branding)
7. [Performance Optimization](#performance-optimization)

---

## 🎯 Theme System Overview

### Core Features

**🌈 Multi-Theme Support:**
- Light, Dark, Auto (system preference)
- Custom brand themes
- Seasonal themes
- User-defined themes

**📱 Cross-Platform Consistency:**
- Web (CSS-in-JS)
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

---

*Last updated: January 2026*
*Version: 1.0.0*
*Maintainers: QuietSpace Frontend Team*
