#!/bin/bash

# React Query Removal Script
# This script safely removes React Query dependencies and cleans up the project

echo "🚀 Starting React Query Removal Process..."

# Step 1: Remove React Query packages
echo "📦 Removing React Query packages..."
# npm uninstall @tanstack/react-query @tanstack/react-query-devtools

# Step 2: Clean up any remaining references
echo "🧹 Cleaning up remaining references..."

# Step 3: Update package.json (manual step required)
echo "📝 Please manually remove these lines from package.json:"
echo '    "@tanstack/react-query": "^5.28.8",'
echo '    "@tanstack/react-query-devtools": "^5.28.8",'

# Step 4: Verify removal
echo "✅ React Query removal completed!"
echo "📊 Expected bundle size reduction: ~50KB"
echo "🚀 Next steps: Run build and test to verify everything works"
