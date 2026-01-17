# Responsive & Adaptive Design Guide

## 📱 Multi-Device Design System

This comprehensive guide covers QuietSpace's responsive and adaptive design strategy, ensuring optimal user experience across all devices, screen sizes, and platforms.

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Responsive Breakpoints](#responsive-breakpoints)
3. [Adaptive Components](#adaptive-components)
4. [Mobile-First Strategy](#mobile-first-strategy)
5. [Platform-Specific Adaptations](#platform-specific-adaptations)
6. [Performance Optimization](#performance-optimization)
7. [Testing & Validation](#testing--validation)

---

## 🎯 Design Philosophy

### Core Principles

**📱 Mobile-First Approach:**
- Design for smallest screens first
- Progressively enhance for larger screens
- Optimize touch interactions on mobile
- Prioritize content hierarchy

**🖥️ Responsive Enhancement:**
- Fluid layouts that adapt to screen size
- Flexible typography and spacing
- Optimized component variations
- Context-aware functionality

**♿ Accessibility First:**
- WCAG 2.1 AA compliance across all devices
- Touch targets meet minimum size requirements
- Keyboard navigation on all platforms
- Screen reader optimization

**⚡ Performance Optimized:**
- Lazy loading for off-screen content
- Optimized images per device
- Efficient CSS and JavaScript
- Minimal layout shifts

### Device Categories

```typescript
export enum DeviceCategory {
  MOBILE = 'mobile',        // 320px - 767px
  TABLET = 'tablet',        // 768px - 1023px
  DESKTOP = 'desktop',      // 1024px - 1439px
  WIDE = 'wide',           // 1440px - 1919px
  ULTRA_WIDE = 'ultra-wide' // 1920px+
}

export interface DeviceInfo {
  category: DeviceCategory;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  touchCapable: boolean;
  platform: 'web' | 'mobile' | 'desktop';
}
```

---

## 📏 Responsive Breakpoints

### Breakpoint System

```typescript
export const breakpoints = {
  xs: '320px',    // Extra small devices
  sm: '480px',    // Small devices
  md: '768px',    // Medium devices (tablets)
  lg: '1024px',   // Large devices (desktops)
  xl: '1280px',   // Extra large devices
  xxl: '1440px',  // Extra extra large devices
  ultra: '1920px', // Ultra wide displays
} as const;

export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  xxl: `@media (min-width: ${breakpoints.xxl})`,
  ultra: `@media (min-width: ${breakpoints.ultra})`,
  
  // Max-width queries
  xsMax: `@media (max-width: ${breakpoints.sm})`,
  smMax: `@media (max-width: ${breakpoints.md})`,
  mdMax: `@media (max-width: ${breakpoints.lg})`,
  lgMax: `@media (max-width: ${breakpoints.xl})`,
  xlMax: `@media (max-width: ${breakpoints.xxl})`,
  
  // Range queries
  mobile: `@media (max-width: ${breakpoints.md})`,
  tablet: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`,
  
  // Orientation queries
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // High DPI displays
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',
  mouse: '@media (hover: hover) and (pointer: fine)',
} as const;
```

### Responsive Hook

```typescript
export const useResponsive = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    category: DeviceCategory.DESKTOP,
    width: 1024,
    height: 768,
    orientation: 'landscape',
    pixelRatio: 1,
    touchCapable: false,
    platform: 'web',
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const category = getDeviceCategory(width);
      const orientation = width > height ? 'landscape' : 'portrait';
      const pixelRatio = window.devicePixelRatio || 1;
      const touchCapable = 'ontouchstart' in window;

      setDeviceInfo({
        category,
        width,
        height,
        orientation,
        pixelRatio,
        touchCapable,
        platform: getPlatform(),
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

const getDeviceCategory = (width: number): DeviceCategory => {
  if (width < 768) return DeviceCategory.MOBILE;
  if (width < 1024) return DeviceCategory.TABLET;
  if (width < 1440) return DeviceCategory.DESKTOP;
  if (width < 1920) return DeviceCategory.WIDE;
  return DeviceCategory.ULTRA_WIDE;
};

const getPlatform = (): 'web' | 'mobile' | 'desktop' => {
  if (typeof window !== 'undefined' && window.require) {
    return 'desktop';
  }
  if (typeof window !== 'undefined' && 'ReactNative' in window) {
    return 'mobile';
  }
  return 'web';
};
```

---

## 🧩 Adaptive Components

### Responsive Layout Component

```typescript
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
  className = '',
}) => {
  const { category, orientation } = useResponsive();
  const theme = useTheme();

  const layoutStyles = useMemo(() => {
    const baseStyles = {
      display: 'grid',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
    };

    switch (category) {
      case DeviceCategory.MOBILE:
        return {
          ...baseStyles,
          gridTemplateAreas: `
            "header"
            "main"
            "footer"
          `,
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateColumns: '1fr',
        };

      case DeviceCategory.TABLET:
        return {
          ...baseStyles,
          gridTemplateAreas: orientation === 'portrait' ? `
            "header"
            "sidebar"
            "main"
            "footer"
          ` : `
            "header header"
            "sidebar main"
            "footer footer"
          `,
          gridTemplateRows: orientation === 'portrait' ? 'auto auto 1fr auto' : 'auto 1fr auto',
          gridTemplateColumns: orientation === 'portrait' ? '1fr' : '250px 1fr',
        };

      case DeviceCategory.DESKTOP:
      case DeviceCategory.WIDE:
      case DeviceCategory.ULTRA_WIDE:
        return {
          ...baseStyles,
          gridTemplateAreas: `
            "header header"
            "sidebar main"
            "footer footer"
          `,
          gridTemplateRows: 'auto 1fr auto',
          gridTemplateColumns: '280px 1fr',
        };

      default:
        return baseStyles;
    }
  }, [category, orientation, theme]);

  return (
    <div className={`responsive-layout ${className}`} style={layoutStyles}>
      {header && (
        <div style={{ gridArea: 'header' }}>
          {header}
        </div>
      )}
      
      {sidebar && category !== DeviceCategory.MOBILE && (
        <div style={{ gridArea: 'sidebar' }}>
          {sidebar}
        </div>
      )}
      
      <main style={{ gridArea: 'main' }}>
        {children}
      </main>
      
      {footer && (
        <div style={{ gridArea: 'footer' }}>
          {footer}
        </div>
      )}
    </div>
  );
};
```

### Adaptive Navigation

```typescript
export const AdaptiveNavigation: React.FC<NavigationProps> = ({ items }) => {
  const { category, touchCapable } = useResponsive();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (category === DeviceCategory.MOBILE) {
    return (
      <MobileNavigation
        items={items}
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
    );
  }

  if (category === DeviceCategory.TABLET) {
    return (
      <TabletNavigation
        items={items}
        touchCapable={touchCapable}
      />
    );
  }

  return (
    <DesktopNavigation
      items={items}
      touchCapable={touchCapable}
    />
  );
};

// Mobile Navigation
const MobileNavigation: React.FC<MobileNavigationProps> = ({ items, isOpen, onToggle }) => {
  const theme = useTheme();

  return (
    <nav className="mobile-navigation">
      <button
        className="mobile-menu-toggle"
        onClick={onToggle}
        aria-label="Toggle navigation menu"
        style={{
          background: 'none',
          border: 'none',
          padding: theme.spacing.sm,
          cursor: 'pointer',
        }}
      >
        <MenuIcon size={24} color={theme.colors.text.primary} />
      </button>

      {isOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
          onClick={onToggle}
        >
          <div
            className="mobile-menu"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '280px',
              backgroundColor: theme.colors.surface,
              boxShadow: theme.shadows.lg,
              padding: theme.spacing.lg,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.lg }}>
              <h2 style={{ margin: 0, color: theme.colors.text.primary }}>Menu</h2>
              <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <CloseIcon size={24} color={theme.colors.text.primary} />
              </button>
            </div>
            
            {items.map((item) => (
              <div key={item.id} style={{ marginBottom: theme.spacing.md }}>
                <NavigationItem item={item} variant="mobile" />
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Navigation
const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ items, touchCapable }) => {
  const theme = useTheme();

  return (
    <nav className="desktop-navigation" style={{
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.lg,
      padding: `0 ${theme.spacing.lg}`,
    }}>
      {items.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          variant="desktop"
          touchCapable={touchCapable}
        />
      ))}
    </nav>
  );
};
```

### Adaptive Grid System

```typescript
export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 },
  gap = 'md',
  className = '',
}) => {
  const { category } = useResponsive();
  const theme = useTheme();

  const gridStyles = useMemo(() => {
    const getColumns = () => {
      switch (category) {
        case DeviceCategory.MOBILE:
          return columns.xs || 1;
        case DeviceCategory.TABLET:
          return columns.md || 2;
        case DeviceCategory.DESKTOP:
          return columns.lg || 3;
        case DeviceCategory.WIDE:
          return columns.xl || 4;
        case DeviceCategory.ULTRA_WIDE:
          return columns.xxl || 5;
        default:
          return 1;
      }
    };

    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
      gap: theme.spacing[gap] || theme.spacing.md,
      width: '100%',
    };
  }, [category, columns, gap, theme]);

  return (
    <div className={`adaptive-grid ${className}`} style={gridStyles}>
      {children}
    </div>
  );
};

// Usage example
export const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <AdaptiveGrid
      columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
      gap="lg"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </AdaptiveGrid>
  );
};
```

---

## 📱 Mobile-First Strategy

### Mobile-First CSS Approach

```typescript
// Mobile-first styles
export const mobileFirstStyles = {
  // Base styles (mobile)
  container: {
    width: '100%',
    padding: '16px',
    margin: '0 auto',
  },

  // Tablet enhancements
  [mediaQueries.md]: {
    container: {
      maxWidth: '768px',
      padding: '24px',
    },
  },

  // Desktop enhancements
  [mediaQueries.lg]: {
    container: {
      maxWidth: '1024px',
      padding: '32px',
    },
  },

  // Wide enhancements
  [mediaQueries.xl]: {
    container: {
      maxWidth: '1280px',
      padding: '40px',
    },
  },

  // Ultra-wide enhancements
  [mediaQueries.xxl]: {
    container: {
      maxWidth: '1440px',
      padding: '48px',
    },
  },
};
```

### Touch-Optimized Components

```typescript
export const TouchOptimizedButton: React.FC<TouchButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  ...props
}) => {
  const { touchCapable } = useResponsive();
  const theme = useTheme();

  const buttonStyles = useMemo(() => {
    const baseStyles = {
      border: 'none',
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      transition: theme.animations.duration.normal,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.medium,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
    };

    // Touch-optimized sizing
    const touchSizes = {
      sm: {
        minHeight: touchCapable ? '44px' : '32px',
        padding: touchCapable ? '8px 16px' : '4px 12px',
        fontSize: theme.typography.fontSize.sm,
      },
      md: {
        minHeight: touchCapable ? '48px' : '40px',
        padding: touchCapable ? '12px 24px' : '8px 16px',
        fontSize: theme.typography.fontSize.base,
      },
      lg: {
        minHeight: touchCapable ? '52px' : '48px',
        padding: touchCapable ? '16px 32px' : '12px 24px',
        fontSize: theme.typography.fontSize.lg,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.text.inverse,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        color: theme.colors.text.inverse,
      },
      outline: {
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `2px solid ${theme.colors.primary}`,
      },
    };

    return {
      ...baseStyles,
      ...touchSizes[size],
      ...variantStyles[variant],
    };
  }, [touchCapable, size, variant, theme]);

  return (
    <button style={buttonStyles} {...props}>
      {children}
    </button>
  );
};
```

### Gesture Support

```typescript
export const useGestures = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void
) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;

    const isLeftSwipe = deltaX < -minSwipeDistance && Math.abs(deltaY) < minSwipeDistance;
    const isRightSwipe = deltaX > minSwipeDistance && Math.abs(deltaY) < minSwipeDistance;
    const isUpSwipe = deltaY < -minSwipeDistance && Math.abs(deltaX) < minSwipeDistance;
    const isDownSwipe = deltaY > minSwipeDistance && Math.abs(deltaX) < minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
    if (isUpSwipe && onSwipeUp) onSwipeUp();
    if (isDownSwipe && onSwipeDown) onSwipeDown();
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
```

---

## 🖥️ Platform-Specific Adaptations

### Web Platform Adaptations

```typescript
export const WebAdaptiveComponent: React.FC = () => {
  const { category, width } = useResponsive();

  const webStyles = useMemo(() => {
    const baseStyles = {
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
    };

    // Web-specific optimizations
    const webEnhancements = {
      // Smooth scrolling for desktop
      ...(category !== DeviceCategory.MOBILE && {
        scrollBehavior: 'smooth',
      }),
      
      // Hover effects for mouse devices
      ...(window.matchMedia('(hover: hover)').matches && {
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'transform 0.2s ease',
        },
      }),
      
      // Responsive typography
      fontSize: width < 768 ? '14px' : width < 1024 ? '16px' : '18px',
      
      // Responsive spacing
      padding: width < 768 ? '16px' : width < 1024 ? '24px' : '32px',
    };

    return { ...baseStyles, ...webEnhancements };
  }, [category, width]);

  return <div style={webStyles}>Web Content</div>;
};
```

### Mobile Platform Adaptations

```typescript
export const MobileAdaptiveComponent: React.FC = () => {
  const { category, orientation } = useResponsive();

  const mobileStyles = useMemo(() => {
    const baseStyles = {
      width: '100%',
      minHeight: '100vh',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
    };

    // Mobile-specific optimizations
    const mobileEnhancements = {
      // Safe area insets for notched devices
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
      
      // Touch-friendly sizing
      minHeight: '44px', // Minimum touch target size
      
      // Orientation-specific adjustments
      ...(orientation === 'landscape' && {
        display: 'flex',
        flexDirection: 'row',
      }),
      
      // Prevent zoom on input focus
      fontSize: '16px', // Prevents iOS zoom
    };

    return { ...baseStyles, ...mobileEnhancements };
  }, [category, orientation]);

  return <div style={mobileStyles}>Mobile Content</div>;
};
```

### Desktop Platform Adaptations

```typescript
export const DesktopAdaptiveComponent: React.FC = () => {
  const { category } = useResponsive();

  const desktopStyles = useMemo(() => {
    const baseStyles = {
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
    };

    // Desktop-specific optimizations
    const desktopEnhancements = {
      // Window controls integration
      paddingTop: 'env(titlebar-area-height, 0)',
      
      // Focus styles for keyboard navigation
      ':focus': {
        outline: `2px solid ${theme.colors.focus}`,
        outlineOffset: '2px',
      },
      
      // Hover states
      ':hover': {
        backgroundColor: theme.colors.surface,
      },
      
      // Large screen optimizations
      ...(category === DeviceCategory.ULTRA_WIDE && {
        maxWidth: '1920px',
        margin: '0 auto',
      }),
    };

    return { ...baseStyles, ...desktopEnhancements };
  }, [category]);

  return <div style={desktopStyles}>Desktop Content</div>;
};
```

---

## ⚡ Performance Optimization

### Lazy Loading Components

```typescript
export const LazyAdaptiveComponent: React.FC<{ componentType: string }> = ({ componentType }) => {
  const { category } = useResponsive();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const module = await import(`./components/${componentType}`);
        setComponent(() => module.default);
      } catch (error) {
        console.error(`Failed to load component: ${componentType}`, error);
      }
    };

    // Load component based on device category
    if (category === DeviceCategory.MOBILE) {
      loadComponent();
    } else {
      // Delay loading for desktop to prioritize mobile
      const timer = setTimeout(loadComponent, 100);
      return () => clearTimeout(timer);
    }
  }, [componentType, category]);

  if (!Component) {
    return <div>Loading...</div>;
  }

  return <Component />;
};
```

### Responsive Image Optimization

```typescript
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
}) => {
  const { category, pixelRatio } = useResponsive();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateImageSrc = () => {
      // Determine optimal image size based on device
      let width = 800; // Default
      let quality = 80; // Default

      switch (category) {
        case DeviceCategory.MOBILE:
          width = 400;
          quality = 70;
          break;
        case DeviceCategory.TABLET:
          width = 600;
          quality = 75;
          break;
        case DeviceCategory.DESKTOP:
          width = 800;
          quality = 80;
          break;
        case DeviceCategory.WIDE:
          width = 1200;
          quality = 85;
          break;
        case DeviceCategory.ULTRA_WIDE:
          width = 1600;
          quality = 90;
          break;
      }

      // Adjust for high DPI displays
      if (pixelRatio > 1) {
        width = Math.floor(width * pixelRatio);
      }

      // Generate responsive image URL
      return `${src}?w=${width}&q=${quality}&format=webp`;
    };

    const newSrc = generateImageSrc();
    setImageSrc(newSrc);
    setIsLoading(true);
  }, [src, category, pixelRatio]);

  return (
    <div className={`responsive-image ${className}`}>
      {isLoading && (
        <div style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          Loading...
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        style={{
          width: '100%',
          height: 'auto',
          display: isLoading ? 'none' : 'block',
        }}
      />
    </div>
  );
};
```

---

## 🧪 Testing & Validation

### Responsive Testing Hook

```typescript
export const useResponsiveTesting = () => {
  const [testViewport, setTestViewport] = useState<{
    width: number;
    height: number;
    category: DeviceCategory;
  } | null>(null);

  const testViewport = useCallback((width: number, height: number) => {
    const category = getDeviceCategory(width);
    setTestViewport({ width, height, category });
  }, []);

  const resetViewport = useCallback(() => {
    setTestViewport(null);
  }, []);

  const mockDevice = useCallback((device: keyof typeof devicePresets) => {
    const preset = devicePresets[device];
    testViewport(preset.width, preset.height);
  }, [testViewport]);

  return {
    testViewport,
    mockDevice,
    resetViewport,
    currentTest: testViewport,
  };
};

const devicePresets = {
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 12': { width: 390, height: 844 },
  'iPad': { width: 768, height: 1024 },
  'iPad Pro': { width: 1024, height: 1366 },
  'MacBook Air': { width: 1440, height: 900 },
  'iMac': { width: 1920, height: 1080 },
  'Ultra Wide': { width: 2560, height: 1440 },
};
```

### Visual Regression Testing

```typescript
export const ResponsiveVisualTest: React.FC<{ component: React.ComponentType }> = ({ component: Component }) => {
  const { mockDevice, resetViewport } = useResponsiveTesting();
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const runResponsiveTests = async () => {
    const devices = Object.keys(devicePresets) as Array<keyof typeof devicePresets>;
    const newScreenshots: string[] = [];

    for (const device of devices) {
      mockDevice(device);
      
      // Wait for layout to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture screenshot
      const screenshot = await captureScreenshot();
      newScreenshots.push(screenshot);
    }

    resetViewport();
    setScreenshots(newScreenshots);
  };

  return (
    <div>
      <button onClick={runResponsiveTests}>
        Run Responsive Tests
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {screenshots.map((screenshot, index) => (
          <div key={index}>
            <h3>{Object.keys(devicePresets)[index]}</h3>
            <img src={screenshot} alt={`${Object.keys(devicePresets)[index]} screenshot`} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 📚 Best Practices

### Design Guidelines

**1. Touch Targets:**
- Minimum 44px × 44px for touch targets
- 8px spacing between touch targets
- Larger targets for critical actions

**2. Typography:**
- Minimum 16px font size for body text
- Responsive line heights (1.4-1.6)
- Adequate contrast ratios (4.5:1 minimum)

**3. Spacing:**
- Consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Adequate padding for touch targets
- Responsive margins and padding

**4. Navigation:**
- Clear visual hierarchy
- Consistent placement across devices
- Easy access to primary actions

### Performance Guidelines

**1. Image Optimization:**
- Serve appropriately sized images
- Use modern formats (WebP, AVIF)
- Implement lazy loading

**2. CSS Optimization:**
- Mobile-first CSS approach
- Minimize layout shifts
- Use efficient selectors

**3. JavaScript Optimization:**
- Load critical JavaScript first
- Use code splitting
- Optimize bundle size

### Accessibility Guidelines

**1. Keyboard Navigation:**
- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order

**2. Screen Reader Support:**
- Semantic HTML elements
- ARIA labels and descriptions
- Alternative text for images

**3. Visual Accessibility:**
- Sufficient color contrast
- Text resizing support
- High contrast mode support

---

## 🎯 Implementation Checklist

### Development Checklist

**Mobile-First Development:**
- [ ] Design for smallest screen first
- [ ] Test on actual mobile devices
- [ ] Optimize touch interactions
- [ ] Implement gesture support

**Responsive Testing:**
- [ ] Test all breakpoints
- [ ] Verify component behavior
- [ ] Check performance impact
- [ ] Validate accessibility

**Cross-Platform Consistency:**
- [ ] Maintain design consistency
- [ ] Optimize for each platform
- [ ] Test on all target platforms
- [ ] Ensure feature parity

### Launch Checklist

**Performance Validation:**
- [ ] Page load time < 3 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Largest Contentful Paint < 2.5 seconds
- [ ] Cumulative Layout Shift < 0.1

**Accessibility Validation:**
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader testing
- [ ] Keyboard navigation testing
- [ ] Color contrast validation

**Device Testing:**
- [ ] Mobile devices (iOS/Android)
- [ ] Tablet devices
- [ ] Desktop browsers
- [ ] Assistive technologies

---

*Last updated: January 2026*
*Version: 1.0.0*
*Maintainers: QuietSpace Frontend Team*
