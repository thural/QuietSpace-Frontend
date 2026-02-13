/**
 * ESLint Rules for Theme Compliance
 * 
 * Automated rules to prevent hard-coded styling values
 * and enforce theme token usage across UI components.
 */

module.exports = {
  rules: {
    // Prevent hard-coded pixel values
    'no-hard-coded-pixels': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow hard-coded pixel values in styled components',
          category: 'Best Practices',
          recommended: true
        }
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && /\d+px/.test(node.value)) {
              context.report({
                node,
                message: `Hard-coded pixel value '${node.value}' found. Use theme tokens instead.`,
                suggest: `Replace with getSpacing(theme, 'sm') or getBorderWidth(theme, 'sm')`
              });
            }
          }
        };
      }
    },

    // Prevent hard-coded hex colors
    'no-hard-coded-colors': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow hard-coded hex color values',
          category: 'Best Practices',
          recommended: true
        }
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && /#[0-9a-fA-F]{6}/.test(node.value)) {
              context.report({
                node,
                message: `Hard-coded color '${node.value}' found. Use getColor(theme, 'brand.500') instead.`,
                suggest: `Replace with theme color tokens`
              });
            }
          }
        };
      }
    },

    // Prevent hard-coded rgba values
    'no-hard-coded-rgba': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow hard-coded rgba color values',
          category: 'Best Practices',
          recommended: true
        }
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && /rgba?\([^)]+\)/.test(node.value)) {
              context.report({
                node,
                message: `Hard-coded rgba value '${node.value}' found. Use theme colors instead.`,
                suggest: `Replace with getColor(theme, 'semantic.overlay')`
              });
            }
          }
        };
      }
    },

    // Prevent hard-coded rem values
    'no-hard-coded-rem': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow hard-coded rem values',
          category: 'Best Practices',
          recommended: true
        }
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && /\d+rem/.test(node.value)) {
              context.report({
                node,
                message: `Hard-coded rem value '${node.value}' found. Use getSpacing(theme, 'md') instead.`,
                suggest: `Replace with theme spacing tokens`
              });
            }
          }
        };
      }
    },

    // Require spacing utility for margin/padding
    'require-spacing-utility': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Require getSpacing utility for margin and padding',
          category: 'Best Practices',
          recommended: true
        }
      },
      create(context) {
        return {
          Property(node) {
            if ((node.key.name === 'margin' || node.key.name === 'padding') && 
                node.parent && node.parent.type === 'TemplateLiteral') {
              const value = node.parent.value;
              if (typeof value === 'string' && /\d+px/.test(value)) {
                context.report({
                  node,
                  message: `Use getSpacing(theme, 'sm') instead of hard-coded ${node.key.name}`,
                  suggest: `Replace with getSpacing(theme, 'sm')`
                });
              }
            }
          }
        };
      }
    },

    // Require border utility for border widths
    'require-border-utility': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Require getBorderWidth utility for border widths',
          category: 'Best Practices',
          recommended: true
        }
      },
      create(context) {
        return {
          Property(node) {
            if (node.key.name === 'border' && 
                node.parent && node.parent.type === 'TemplateLiteral') {
              const value = node.parent.value;
              if (typeof value === 'string' && /\d+px/.test(value)) {
                context.report({
                  node,
                  message: `Use getBorderWidth(theme, 'sm') instead of hard-coded border width`,
                  suggest: `Replace with getBorderWidth(theme, 'sm')`
                });
              }
            }
          }
        };
      }
    },

    // Prevent hard-coded transitions
    'no-hard-coded-transitions': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow hard-coded transition values',
          category: 'Best Practices',
          recommended: true
        }
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && 
                (node.value.includes('all ') || node.value.includes('ease') || node.value.includes('ms'))) {
              context.report({
                node,
                message: `Hard-coded transition '${node.value}' found. Use getTransition(theme, 'all', 'normal', 'ease') instead.`,
                suggest: `Replace with getTransition(theme, 'all', 'normal', 'ease')`
              });
            }
          }
        };
      }
    }
  }
};
