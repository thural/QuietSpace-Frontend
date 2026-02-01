# Avatar Components Migration Guide

## 🎯 **MIGRATION OVERVIEW**

This guide provides step-by-step instructions for migrating from the old `Avatar` and `UserAvatar` components to the enhanced `UserProfileAvatar` component.

### **📊 USAGE ANALYSIS:**
- **UserProfileAvatar**: 6 matches across 2 files (minimal usage)
- **Avatar**: Found in display components (base implementation)
- **UserAvatar**: Simple wrapper around Avatar
- **Impact**: Medium - Enhanced features available

---

## 🔄 **COMPONENT COMPARISON**

### **Before (Avatar Component):**
```typescript
import { Avatar } from '@/shared/ui/components';

<Avatar 
  size="40px" 
  color="#007bff" 
  radius="50%"
  src="avatar.jpg"
>
  JD
</Avatar>
```

### **After (UserProfileAvatar Component):**
```typescript
import { UserProfileAvatar } from '@/shared/ui/components';

<UserProfileAvatar 
  customSize="40px" 
  backgroundColor="#007bff"
  shape="circle"
  src="avatar.jpg"
  name="John Doe"
/>
```

---

## 📋 **MIGRATION MAPPINGS**

### **Size Props:**
| Old Avatar Size | New UserProfileAvatar Size | Notes |
|-----------------|---------------------------|-------|
| `size="40px"` | `customSize="40px"` | 🔄 Use customSize |
| `size={40}` | `size={40}` | ✅ Direct mapping |
| `size="md"` | `size="md"` | ✅ Direct mapping |

### **Color Props:**
| Old Avatar Color | New UserProfileAvatar Color | Notes |
|------------------|-----------------------------|-------|
| `color="#007bff"` | `backgroundColor="#007bff"` | 🔄 Use backgroundColor |
| `color="primary"` | `useTheme={true}` | 🔄 Use theme colors |

### **Shape Props:**
| Old Avatar Radius | New UserProfileAvatar Shape | Notes |
|-------------------|----------------------------|-------|
| `radius="50%"` | `shape="circle"` | ✅ Direct mapping |
| `radius="0"` | `shape="square"` | ✅ Direct mapping |
| `radius="8px"` | `shape="rounded"` | ✅ Direct mapping |

### **Content Props:**
| Old Avatar Content | New UserProfileAvatar Content | Notes |
|-------------------|-----------------------------|-------|
| `children="JD"` | `name="John Doe"` | 🔄 Use name prop |
| `chars="JD"` | `fallback="JD"` | 🔄 Use fallback prop |

---

## 🚀 **MIGRATION STEPS**

### **Step 1: Update Imports**
```typescript
// Before
import { Avatar } from '@/shared/ui/components';
import { UserAvatar } from '@/shared/ui/components';

// After
import { UserProfileAvatar } from '@/shared/ui/components';
```

### **Step 2: Update Component Usage**
```typescript
// Before
<Avatar size="40px" color="#007bff" radius="50%" src="avatar.jpg">
  JD
</Avatar>

// After
<UserProfileAvatar 
  customSize="40px" 
  backgroundColor="#007bff"
  shape="circle"
  src="avatar.jpg"
  name="John Doe"
/>
```

### **Step 3: Handle Special Cases**

#### **Case 1: Basic Avatar with Children**
```typescript
// Before
<Avatar size="md" color="blue" radius="50%">
  JD
</Avatar>

// After
<UserProfileAvatar 
  size="md" 
  backgroundColor="blue"
  shape="circle"
  name="John Doe"
  fallback="JD"
/>
```

#### **Case 2: UserAvatar Wrapper**
```typescript
// Before
<UserAvatar 
  size="2.5rem" 
  color="black" 
  radius="10rem" 
  src="avatar.jpg"
  chars="JD"
/>

// After
<UserProfileAvatar 
  customSize="2.5rem" 
  backgroundColor="black"
  shape="circle"
  src="avatar.jpg"
  name="John Doe"
  fallback="JD"
/>
```

#### **Case 3: Avatar with Custom Styling**
```typescript
// Before
<Avatar 
  size="60px" 
  color="#ff6b6b" 
  radius="12px"
  className="custom-avatar"
>
  AB
</Avatar>

// After
<UserProfileAvatar 
  customSize="60px" 
  backgroundColor="#ff6b6b"
  shape="rounded"
  className="custom-avatar"
  name="Alice Brown"
  fallback="AB"
/>
```

