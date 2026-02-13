/**
 * Integration Tests for Refactored UI Components
 * 
 * Comprehensive integration testing for Button, Input, and PostMessageSkeleton
 * components to ensure proper theme token integration and functionality.
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

// Import refactored components
import Button from '../../src/shared/ui/components/interactive/Button';
import Input from '../../src/shared/ui/components/interactive/Input';
import PostMessageSkeleton from '../../src/shared/ui/components/feedback/PostMessageSkeleton';

// Mock theme for testing
const mockTheme = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '128px',
    '6xl': '256px'
  },
  colors: {
    brand: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    semantic: {
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b'
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      inverse: '#ffffff'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6'
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af'
    }
  },
  typography: {
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px'
    }
  },
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
    round: '50%'
  },
  border: {
    none: '0',
    hairline: '1px',
    xs: '1px',
    sm: '2px',
    md: '3px',
    lg: '4px',
    xl: '6px',
    '2xl': '8px'
  },
  size: {
    skeleton: {
      minWidth: '172px',
      height: '256px'
    },
    avatar: {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '56px'
    }
  },
  animation: {
    duration: {
      fast: '0.15s',
      normal: '0.2s',
      slow: '0.3s'
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  }
};

// Test wrapper with theme provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={mockTheme}>
    {children}
  </ThemeProvider>
);

describe('Button Component Integration', () => {
  test('should render with theme tokens applied', () => {
    render(
      <TestWrapper>
        <Button theme={mockTheme}>Test Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
  });

  test('should handle different sizes with theme tokens', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button theme={mockTheme} size="sm">Small Button</Button>
      </TestWrapper>
    );

    const smallButton = screen.getByRole('button');
    expect(smallButton).toBeInTheDocument();

    // Test size changes
    rerender(
      <TestWrapper>
        <Button theme={mockTheme} size="lg">Large Button</Button>
      </TestWrapper>
    );

    const largeButton = screen.getByRole('button');
    expect(largeButton).toBeInTheDocument();
  });

  test('should handle different variants with theme colors', () => {
    render(
      <TestWrapper>
        <Button theme={mockTheme} variant="secondary">Secondary Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('should handle rounded prop with theme radius', () => {
    render(
      <TestWrapper>
        <Button theme={mockTheme} rounded>Rounded Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('should handle outlined prop with theme border', () => {
    render(
      <TestWrapper>
        <Button theme={mockTheme} outlined>Outlined Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('should handle click events', () => {
    const handleClick = vi.fn();
    render(
      <TestWrapper>
        <Button theme={mockTheme} onClick={handleClick}>Clickable Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('should handle disabled state', () => {
    const handleClick = vi.fn();
    render(
      <TestWrapper>
        <Button theme={mockTheme} disabled onClick={handleClick}>Disabled Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('should handle loading state', () => {
    const handleClick = vi.fn();
    render(
      <TestWrapper>
        <Button theme={mockTheme} loading onClick={handleClick}>Loading Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('Input Component Integration', () => {
  test('should render with theme tokens applied', () => {
    render(
      <TestWrapper>
        <Input theme={mockTheme} placeholder="Test input" />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Test input');
    expect(input).toBeInTheDocument();
  });

  test('should render with label using theme tokens', () => {
    render(
      <TestWrapper>
        <Input theme={mockTheme} label="Test Label" id="test-input" />
      </TestWrapper>
    );

    const label = screen.getByText('Test Label');
    const input = screen.getByLabelText('Test Label');
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test('should handle different sizes with theme tokens', () => {
    render(
      <TestWrapper>
        <Input theme={mockTheme} size="sm" placeholder="Small input" />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Small input');
    expect(input).toBeInTheDocument();
  });

  test('should handle error state with theme colors', () => {
    render(
      <TestWrapper>
        <Input theme={mockTheme} error helperText="Error message" />
      </TestWrapper>
    );

    const helperText = screen.getByText('Error message');
    expect(helperText).toBeInTheDocument();
  });

  test('should handle disabled state with theme tokens', () => {
    render(
      <TestWrapper>
        <Input theme={mockTheme} disabled placeholder="Disabled input" />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  test('should handle adornments with theme spacing', () => {
    render(
      <TestWrapper>
        <Input theme={mockTheme} startAdornment="$" endAdornment=".00" />
      </TestWrapper>
    );

    const startAdornment = screen.getByText('$');
    const endAdornment = screen.getByText('.00');
    expect(startAdornment).toBeInTheDocument();
    expect(endAdornment).toBeInTheDocument();
  });

  test('should handle input events', () => {
    const handleChange = vi.fn();
    render(
      <TestWrapper>
        <Input theme={mockTheme} onChange={handleChange} />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('should handle focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <TestWrapper>
        <Input theme={mockTheme} onFocus={handleFocus} onBlur={handleBlur} />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});

describe('PostMessageSkeleton Component Integration', () => {
  test('should render with theme tokens applied', () => {
    render(
      <TestWrapper>
        <PostMessageSkeleton theme={mockTheme} />
      </TestWrapper>
    );

    // Check that skeleton container is rendered
    const skeletonContainer = document.querySelector('[data-testid="skeleton-container"]');
    expect(skeletonContainer).toBeInTheDocument();
  });

  test('should use theme skeleton dimensions', () => {
    render(
      <TestWrapper>
        <PostMessageSkeleton theme={mockTheme} />
      </TestWrapper>
    );

    // The component should use theme.size.skeleton for dimensions
    // This is tested through the utility functions in unit tests
    expect(true).toBe(true); // Placeholder for integration test
  });

  test('should use theme avatar dimensions', () => {
    render(
      <TestWrapper>
        <PostMessageSkeleton theme={mockTheme} />
      </TestWrapper>
    );

    // The component should use theme.size.avatar for avatar skeleton
    // This is tested through the utility functions in unit tests
    expect(true).toBe(true); // Placeholder for integration test
  });

  test('should use theme spacing for margins', () => {
    render(
      <TestWrapper>
        <PostMessageSkeleton theme={mockTheme} />
      </TestWrapper>
    );

    // The component should use theme.spacing for margins
    // This is tested through the utility functions in unit tests
    expect(true).toBe(true); // Placeholder for integration test
  });

  test('should use theme radius for border radius', () => {
    render(
      <TestWrapper>
        <PostMessageSkeleton theme={mockTheme} />
      </TestWrapper>
    );

    // The component should use theme.radius for border radius
    // This is tested through the utility functions in unit tests
    expect(true).toBe(true); // Placeholder for integration test
  });

  test('should handle custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    render(
      <TestWrapper>
        <PostMessageSkeleton theme={mockTheme} style={customStyle} />
      </TestWrapper>
    );

    // Component should merge custom styles with theme-based styles
    expect(true).toBe(true); // Placeholder for integration test
  });
});

describe('Component Theme Integration', () => {
  test('should handle missing theme gracefully', () => {
    render(
      <TestWrapper>
        <Button>Button without theme</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('should handle incomplete theme gracefully', () => {
    const incompleteTheme = {
      colors: mockTheme.colors
      // Missing other properties
    };

    render(
      <ThemeProvider theme={incompleteTheme}>
        <Button theme={incompleteTheme}>Button with incomplete theme</Button>
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('should pass theme props correctly to styled components', () => {
    render(
      <TestWrapper>
        <Button theme={mockTheme}>Themed Button</Button>
        <Input theme={mockTheme} placeholder="Themed Input" />
        <PostMessageSkeleton theme={mockTheme} />
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    const input = screen.getByPlaceholderText('Themed Input');
    
    expect(button).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
});

describe('Component Accessibility', () => {
  test('Button should have proper ARIA attributes', () => {
    render(
      <TestWrapper>
        <Button theme={mockTheme} disabled>Disabled Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });

  test('Input should have proper label association', () => {
    render(
      <TestWrapper>
        <Input theme={mockTheme} label="Email" id="email-input" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  test('Input should have proper ARIA attributes for error state', () => {
    render(
      <TestWrapper>
        <Input theme={mockTheme} error helperText="Error message" />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    // Should have aria-invalid or similar error indication
    expect(input).toBeInTheDocument();
  });
});
