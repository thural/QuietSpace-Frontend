#!/bin/bash

# JSDoc Compliance Checker Script
# 
# Quick shell wrapper for the Node.js compliance checker
# 
# Usage: ./scripts/check-jsdoc.sh [options]
# 
# Options:
#   --fix         Auto-fix ESLint issues where possible
#   --verbose     Detailed output
#   --strict      Enable strict validation mode
#   --summary     Show summary only
#   --core-only   Check only core modules (src/core/**)
#   --help        Show this help message

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Help function
show_help() {
    cat << EOF
JSDoc Compliance Checker

USAGE:
    $0 [options] [files...]

OPTIONS:
    --fix         Auto-fix ESLint issues where possible
    --verbose     Detailed output
    --strict      Enable strict validation mode
    --summary     Show summary only
    --core-only   Check only core modules (src/core/**)
    --exclude=PAT Exclude files matching pattern
    --help        Show this help message

EXAMPLES:
    $0                           # Check all files
    $0 --core-only               # Check only core modules
    $0 --fix --verbose           # Fix issues and show details
    $0 src/core/auth/**          # Check specific directory
    $0 --summary --core-only     # Summary for core modules only

EOF
}

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is required but not installed.${NC}" >&2
    exit 1
fi

# Check if we're in the right directory
if [[ ! -f "$PROJECT_ROOT/package.json" ]]; then
    echo -e "${RED}❌ Error: Must be run from project root directory.${NC}" >&2
    exit 1
fi

# Check if eslint-plugin-jsdoc is installed
if ! npm list eslint-plugin-jsdoc &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: eslint-plugin-jsdoc not found. Installing...${NC}"
    npm install --save-dev eslint eslint-plugin-jsdoc
fi

# Build arguments for Node.js script
ARGS=()

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_help
            exit 0
            ;;
        --fix|--verbose|--strict|--summary|--core-only)
            ARGS+=("$1")
            shift
            ;;
        --exclude=*)
            ARGS+=("$1")
            shift
            ;;
        --exclude)
            if [[ -n "$2" ]]; then
                ARGS+=("--exclude=$2")
                shift 2
            else
                echo -e "${RED}❌ Error: --exclude requires a pattern${NC}" >&2
                exit 1
            fi
            ;;
        -*)
            echo -e "${RED}❌ Error: Unknown option $1${NC}" >&2
            show_help
            exit 1
            ;;
        *)
            # File or directory argument
            ARGS+=("$1")
            shift
            ;;
    esac
done

# Change to project root
cd "$PROJECT_ROOT"

echo -e "${BLUE}🔍 JSDoc Compliance Checker${NC}"
echo -e "${BLUE}=============================${NC}"
echo

# Run the Node.js checker
if node "$SCRIPT_DIR/check-jsdoc-compliance.js" "${ARGS[@]}"; then
    echo
    echo -e "${GREEN}✅ JSDoc compliance check completed successfully!${NC}"
else
    echo
    echo -e "${RED}❌ JSDoc compliance check failed!${NC}"
    echo -e "${YELLOW}💡 Run with --fix to auto-fix some issues${NC}"
    exit 1
fi
