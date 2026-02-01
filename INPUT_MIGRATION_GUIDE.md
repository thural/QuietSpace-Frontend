# Input Components Migration Guide

## 🎯 **MIGRATION OVERVIEW**

This guide provides step-by-step instructions for migrating from the old `Input`, `InputStyled`, and `TextInputStyled` components to the enhanced `EnterpriseInput` component.

### **📊 USAGE ANALYSIS:**
- **InputStyled**: 16 matches across 5 files (moderate usage)
- **Input**: Base component in interactive directory
- **TextInputStyled**: Text-specific input with custom pattern
- **Impact**: Medium - Enhanced features and better validation available

---

## 🔄 **COMPONENT COMPARISON**

### **Before (Input Component):**
```typescript
import { Input } from '@/shared/ui/components';

<Input 
  size="md" 
  color="#007bff" 
  placeholder="Enter text"
  onChange={(e) => setValue(e.target.value)}
/>
```

### **After (EnterpriseInput Component):**
```typescript
import { EnterpriseInput } from '@/shared/ui/components';

<EnterpriseInput 
  size="md" 
  backgroundColor="#007bff"
  placeholder="Enter text"
  onChange={(value) => setValue(value)}
/>
```

---

## 📋 **MIGRATION MAPPINGS**

### **Size Props:**
| Old Input Size | New EnterpriseInput Size | Notes |
|----------------|---------------------------|-------|
| `size="sm"` | `size="sm"` | ✅ Direct mapping |
| `size="md"` | `size="md"` | ✅ Direct mapping |
| `size="lg"` | `size="lg"` | ✅ Direct mapping |

### **Variant Props:**
| Old Input Style | New EnterpriseInput Variant | Notes |
|-----------------|-----------------------------|-------|
| Default styling | `variant="default"` | ✅ Direct mapping |
| Outlined style | `variant="outlined"` | ✅ Direct mapping |
| Filled style | `variant="filled"` | ✅ Direct mapping |

### **Event Handlers:**
| Old Input Handler | New EnterpriseInput Handler | Notes |
|-------------------|-----------------------------|-------|
| `onChange={(e) => setValue(e.target.value)}` | `onChange={(value) => setValue(value)}` | 🔄 Direct value |
| `onFocus={handleFocus}` | `onFocus={handleFocus}` | ✅ Direct mapping |
| `onBlur={handleBlur}` | `onBlur={handleBlur}` | ✅ Direct mapping |

---

## 🚀 **MIGRATION STEPS**

### **Step 1: Update Imports**
```typescript
// Before
import { Input } from '@/shared/ui/components';
import { InputStyled } from '@/shared/ui/components';
import { TextInputStyled } from '@/shared/ui/components';

// After
import { EnterpriseInput } from '@/shared/ui/components';
```

### **Step 2: Update Component Usage**
```typescript
// Before
<Input 
  size="md" 
  placeholder="Enter text"
  onChange={(e) => setValue(e.target.value)}
/>

// After
<EnterpriseInput 
  size="md" 
  placeholder="Enter text"
  onChange={(value) => setValue(value)}
/>
```

### **Step 3: Handle Special Cases**

#### **Case 1: InputStyled with Variant**
```typescript
// Before
<InputStyled 
  size="md" 
  variant="outlined"
  placeholder="Enter text"
  handleChange={(value) => setValue(value)}
/>

// After
<EnterpriseInput 
  size="md" 
  variant="outlined"
  placeholder="Enter text"
  onChange={(value) => setValue(value)}
/>
```

#### **Case 2: TextInputStyled with Validation**
```typescript
// Before
<TextInputStyled 
  name="username"
  value={username}
  handleChange={(value) => setUsername(value)}
  placeholder="Enter username"
  maxLength={20}
  minLength={3}
/>

// After
<EnterpriseInput 
  name="username"
  value={username}
  onChange={(value) => setUsername(value)}
  placeholder="Enter username"
  maxLength={20}
  minLength={3}
  validator={(value) => {
    if (value.length < 3) return 'Username too short';
    return null;
  }}
/>
```

#### **Case 3: Input with Custom Styling**
```typescript
// Before
<Input 
  size="lg" 
  color="#ff6b6b"
  borderColor="#e74c3c"
  placeholder="Error input"
  error={true}
/>

// After
<EnterpriseInput 
  size="lg" 
  backgroundColor="#ff6b6b"
  borderColor="#e74c3c"
  placeholder="Error input"
  state="error"
  errorMessage="This field has an error"
/>
```

---

## 🎯 **ENHANCED FEATURES**

### **New Features Available:**
1. **Built-in Validation**: Client-side validation with custom validators
2. **Multiple States**: default, error, success, warning states
3. **Icon Support**: Left and right icons with proper positioning
4. **Helper Text**: Contextual help and error messages
5. **Labels**: Integrated label with required indicators
6. **Accessibility**: ARIA labels and keyboard navigation
7. **Enterprise Patterns**: BaseClassComponent with lifecycle management