---

## 🎯 **ENHANCED FEATURES**

### **New Features Available:**
1. **Status Indicators**: Show online/offline status
2. **Multiple Shapes**: Circle, square, rounded options
3. **Flexible Sizing**: xs, sm, md, lg, xl, custom sizes
4. **Click Handlers**: Built-in click functionality
5. **Accessibility**: ARIA labels and keyboard navigation
6. **Error Handling**: Image fallback and error states

### **Example with Enhanced Features:**
```typescript
<UserProfileAvatar
  src="avatar.jpg"
  name="John Doe"
  status="online"
  showStatus={true}
  statusPosition="bottom-right"
  size="lg"
  shape="circle"
  clickable={true}
  onClick={() => console.log('Avatar clicked')}
  showName={true}
  showUsername={true}
  username="@johndoe"
/>
```

---

## 🧪 **TESTING MIGRATION**

### **Before Migration:**
1. Take screenshots of current avatar displays
2. Note any custom styling or behaviors
3. Test image loading and fallback states

### **After Migration:**
1. Verify visual consistency
2. Test all size variants (xs, sm, md, lg, xl)
3. Test custom sizes and colors
4. Verify image loading and error states
5. Test accessibility features
6. Test click interactions

---

## ⚠️ **POTENTIAL ISSUES**

### **Issue 1: Children Content**
**Problem**: Avatar component accepts children, UserProfileAvatar uses name/fallback
**Solution**: Use `name` prop for full name or `fallback` prop for custom text

### **Issue 2: Color Mapping**
**Problem**: Avatar uses `color` prop, UserProfileAvatar uses `backgroundColor`
**Solution**: Map color values to backgroundColor prop

### **Issue 3: Radius vs Shape**
**Problem**: Avatar uses `radius` prop, UserProfileAvatar uses `shape`
**Solution**: Map radius values to shape options

---

## 🎯 **ROLLBACK PLAN**

If issues arise during migration:

1. **Immediate Rollback**: Revert to `<Avatar>` or `<UserAvatar>` components
2. **Gradual Rollback**: Migrate back file by file
3. **Hybrid Approach**: Use both components temporarily

### **Rollback Commands:**
```bash
# Revert import changes
git checkout -- src/path/to/file.tsx

# Batch revert
git checkout -- src/features/*/presentation/components/*.tsx
```

---

## 📈 **SUCCESS METRICS**

### **Migration Complete When:**
- ✅ All `<Avatar>` components replaced with `<UserProfileAvatar>`
- ✅ All `<UserAvatar>` components replaced with `<UserProfileAvatar>`
- ✅ All visual tests pass
- ✅ No console errors or warnings
- ✅ Accessibility tests pass
- ✅ Enhanced features working properly

### **Benefits Achieved:**
- 🎯 **Single Source of Truth**: One avatar component
- 🎯 **Enhanced Features**: Status indicators, click handlers, accessibility
- 🎯 **Consistent API**: Unified props and methods
- 🎯 **Better Testing**: Easier to test and maintain
- 🎯 **Enterprise Patterns**: BaseClassComponent with lifecycle management

---

## 🚀 **NEXT STEPS**

1. **Start Migration**: Begin with UserAvatar components (easier)
2. **Test Thoroughly**: Verify each migration
3. **Enable Enhanced Features**: Add status indicators and interactions
4. **Update Documentation**: Update component docs
5. **Remove Old Components**: Deprecate Avatar and UserAvatar components
6. **Clean Up**: Remove unused imports and files

---

## 📋 **FILES REQUIRING MIGRATION**

Based on usage analysis, these files may need migration:

### **Potential Files:**
1. `src/shared/ui/components/user/UserAvatar.tsx` - Remove/deprecate
2. `src/shared/ui/components/display/Avatar.tsx` - Keep as base, deprecate direct usage
3. Any files importing `Avatar` or `UserAvatar` components

### **Search Pattern:**
```bash
grep -r "import.*Avatar" src/
grep -r "import.*UserAvatar" src/
grep -r "<Avatar" src/
grep -r "<UserAvatar" src/
```

---

**Migration Date**: February 1, 2026  
**Status**: ✅ **Ready for Implementation**  
**Estimated Time**: 1-2 hours  
**Risk Level**: Low (with proper testing)  
**Benefits**: High (enhanced features, better accessibility)
