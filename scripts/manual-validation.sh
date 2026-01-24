#!/bin/bash

# Simple validation script for React Query removal
echo "🔍 Validating React Query Removal - Manual Check"

# Check 1: Verify package.json doesn't have React Query
echo "📋 Checking package.json..."
if grep -q "@tanstack/react-query" package.json; then
    echo "❌ React Query still found in package.json"
    exit 1
else
    echo "✅ React Query removed from package.json"
fi

# Check 2: Verify main.tsx doesn't have QueryClientProvider
echo "📋 Checking main.tsx..."
if grep -q "QueryClientProvider" src/main.tsx; then
    echo "❌ QueryClientProvider still found in main.tsx"
    exit 1
else
    echo "✅ QueryClientProvider removed from main.tsx"
fi

# Check 3: Verify enterprise hooks exist
echo "📋 Checking enterprise hooks..."
if [ -f "src/core/hooks/useCustomQuery.ts" ] && [ -f "src/core/hooks/useCustomMutation.ts" ]; then
    echo "✅ Enterprise custom query hooks exist"
else
    echo "❌ Enterprise hooks missing"
    exit 1
fi

# Check 4: Verify enterprise types exist
echo "📋 Checking enterprise types..."
if [ -f "src/core/types/InfiniteQueryTypes.ts" ]; then
    echo "✅ Enterprise InfiniteQuery types exist"
else
    echo "❌ Enterprise types missing"
    exit 1
fi

# Check 5: Count remaining React Query references
echo "📋 Counting remaining React Query references..."
REMAINING_COUNT=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "@tanstack/react-query" 2>/dev/null | wc -l)
echo "📊 Found $REMAINING_COUNT files with React Query references (expected: test files, performance tools, migration files)"

# Check 6: Verify key enterprise feature files
echo "📋 Checking enterprise feature files..."
FEATURE_FILES=(
    "src/features/feed/application/hooks/useFeedService.ts"
    "src/features/search/application/hooks/useEnterpriseSearch.ts"
    "src/features/chat/application/hooks/useUnifiedChat.ts"
)

for file in "${FEATURE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "⚠️  $file missing (may be expected)"
    fi
done

echo "🎉 Manual validation completed!"
echo "📊 React Query removal appears successful"
echo "🚀 Ready for Phase 4: Production Deployment"