### **Example with Enhanced Features:**
```typescript
<EnterpriseInput
  name="email"
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  type="email"
  size="lg"
  variant="outlined"
  required={true}
  leftIcon={<MailIcon />}
  helperText="We'll never share your email with anyone else."
  validator={(value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
    return null;
  }}
  state={emailError ? 'error' : 'default'}
  errorMessage={emailError}
/>
```

---

## 🧪 **TESTING MIGRATION**

### **Before Migration:**
1. Take screenshots of current input states
2. Note validation behavior and error messages
3. Test focus, blur, and change events
4. Test disabled and read-only states

### **After Migration:**
1. Verify visual consistency
2. Test all size variants (xs, sm, md, lg, xl)
3. Test all variants (default, outlined, filled)
4. Test validation and error states
5. Test accessibility features
6. Test icon positioning and helper text

---

## ⚠️ **POTENTIAL ISSUES**

### **Issue 1: Event Handler Signature**
**Problem**: Old components pass event object, new component passes value directly
**Solution**: Update onChange handlers to expect value instead of event

### **Issue 2: Validation Pattern**
**Problem**: TextInputStyled uses handleChange pattern, EnterpriseInput uses onChange
**Solution**: Map handleChange to onChange prop

### **Issue 3: Styling Props**
**Problem**: Different prop names for colors and styling
**Solution**: Map color props to backgroundColor, borderColor, textColor

---

## 🎯 **ROLLBACK PLAN**

If issues arise during migration:

1. **Immediate Rollback**: Revert to old input components
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
- ✅ All `<Input>` components replaced with `<EnterpriseInput>`
- ✅ All `<InputStyled>` components replaced with `<EnterpriseInput>`
- ✅ All `<TextInputStyled>` components replaced with `<EnterpriseInput>`
- ✅ All visual tests pass
- ✅ No console errors or warnings
- ✅ Validation works correctly
- ✅ Accessibility tests pass

### **Benefits Achieved:**
- 🎯 **Single Source of Truth**: One input component
- 🎯 **Enhanced Validation**: Built-in validation with custom validators
- 🎯 **Better Accessibility**: ARIA labels and keyboard navigation
- 🎯 **Consistent API**: Unified props and methods
- 🎯 **Enterprise Patterns**: BaseClassComponent with lifecycle management

---

## 🚀 **NEXT STEPS**

1. **Start Migration**: Begin with TextInputStyled components (easier)
2. **Test Thoroughly**: Verify each migration
3. **Enable Enhanced Features**: Add validation, icons, and helper text
4. **Update Documentation**: Update component docs
5. **Remove Old Components**: Deprecate old input components
6. **Clean Up**: Remove unused imports and files

---

## 📋 **FILES REQUIRING MIGRATION**

Based on usage analysis, these files need migration:

### **High Priority:**
1. `src/shared/ui/components/forms/InputStyled.tsx` - Remove/deprecate
2. `src/shared/ui/components/forms/TextInputStyled.tsx` - Remove/deprecate
3. `src/shared/ui/components/interactive/Input.tsx` - Keep as base, deprecate direct usage

### **Feature Files:**
4. `src/features/search/presentation/components/SearchBar/SearchBar.tsx`
5. `src/shared/ui/components/forms/FileUploader.tsx`

### **Search Pattern:**
```bash
grep -r "import.*InputStyled" src/
grep -r "import.*TextInputStyled" src/
grep -r "import.*Input.*from.*@/shared/ui/components" src/
grep -r "<InputStyled" src/
grep -r "<TextInputStyled" src/
```

---

## 🔧 **ADVANCED EXAMPLES**

### **Complex Form with Multiple Inputs:**
```typescript
<FormContainer>
  <EnterpriseInput
    name="firstName"
    label="First Name"
    value={formData.firstName}
    onChange={(value) => setFormData({...formData, firstName: value})}
    required={true}
    state={errors.firstName ? 'error' : 'default'}
    errorMessage={errors.firstName}
  />
  
  <EnterpriseInput
    name="email"
    label="Email Address"
    type="email"
    value={formData.email}
    onChange={(value) => setFormData({...formData, email: value})}
    required={true}
    leftIcon={<MailIcon />}
    validator={(value) => {
      if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email';
      return null;
    }}
  />
  
  <EnterpriseInput
    name="password"
    label="Password"
    type="password"
    value={formData.password}
    onChange={(value) => setFormData({...formData, password: value})}
    required={true}
    rightIcon={<EyeIcon />}
    helperText="Must be at least 8 characters long"
  />
</FormContainer>
```

---

**Migration Date**: February 1, 2026  
**Status**: ✅ **Ready for Implementation**  
**Estimated Time**: 2-3 hours  
**Risk Level**: Low (with proper testing)  
**Benefits**: High (enhanced validation, better accessibility, enterprise patterns)
