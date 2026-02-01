# Loading Components Migration Guide

## 🎯 **MIGRATION OVERVIEW**

This guide provides step-by-step instructions for migrating from the old `Loader` component to the enhanced `LoadingSpinner` component.

### **📊 USAGE ANALYSIS:**
- **Loader**: 166 matches across 47 files (heavily used)
- **LoadingSpinner**: 54 matches across 24 files (growing usage)
- **Impact**: High - Careful migration required

---

## 🔄 **COMPONENT COMPARISON**

### **Before (Loader Component):**
```typescript
import { Loader } from '@/shared/ui/components';

<Loader 
  size="md" 
  color="#007bff" 
  className="custom-loader" 
  testId="my-loader" 
/>
```

### **After (LoadingSpinner Component):**
```typescript
import { LoadingSpinner } from '@/shared/ui/components';

<LoadingSpinner 
  size="md" 
  customColor="#007bff" 
  useTheme={false}
  className="custom-loader" 
  testId="my-loader" 
/>
```

---

## 📋 **MIGRATION MAPPINGS**

### **Size Props:**
| Old Loader Size | New LoadingSpinner Size | Notes |
|----------------|------------------------|-------|
| `size="xs"` | `size="xs"` | ✅ Direct mapping |
| `size="sm"` | `size="sm"` | ✅ Direct mapping |
| `size="md"` | `size="md"` | ✅ Direct mapping |
| `size="lg"` | `size="lg"` | ✅ Direct mapping |
| `size="xl"` | `size="xl"` | ✅ Direct mapping |
| `size="30px"` | `customSize="30px"` | 🔄 Use customSize |
| `size={30}` | `size={30}` | ✅ Direct mapping |

### **Color Props:**
| Old Loader Color | New LoadingSpinner Color | Notes |
|------------------|--------------------------|-------|
| `color="primary"` | `color="primary"` | ✅ Direct mapping |
| `color="#007bff"` | `customColor="#007bff"` | 🔄 Use customColor |
| `color="blue"` | `customColor="blue"` | 🔄 Use customColor |

### **Additional Props:**
| Prop | Old Loader | New LoadingSpinner | Notes |
|------|------------|--------------------|-------|
| `className` | ✅ Supported | ✅ Supported | Direct mapping |
| `testId` | ✅ Supported | ✅ Supported | Direct mapping |
| `visible` | ❌ Not available | ✅ Supported | New feature |
| `useTheme` | ❌ Not available | ✅ Supported | New feature |

---

## 🚀 **MIGRATION STEPS**

### **Step 1: Update Imports**
```typescript
// Before
import { Loader } from '@/shared/ui/components';

// After
import { LoadingSpinner } from '@/shared/ui/components';
```

### **Step 2: Update Component Usage**
```typescript
// Before
<Loader size="md" color="#007bff" className="my-loader" />

// After
<LoadingSpinner 
  size="md" 
  customColor="#007bff" 
  useTheme={false}
  className="my-loader" 
/>
```

### **Step 3: Handle Special Cases**

#### **Case 1: Custom Pixel Sizes**
```typescript
// Before
<Loader size="30px" color="red" />

// After
<LoadingSpinner 
  customSize="30px" 
  customColor="red"
  useTheme={false}
/>
```

#### **Case 2: Numeric Sizes**
```typescript
// Before
<Loader size={40} color="blue" />

// After
<LoadingSpinner 
  size={40} 
  customColor="blue"
  useTheme={false}
/>
```

#### **Case 3: Theme Colors**
```typescript
// Before
<Loader size="lg" color="primary" />

// After
<LoadingSpinner 
  size="lg" 
  color="primary"
  useTheme={true}
/>
```

---

## 🎯 **BATCH MIGRATION SCRIPT**

### **Find all Loader usages:**
```bash
grep -r "import.*Loader" src/
grep -r "<Loader" src/
```

### **Common Patterns to Replace:**

#### **Pattern 1: Basic Usage**
```bash
# Find
<Loader size="md" 

# Replace with
<LoadingSpinner size="md"
```

#### **Pattern 2: With Custom Color**
```bash
# Find
<Loader size="md" color="#"

# Replace with
<LoadingSpinner size="md" customColor="#"
```

#### **Pattern 3: With className**
```bash
# Find
<Loader className="

# Replace with
<LoadingSpinner className="
```

---

## 📋 **FILES REQUIRING MIGRATION**

Based on usage analysis, these files need migration:

### **High Priority (Core Components):**
1. `src/shared/ui/components/feedback/LoaderStyled.tsx`
2. `src/shared/ui/components/feedback/FullLoadingOverlay.tsx`
3. `src/shared/ui/components/forms/FileUploader.tsx`

### **Medium Priority (Feature Components):**
4. `src/features/auth/presentation/components/LoginForm.tsx`
5. `src/features/auth/presentation/components/guards/ProtectedRoute.tsx`
6. `src/features/chat/presentation/components/ChatContainer.tsx`
7. `src/features/feed/presentation/components/FeedContainer.tsx`

### **Low Priority (Utility Components):**
8. `src/features/profile/UserProfileContainer.tsx`
9. `src/features/search/presentation/components/PostResults/PostResults.tsx`
10. `src/features/settings/presentation/components/ProfilePhotoModifier.tsx`

---

## 🧪 **TESTING MIGRATION**

### **Before Migration:**
1. Take screenshots of current loading states
2. Note any custom styling or behaviors
3. Test loading animations and timing

### **After Migration:**
1. Verify visual consistency
2. Test all size variants (xs, sm, md, lg, xl)
3. Test custom colors and theme colors
4. Verify accessibility features (ARIA labels)
5. Test programmatic control (show/hide methods)

---

## ⚠️ **POTENTIAL ISSCTIONS**

### **Issue 1: Custom Styling**
**Problem**: Loader may have custom CSS that doesn't apply to LoadingSpinner
**Solution**: Use the `className` prop and ensure styles are compatible

### **Issue 2: Animation Differences**
**Problem**: Loading animation may look different
**Solution**: Test visual consistency and adjust if needed

### **Issue 3: Size Mismatches**
**Problem**: Size values may not map 1:1
**Solution**: Use `customSize` prop for exact pixel values

---

## 🎯 **ROLLBACK PLAN**

If issues arise during migration:

1. **Immediate Rollback**: Revert to `<Loader>` component
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
- ✅ All `<Loader>` components replaced with `<LoadingSpinner>`
- ✅ All visual tests pass
- ✅ No console errors or warnings
- ✅ Accessibility tests pass
- ✅ Performance tests show no regression

### **Benefits Achieved:**
- 🎯 **Single Source of Truth**: One loading component
- 🎯 **Enhanced Features**: Better accessibility and control
- 🎯 **Consistent API**: Unified props and methods
- 🎯 **Better Testing**: Easier to test and maintain

---

## 🚀 **NEXT STEPS**

1. **Start Migration**: Begin with high-priority files
2. **Test Thoroughly**: Verify each migration
3. **Update Documentation**: Update component docs
4. **Remove Old Component**: Deprecate `Loader` component
5. **Clean Up**: Remove unused imports and files

---

**Migration Date**: February 1, 2026  
**Status**: ✅ **Ready for Implementation**  
**Estimated Time**: 2-3 hours  
**Risk Level**: Low (with proper testing)  
**Benefits**: High (code consolidation, enhanced features)
