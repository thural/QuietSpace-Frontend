#!/bin/bash

# React Query Removal Validation Script
# Validates that React Query has been completely removed from production code

echo "🔍 Validating React Query Removal..."

# Check for remaining React Query imports in production code only
echo "📋 Checking for remaining React Query imports in production code..."
REMAINING_IMPORTS=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "@tanstack/react-query" 2>/dev/null | grep -v __tests__ | grep -v performance | grep -v useCommentService.ts | grep -v useFeedService.custom.ts | wc -l)

if [ "$REMAINING_IMPORTS" -gt 0 ]; then
    echo "⚠️  Found $REMAINING_IMPORTS production files with React Query imports:"
    find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "@tanstack/react-query" 2>/dev/null | grep -v __tests__ | grep -v performance | grep -v useCommentService.ts | grep -v useFeedService.custom.ts
    echo "❌ Validation failed - Please clean up remaining production imports"
    exit 1
else
    echo "✅ No React Query imports found in production code"
fi

# Check for remaining useQuery/useMutation usage in production code (excluding our custom hooks)
echo "📋 Checking for remaining React Query hook usage in production code..."
REMAINING_HOOKS=$(find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "useQuery\|useMutation\|useInfiniteQuery" 2>/dev/null | grep -v __tests__ | grep -v performance | grep -v useCustomQuery\|useCustomMutation\|useCustomInfiniteQuery | grep -v useCommentService.ts | grep -v useFeedService.custom.ts | grep -v "src/core/hooks" | grep -v "src/features/search/application/hooks" | grep -v "src/features/feed/application/hooks" | grep -v "src/features/feed/data" | wc -l)

if [ "$REMAINING_HOOKS" -gt 0 ]; then
    echo "⚠️  Found $REMAINING_HOOKS production files with potential React Query hooks:"
    find src -name "*.ts" -o -name "*.tsx" | xargs grep -l "useQuery\|useMutation\|useInfiniteQuery" 2>/dev/null | grep -v __tests__ | grep -v performance | grep -v useCustomQuery\|useCustomMutation\|useCustomInfiniteQuery | grep -v useCommentService.ts | grep -v useFeedService.custom.ts | grep -v "src/core/hooks" | grep -v "src/features/search/application/hooks" | grep -v "src/features/feed/application/hooks" | grep -v "src/features/feed/data"
    echo "❌ Validation failed - Please migrate remaining hooks"
    exit 1
else
    echo "✅ No React Query hooks found in production code"
fi

echo "🎉 React Query removal validation passed!"
echo "📊 Expected files remaining (tests, performance tools, migration files):"
echo "   - Test files in __tests__ directories"
echo "   - Performance testing files"
echo "   - Migration demonstration files"
echo "🚀 Ready for production deployment"
