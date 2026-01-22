import 'reflect-metadata';
import {Injectable} from '../di';

// Theme service interface
interface IThemeService {
  getCurrentTheme(): string;
  setTheme(themeName: string): void;
  getThemeVariant(): string;
  isDarkMode(): boolean;
}

@Injectable({ lifetime: 'singleton' })
export class ThemeService implements IThemeService {
  private currentTheme = 'light';
  private currentVariant = 'default';

  constructor() {
    // Initialize with system preferences
    this.loadThemeFromStorage();
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  setTheme(themeName: string): void {
    this.currentTheme = themeName;
    this.saveThemeToStorage();
    console.log(`Theme changed to: ${themeName}`);
  }

  getThemeVariant(): string {
    return this.currentVariant;
  }

  setThemeVariant(variant: string): void {
    this.currentVariant = variant;
    this.saveThemeToStorage();
  }

  isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  private loadThemeFromStorage(): void {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) {
        const { theme, variant } = JSON.parse(stored);
        this.currentTheme = theme || 'light';
        this.currentVariant = variant || 'default';
      }
    } catch {
      // Use defaults if storage fails
      this.currentTheme = 'light';
      this.currentVariant = 'default';
    }
  }

  private saveThemeToStorage(): void {
    try {
      localStorage.setItem('theme', JSON.stringify({
        theme: this.currentTheme,
        variant: this.currentVariant
      }));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }
}

// Theme service factory
export function createThemeService(): IThemeService {
  return new ThemeService();
}
