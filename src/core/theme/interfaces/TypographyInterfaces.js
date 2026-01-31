/**
 * Typography-related interfaces.
 * 
 * Focused interfaces for typography system functionality.
 * Segregated from larger theme interfaces for better modularity.
 */

/**
 * Font size interface
 * @interface FontSize
 * @description Defines font size scale
 */
export class FontSize {
  /**
   * @param {string} xs - Extra small font size
   * @param {string} sm - Small font size
   * @param {string} base - Base font size
   * @param {string} lg - Large font size
   * @param {string} xl - Extra large font size
   * @param {string} twoXl - 2x large font size
   * @param {string} threeXl - 3x large font size
   * @param {string} fourXl - 4x large font size
   * @param {string} fiveXl - 5x large font size
   * @param {string} sixXl - 6x large font size
   */
  constructor(xs, sm, base, lg, xl, twoXl, threeXl, fourXl, fiveXl, sixXl) {
    this.xs = xs;
    this.sm = sm;
    this.base = base;
    this.lg = lg;
    this.xl = xl;
    this['2xl'] = twoXl;
    this['3xl'] = threeXl;
    this['4xl'] = fourXl;
    this['5xl'] = fiveXl;
    this['6xl'] = sixXl;
  }

  /** @type {string} Extra small font size */
  xs;

  /** @type {string} Small font size */
  sm;

  /** @type {string} Base font size */
  base;

  /** @type {string} Large font size */
  lg;

  /** @type {string} Extra large font size */
  xl;

  /** @type {string} 2x large font size */
  '2xl';

  /** @type {string} 3x large font size */
  '3xl';

  /** @type {string} 4x large font size */
  '4xl';

  /** @type {string} 5x large font size */
  '5xl';

  /** @type {string} 6x large font size */
  '6xl';
}

/**
 * Font weight interface
 * @interface FontWeight
 * @description Defines font weight variations
 */
export class FontWeight {
  /**
   * @param {string} thin - Thin font weight
   * @param {string} extralight - Extra light font weight
   * @param {string} light - Light font weight
   * @param {string} normal - Normal font weight
   * @param {string} medium - Medium font weight
   * @param {string} semibold - Semibold font weight
   * @param {string} bold - Bold font weight
   * @param {string} extrabold - Extra bold font weight
   * @param {string} black - Black font weight
   */
  constructor(thin, extralight, light, normal, medium, semibold, bold, extrabold, black) {
    this.thin = thin;
    this.extralight = extralight;
    this.light = light;
    this.normal = normal;
    this.medium = medium;
    this.semibold = semibold;
    this.bold = bold;
    this.extrabold = extrabold;
    this.black = black;
  }

  /** @type {string} Thin font weight */
  thin;

  /** @type {string} Extra light font weight */
  extralight;

  /** @type {string} Light font weight */
  light;

  /** @type {string} Normal font weight */
  normal;

  /** @type {string} Medium font weight */
  medium;

  /** @type {string} Semibold font weight */
  semibold;

  /** @type {string} Bold font weight */
  bold;

  /** @type {string} Extra bold font weight */
  extrabold;

  /** @type {string} Black font weight */
  black;
}

/**
 * Line height interface
 * @interface LineHeight
 * @description Defines line height variations
 */
export class LineHeight {
  /**
   * @param {string} tight - Tight line height
   * @param {string} normal - Normal line height
   * @param {string} relaxed - Relaxed line height
   */
  constructor(tight, normal, relaxed) {
    this.tight = tight;
    this.normal = normal;
    this.relaxed = relaxed;
  }

  /** @type {string} Tight line height */
  tight;

  /** @type {string} Normal line height */
  normal;

  /** @type {string} Relaxed line height */
  relaxed;
}

/**
 * Font family interface
 * @interface FontFamily
 * @description Defines font family variations
 */
export class FontFamily {
  /**
   * @param {string} sans - Sans-serif font family
   * @param {string} serif - Serif font family
   * @param {string} mono - Monospace font family
   */
  constructor(sans, serif, mono) {
    this.sans = sans;
    this.serif = serif;
    this.mono = mono;
  }

  /** @type {string} Sans-serif font family */
  sans;

  /** @type {string} Serif font family */
  serif;

  /** @type {string} Monospace font family */
  mono;
}

/**
 * Typography system interface
 * @interface TypographySystem
 * @description Defines complete typography system
 */
export class TypographySystem {
  /**
   * @param {FontSize} fontSize - Font size scale
   * @param {FontWeight} fontWeight - Font weight variations
   * @param {LineHeight} lineHeight - Line height variations
   * @param {FontFamily} fontFamily - Font family variations
   */
  constructor(fontSize, fontWeight, lineHeight, fontFamily) {
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.lineHeight = lineHeight;
    this.fontFamily = fontFamily;
  }

  /** @type {FontSize} Font size scale */
  fontSize;

  /** @type {FontWeight} Font weight variations */
  fontWeight;

  /** @type {LineHeight} Line height variations */
  lineHeight;

  /** @type {FontFamily} Font family variations */
  fontFamily;
}

/**
 * Typography utilities interface
 * @interface TypographyUtilities
 * @description Defines typography utility functions
 */
export class TypographyUtilities {
  /**
   * @param {Function} getTypography - Get typography by key
   * @param {Function} getFontSize - Get font size by key
   * @param {Function} getFontWeight - Get font weight by key
   */
  constructor(getTypography, getFontSize, getFontWeight) {
    this.getTypography = getTypography;
    this.getFontSize = getFontSize;
    this.getFontWeight = getFontWeight;
  }

  /**
   * @type {Function}
   * @description Get typography by key
   * @param {string} key - Typography key
   * @returns {*} Typography value
   */
  getTypography;

  /**
   * @type {Function}
   * @description Get font size by key
   * @param {string} size - Font size key
   * @returns {string} Font size value
   */
  getFontSize;

  /**
   * @type {Function}
   * @description Get font weight by key
   * @param {string} weight - Font weight key
   * @returns {string} Font weight value
   */
  getFontWeight;
}
