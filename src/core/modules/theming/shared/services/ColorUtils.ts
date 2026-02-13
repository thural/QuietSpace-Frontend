/**
 * Color Utilities
 *
 * Provides advanced color manipulation utilities with HSL support and validation.
 * Follows dependency injection pattern for better testability.
 */

/**
 * HSL Color Interface
 */
export interface HSLColor {
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100
    a?: number; // 0-1
}

/**
 * RGB Color Interface
 */
export interface RGBColor {
    r: number; // 0-255
    g: number; // 0-255
    b: number; // 0-255
    a?: number; // 0-1
}

/**
 * Color Utils Interface
 */
export interface IColorUtils {
    lightenColor(color: string, amount: number): string;
    darkenColor(color: string, amount: number): string;
    getContrastColor(backgroundColor: string): string;
    validateColor(color: string): boolean;
    hexToHsl(color: string): HSLColor;
    hslToHex(hsl: HSLColor): string;
    hexToRgb(color: string): RGBColor;
    rgbToHex(rgb: RGBColor): string;
    getRelativeLuminance(color: string): number;
    getContrastRatio(color1: string, color2: string): number;
}

/**
 * Color Utils Implementation
 * 
 * Handles color manipulation with HSL support and validation.
 * Uses dependency injection for better testability and flexibility.
 */
export class ColorUtils implements IColorUtils {
    private static instance: ColorUtils;

    private constructor() {
        // Private constructor for singleton pattern
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): ColorUtils {
        if (!ColorUtils.instance) {
            ColorUtils.instance = new ColorUtils();
        }
        return ColorUtils.instance;
    }

    /**
     * Lighten a color by amount using HSL
     */
    public lightenColor(color: string, amount: number): string {
        const hsl = this.hexToHsl(color);
        hsl.l = Math.min(100, hsl.l + amount);
        return this.hslToHex(hsl);
    }

    /**
     * Darken a color by amount using HSL
     */
    public darkenColor(color: string, amount: number): string {
        const hsl = this.hexToHsl(color);
        hsl.l = Math.max(0, hsl.l - amount);
        return this.hslToHex(hsl);
    }

    /**
     * Get contrast color (black or white) for background using WCAG luminance
     */
    public getContrastColor(backgroundColor: string): string {
        const luminance = this.getRelativeLuminance(backgroundColor);
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    /**
     * Validate color format
     */
    public validateColor(color: string): boolean {
        if (!color || typeof color !== 'string') {
            return false;
        }

        // Remove whitespace
        color = color.trim();

        // Hex colors
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            return true;
        }

        // RGB/RGBA colors
        if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
            return true;
        }

        // HSL/HSLA colors
        if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
            return true;
        }

        // Named colors (basic validation)
        if (/^[a-z]+$/i.test(color)) {
            return this.isValidNamedColor(color);
        }

        return false;
    }

    /**
     * Convert hex to HSL
     */
    public hexToHsl(color: string): HSLColor {
        const rgb = this.hexToRgb(color);
        return this.rgbToHsl(rgb);
    }

    /**
     * Convert HSL to hex
     */
    public hslToHex(hsl: HSLColor): string {
        const rgb = this.hslToRgb(hsl);
        return this.rgbToHex(rgb);
    }

    /**
     * Convert hex to RGB
     */
    public hexToRgb(color: string): RGBColor {
        // Remove # if present
        color = color.replace('#', '');

        // Handle 3-digit hex
        if (color.length === 3) {
            color = color.split('').map(c => c + c).join('');
        }

        // Parse hex values
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        return { r, g, b };
    }

    /**
     * Convert RGB to hex
     */
    public rgbToHex(rgb: RGBColor): string {
        const toHex = (n: number): string => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        const r = toHex(Math.max(0, Math.min(255, rgb.r)));
        const g = toHex(Math.max(0, Math.min(255, rgb.g)));
        const b = toHex(Math.max(0, Math.min(255, rgb.b)));

        return `#${r}${g}${b}`;
    }

    /**
     * Get relative luminance of a color (WCAG standard)
     */
    public getRelativeLuminance(color: string): number {
        const rgb = this.hexToRgb(color);

        // Normalize RGB values to 0-1 range
        const r = this.normalizeColorComponent(rgb.r);
        const g = this.normalizeColorComponent(rgb.g);
        const b = this.normalizeColorComponent(rgb.b);

        // Calculate luminance using WCAG formula
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Get contrast ratio between two colors (WCAG standard)
     */
    public getContrastRatio(color1: string, color2: string): number {
        const lum1 = this.getRelativeLuminance(color1);
        const lum2 = this.getRelativeLuminance(color2);

        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);

        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * Convert RGB to HSL
     */
    private rgbToHsl(rgb: RGBColor): HSLColor {
        // Normalize RGB to 0-1 range
        let r = rgb.r / 255;
        let g = rgb.g / 255;
        let b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
            a: rgb.a
        };
    }

    /**
     * Convert HSL to RGB
     */
    private hslToRgb(hsl: HSLColor): RGBColor {
        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;

        let r, g, b;

        if (s === 0) {
            // Achromatic
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number): number => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
            a: hsl.a
        };
    }

    /**
     * Normalize color component for luminance calculation
     */
    private normalizeColorComponent(c: number): number {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    /**
     * Check if named color is valid
     */
    private isValidNamedColor(color: string): boolean {
        // Basic named colors (can be expanded)
        const namedColors = [
            'black', 'white', 'red', 'green', 'blue', 'yellow',
            'cyan', 'magenta', 'gray', 'grey', 'orange', 'purple',
            'pink', 'brown', 'transparent'
        ];

        return namedColors.includes(color.toLowerCase());
    }
}

/**
 * Export singleton instance for convenience
 */
export const colorUtils = ColorUtils.getInstance();
