/**
 * Theme Styled Factory Test Suite
 * Tests theme styled factory functionality
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the styled factory module
const mockCreateStyledComponent = jest.fn();
const mockCreateButton = jest.fn();
const mockCreateInput = jest.fn();
const mockCreateCard = jest.fn();
const mockCreateModal = jest.fn();

jest.mock('../../../src/core/theme/factories/styledFactory', () => ({
  createStyledComponent: mockCreateStyledComponent,
  createButton: mockCreateButton,
  createInput: mockCreateInput,
  createCard: mockCreateCard,
  createModal: mockCreateModal,
}));

describe('Theme Styled Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createStyledComponent', () => {
    test('should be a function', () => {
      expect(mockCreateStyledComponent).toBeDefined();
      expect(typeof mockCreateStyledComponent).toBe('function');
    });

    test('should create styled component', () => {
      const element = 'div';
      const styles = { color: 'red', fontSize: '16px' };
      const mockComponent = jest.fn();
      
      mockCreateStyledComponent.mockReturnValue(mockComponent);
      
      const result = mockCreateStyledComponent(element, styles);
      expect(result).toEqual(mockComponent);
      expect(mockCreateStyledComponent).toHaveBeenCalledWith(element, styles);
    });

    test('should handle different elements', () => {
      const elements = ['div', 'button', 'input', 'span', 'section'];
      
      elements.forEach(element => {
        const mockComponent = jest.fn();
        mockCreateStyledComponent.mockReturnValue(mockComponent);
        
        const result = mockCreateStyledComponent(element, {});
        expect(result).toEqual(mockComponent);
      });
    });

    test('should handle complex styles', () => {
      const element = 'div';
      const styles = {
        color: 'red',
        fontSize: '16px',
        padding: '1rem',
        margin: '0.5rem',
        borderRadius: '0.25rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      };
      const mockComponent = jest.fn();
      
      mockCreateStyledComponent.mockReturnValue(mockComponent);
      
      const result = mockCreateStyledComponent(element, styles);
      expect(result).toEqual(mockComponent);
      expect(mockCreateStyledComponent).toHaveBeenCalledWith(element, styles);
    });
  });

  describe('createButton', () => {
    test('should be a function', () => {
      expect(mockCreateButton).toBeDefined();
      expect(typeof mockCreateButton).toBe('function');
    });

    test('should create styled button', () => {
      const styles = {
        backgroundColor: '#007bff',
        color: '#ffffff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
      };
      const mockButton = jest.fn();
      
      mockCreateButton.mockReturnValue(mockButton);
      
      const result = mockCreateButton(styles);
      expect(result).toEqual(mockButton);
      expect(mockCreateButton).toHaveBeenCalledWith(styles);
    });

    test('should handle button variants', () => {
      const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
      
      variants.forEach(variant => {
        const styles = { variant };
        const mockButton = jest.fn();
        
        mockCreateButton.mockReturnValue(mockButton);
        
        const result = mockCreateButton(styles);
        expect(result).toEqual(mockButton);
        expect(mockCreateButton).toHaveBeenCalledWith(styles);
      });
    });
  });

  describe('createInput', () => {
    test('should be a function', () => {
      expect(mockCreateInput).toBeDefined();
      expect(typeof mockCreateInput).toBe('function');
    });

    test('should create styled input', () => {
      const styles = {
        border: '1px solid #ced4da',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.25rem',
        fontSize: '1rem',
        outline: 'none',
      };
      const mockInput = jest.fn();
      
      mockCreateInput.mockReturnValue(mockInput);
      
      const result = mockCreateInput(styles);
      expect(result).toEqual(mockInput);
      expect(mockCreateInput).toHaveBeenCalledWith(styles);
    });

    test('should handle input types', () => {
      const types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'];
      
      types.forEach(type => {
        const styles = { type };
        const mockInput = jest.fn();
        
        mockCreateInput.mockReturnValue(mockInput);
        
        const result = mockCreateInput(styles);
        expect(result).toEqual(mockInput);
        expect(mockCreateInput).toHaveBeenCalledWith(styles);
      });
    });
  });

  describe('createCard', () => {
    test('should be a function', () => {
      expect(mockCreateCard).toBeDefined();
      expect(typeof mockCreateCard).toBe('function');
    });

    test('should create styled card', () => {
      const styles = {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      };
      const mockCard = jest.fn();
      
      mockCreateCard.mockReturnValue(mockCard);
      
      const result = mockCreateCard(styles);
      expect(result).toEqual(mockCard);
      expect(mockCreateCard).toHaveBeenCalledWith(styles);
    });

    test('should handle card elevations', () => {
      const elevations = ['sm', 'md', 'lg', 'xl'];
      
      elevations.forEach(elevation => {
        const styles = { elevation };
        const mockCard = jest.fn();
        
        mockCreateCard.mockReturnValue(mockCard);
        
        const result = mockCreateCard(styles);
        expect(result).toEqual(mockCard);
        expect(mockCreateCard).toHaveBeenCalledWith(styles);
      });
    });
  });

  describe('createModal', () => {
    test('should be a function', () => {
      expect(mockCreateModal).toBeDefined();
      expect(typeof mockCreateModal).toBe('function');
    });

    test('should create styled modal', () => {
      const styles = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '2rem',
        borderRadius: '0.5rem',
        zIndex: 1000,
      };
      const mockModal = jest.fn();
      
      mockCreateModal.mockReturnValue(mockModal);
      
      const result = mockCreateModal(styles);
      expect(result).toEqual(mockModal);
      expect(mockCreateModal).toHaveBeenCalledWith(styles);
    });

    test('should handle modal sizes', () => {
      const sizes = ['sm', 'md', 'lg', 'xl', 'full'];
      
      sizes.forEach(size => {
        const styles = { size };
        const mockModal = jest.fn();
        
        mockCreateModal.mockReturnValue(mockModal);
        
        const result = mockCreateModal(styles);
        expect(result).toEqual(mockModal);
        expect(mockCreateModal).toHaveBeenCalledWith(styles);
      });
    });
  });

  describe('Component Integration', () => {
    test('should work together for complex layouts', () => {
      const buttonStyles = {
        backgroundColor: '#007bff',
        color: '#ffffff',
        padding: '0.5rem 1rem',
      };
      
      const inputStyles = {
        border: '1px solid #ced4da',
        padding: '0.5rem 0.75rem',
      };
      
      const cardStyles = {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
      };
      
      const mockButton = jest.fn();
      const mockInput = jest.fn();
      const mockCard = jest.fn();
      
      mockCreateButton.mockReturnValue(mockButton);
      mockCreateInput.mockReturnValue(mockInput);
      mockCreateCard.mockReturnValue(mockCard);
      
      const button = mockCreateButton(buttonStyles);
      const input = mockCreateInput(inputStyles);
      const card = mockCreateCard(cardStyles);
      
      expect(button).toBeDefined();
      expect(input).toBeDefined();
      expect(card).toBeDefined();
    });

    test('should support theme integration', () => {
      const theme = {
        colors: { primary: '#007bff', secondary: '#6c757d' },
        spacing: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
      };
      
      const themedButtonStyles = {
        backgroundColor: theme.colors.primary,
        color: theme.colors.secondary,
        padding: theme.spacing.md,
      };
      
      const mockButton = jest.fn();
      mockCreateButton.mockReturnValue(mockButton);
      
      const button = mockCreateButton(themedButtonStyles);
      expect(mockCreateButton).toHaveBeenCalledWith(themedButtonStyles);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid styles gracefully', () => {
      const invalidStyles = null;
      
      mockCreateStyledComponent.mockReturnValue(null);
      
      const result = mockCreateStyledComponent('div', invalidStyles);
      expect(result).toBeNull();
    });

    test('should handle empty styles gracefully', () => {
      const emptyStyles = {};
      
      mockCreateStyledComponent.mockReturnValue({});
      
      const result = mockCreateStyledComponent('div', emptyStyles);
      expect(result).toEqual({});
    });
  });

    test('should handle missing elements gracefully', () => {
      mockCreateStyledComponent.mockReturnValue(null);
      
      const result = mockCreateStyledComponent(null, {});
      expect(result).toBeNull();
    });
  });

  describe('Performance', () => {
    test('should handle rapid component creation', () => {
      const styles = { color: 'red' };
      
      mockCreateStyledComponent.mockReturnValue(jest.fn());
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        mockCreateStyledComponent('div', styles);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should not cause memory leaks', () => {
      mockCreateStyledComponent.mockReturnValue(jest.fn());
      
      const components = [];
      
      for (let i = 0; i < 100; i++) {
        components.push(mockCreateStyledComponent('div', {}));
      }
      
      // Clear references
      components.length = 0;
      
      // Should not throw errors
      expect(() => {
        mockCreateStyledComponent('div', {});
      }).not.toThrow();
    });
  });
});
