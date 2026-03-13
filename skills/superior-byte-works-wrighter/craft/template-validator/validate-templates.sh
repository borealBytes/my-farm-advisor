#!/bin/bash
# Template Validation Script
# Validates unified-writing templates for quality standards

set -e

TEMPLATES_DIR="/home/clay/dev/omni/skills/_core/unified-writing/templates"
ERRORS=0
WARNINGS=0

echo "=========================================="
echo "Template Validation Script"
echo "=========================================="
echo ""

# Check for required sections
check_required_sections() {
    local file="$1"
    local missing=""
    
    if ! grep -q "^## Document Control" "$file"; then
        missing="$missing Document Control"
    fi
    
    if ! grep -q "^# " "$file"; then
        missing="$missing Title"
    fi
    
    if [ -n "$missing" ]; then
        echo "  ❌ $file - Missing:$missing"
        ((ERRORS++))
    fi
}

# Check for ASCII art
check_ascii_art() {
    local file="$1"
    if grep -q "┌─\|└─\|│ ██\|│ ░░" "$file" 2>/dev/null; then
        echo "  ⚠️  $file - Contains ASCII art (should be Mermaid)"
        ((WARNINGS++))
    fi
}

# Check for Mermaid diagram syntax
check_mermaid_syntax() {
    local file="$1"
    if grep -q "^\`\`\`mermaid" "$file"; then
        if ! grep -q "accTitle:" "$file"; then
            echo "  ⚠️  $file - Mermaid diagram missing accTitle"
            ((WARNINGS++))
        fi
        if ! grep -q "accDescr:" "$file"; then
            echo "  ⚠️  $file - Mermaid diagram missing accDescr"
            ((WARNINGS++))
        fi
    fi
}

# Check LaTeX math syntax
check_latex_math() {
    local file="$1"
    if grep -q '\$\$' "$file"; then
        if grep '\$\$' "$file" | grep -v '\\[' | grep -v '\\]' | head -1 | grep -q '\$\$[^$]*\$\$'; then
            : # Valid display math
        else
            echo "  ⚠️  $file - Check LaTeX math syntax"
            ((WARNINGS++))
        fi
    fi
}

# Count templates
echo "📊 Counting templates..."
TEMPLATE_COUNT=$(find "$TEMPLATES_DIR" -name "*.md" -type f | wc -l)
echo "  Found $TEMPLATE_COUNT templates"
echo ""

# Validate each template
echo "🔍 Validating templates..."
echo ""

for file in $(find "$TEMPLATES_DIR" -name "*.md" -type f | sort); do
    check_required_sections "$file"
    check_ascii_art "$file"
    check_mermaid_syntax "$file"
    check_latex_math "$file"
done

echo ""
echo "=========================================="
echo "Validation Complete"
echo "=========================================="
echo "Templates checked: $TEMPLATE_COUNT"
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All templates passed validation!"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  Templates passed with warnings"
    exit 0
else
    echo "❌ Templates failed validation"
    exit 1
fi
