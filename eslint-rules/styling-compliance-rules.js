/**
 * ESLint Rules for UI Library Styling Compliance
 * 
 * Automated validation rules to prevent hard-coded styling values
 * and ensure theme token usage across the UI library.
 */

module.exports = {
  rules: {
    // Prevent hard-coded pixel values in styled components
    'no-hard-coded-pixels': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow hard-coded pixel values in favor of theme tokens',
          category: 'Best Practices',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create(context) {
        const sourceCode = context.getSourceCode();
        
        function checkForHardCodedPixels(node) {
          if (node.type === 'Literal' && typeof node.value === 'string') {
            // Check for hard-coded pixel values
            const pixelPattern = /\b\d+px\b/g;
            if (pixelPattern.test(node.value)) {
              context.report({
                node,
                message: 'Hard-coded pixel values are not allowed. Use theme tokens or utility functions instead.',
                suggest: [
                  {
                    desc: 'Replace with theme token or utility function',
                    fix: null // Requires manual intervention
                  }
                ]
              });
            }
          }
        }
        
        return {
          Literal: checkForHardCodedPixels,
          TemplateElement: checkForHardCodedPixels
        };
      }
    },

    // Prevent hard-coded colors in favor of theme tokens
    'no-hard-coded-colors': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow hard-coded color values in favor of theme tokens',
          category: 'Best Practices',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create(context) {
        function checkForHardCodedColors(node) {
          if (node.type === 'Literal' && typeof node.value === 'string') {
            // Check for hex colors, rgb, rgba, hsl, hsla
            const colorPatterns = [
              /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g,  // hex colors
              /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g,    // rgb/rgba
              /hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%/g     // hsl/hsla
            ];
            
            for (const pattern of colorPatterns) {
              if (pattern.test(node.value)) {
                context.report({
                  node,
                  message: 'Hard-coded color values are not allowed. Use getColor() utility function with theme tokens instead.',
                  suggest: [
                    {
                      desc: 'Replace with getColor(theme, "token.path")',
                      fix: null // Requires manual intervention
                    }
                  ]
                });
                break;
              }
            }
          }
        }
        
        return {
          Literal: checkForHardCodedColors,
          TemplateElement: checkForHardCodedColors
        };
      }
    },

    // Require utility function usage for spacing
    'require-spacing-utility': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Require use of getSpacing() utility function for spacing values',
          category: 'Best Practices',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create(context) {
        function checkSpacingProperties(node) {
          if (node.type === 'Property' && 
              (node.key.name === 'margin' || node.key.name === 'padding' ||
               node.key.name?.startsWith('margin') || node.key.name?.startsWith('padding'))) {
            
            if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
              // Check if it's not using utility function
              if (!node.value.value.includes('getSpacing')) {
                context.report({
                  node,
                  message: `Use getSpacing(theme, value) utility function for ${node.key.name} instead of hard-coded values.`,
                  suggest: [
                    {
                      desc: `Replace with getSpacing(theme, "token")`,
                      fix: null
                    }
                  ]
                });
              }
            }
          }
        }
        
        return {
          Property: checkSpacingProperties
        };
      }
    },

    // Require utility function usage for border width
    'require-border-utility': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Require use of getBorderWidth() utility function for border width values',
          category: 'Best Practices',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create(context) {
        function checkBorderProperties(node) {
          if (node.type === 'Property' && 
              (node.key.name === 'border' || node.key.name === 'borderWidth')) {
            
            if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
              // Check for hard-coded border widths
              const borderWidthPattern = /\b\d+px\b/g;
              if (borderWidthPattern.test(node.value.value)) {
                context.report({
                  node,
                  message: 'Use getBorderWidth(theme, size) utility function for border width instead of hard-coded values.',
                  suggest: [
                    {
                      desc: 'Replace with getBorderWidth(theme, "token")',
                      fix: null
                    }
                  ]
                });
              }
            }
          }
        }
        
        return {
          Property: checkBorderProperties
        };
      }
    },

    // Require utility function usage for border radius
    'require-radius-utility': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Require use of getRadius() utility function for border radius values',
          category: 'Best Practices',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create(context) {
        function checkRadiusProperties(node) {
          if (node.type === 'Property' && 
              (node.key.name === 'borderRadius' || node.key.name === 'border-radius')) {
            
            if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
              // Check for hard-coded radius values
              const radiusPattern = /\b\d+px\b|%/g;
              if (radiusPattern.test(node.value.value) && !node.value.value.includes('getRadius')) {
                context.report({
                  node,
                  message: 'Use getRadius(theme, size) utility function for border radius instead of hard-coded values.',
                  suggest: [
                    {
                      desc: 'Replace with getRadius(theme, "token")',
                      fix: null
                    }
                  ]
                });
              }
            }
          }
        }
        
        return {
          Property: checkRadiusProperties
        };
      }
    },

    // Prevent hard-coded transition values
    'no-hard-coded-transitions': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow hard-coded transition values in favor of theme animation tokens',
          category: 'Best Practices',
          recommended: true
        },
        fixable: null,
        schema: []
      },
      create(context) {
        function checkTransitionProperties(node) {
          if (node.type === 'Property' && 
              (node.key.name === 'transition' || node.key.name === 'animation')) {
            
            if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
              // Check for hard-coded duration values
              const durationPattern = /\b\d+(?:\.\d+)?s\b/g;
              if (durationPattern.test(node.value.value)) {
                context.report({
                  node,
                  message: 'Use theme animation tokens (theme.animation.duration) instead of hard-coded transition values.',
                  suggest: [
                    {
                      desc: 'Replace with theme.animation.duration.fast/normal/slow',
                      fix: null
                    }
                  ]
                });
              }
            }
          }
        }
        
        return {
          Property: checkTransitionProperties
        };
      }
    }
  }
};
