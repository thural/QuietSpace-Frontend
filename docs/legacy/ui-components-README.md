# Legacy UI Components

This directory contains UI components that were removed during refactoring and moved to the legacy directory for preservation.

## Components Restored

### Forms Components
- **InputStyled.tsx** - Deprecated input component replaced by EnterpriseInput
- **TextInputStyled.tsx** - Deprecated text input component replaced by EnterpriseInput

### User Components  
- **UserProfileAvatarWithData.tsx** - Bridge component for UserAvatarPhoto migration

## Migration Status

These components were removed as part of the UI library consolidation effort:

- **Input Components**: 67% code reduction (3 → 1 component)
- **User Components**: Consolidated into enterprise patterns
- **Forms**: Migrated to EnterpriseInput with enhanced features

## Usage Notes

These components are preserved for reference and potential rollback scenarios. They may have dependency issues since they were moved to the legacy directory without their full dependency chain.

## Enterprise Replacements

- `InputStyled` → `EnterpriseInput` (from `@/shared/ui/components`)
- `TextInputStyled` → `EnterpriseInput` (from `@/shared/ui/components`)
- `UserProfileAvatarWithData` → `UserProfileAvatar` (from `@/shared/ui/components`)

## Restoration Date

Components restored on: February 2, 2026
