# Legacy Code Archive

This directory contains legacy code that was removed from the core modules during cleanup.

## Restored Files Structure:

### Core Legacy Files
- `legacy.ts` - Contained deprecated exports for backward compatibility

### Backup Files (.bak)
- `auth/AuthModule.js.bak` - Backup of AuthModule JavaScript implementation
- `auth/services/TokenRefreshManager.ts.bak` - Backup of TokenRefreshManager
- `auth/services/AdvancedTokenRotationManager.ts.bak` - Backup of AdvancedTokenRotationManager
- `auth/services/SessionTimeoutManager.ts.bak` - Backup of SessionTimeoutManager
- `auth/services/FeatureAuthService.ts.bak` - Backup of FeatureAuthService
- `cache/utils.ts.bak` - Backup of cache utilities

### Duplicate .jsx Files (Replaced by .tsx versions)
- `di/providers/ReactProvider.jsx` - Older JSX version (replaced by .tsx)
- `theme/EnhancedThemeProvider.jsx` - Older JSX version (replaced by .tsx)
- `theme/providers/ThemeProvider.jsx` - Basic theme provider (replaced by enhanced version)
- `websocket/hooks/WebSocketHooksExample.jsx` - Older JSX example (replaced by .tsx)

### Demo and Example Files
- `auth/demos/PluginDemo.ts` - Plugin demonstration file
- `auth/examples/PluginUsageExample.ts` - Plugin usage example

## Removal Date:
February 1, 2026

## Reason for Removal:
- Code cleanup and modernization
- Removal of duplicate/backup files
- Elimination of demo/example code from production
- Migration to modern TypeScript patterns
- Consolidation of legacy exports

## Restoration Notes:
- Backup files (.bak) are preserved as placeholders with removal context
- JSX files are complete functional versions that were replaced by TypeScript
- Demo/Example files are preserved for reference
- All files maintain their original functionality but may have import path issues
- These files should NOT be used in new development - they are for reference only

## Important:
These files are preserved for historical reference but should not be used in new development. The import paths may need to be adjusted if you want to reference any of these implementations.
