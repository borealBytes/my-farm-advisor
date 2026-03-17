#!/bin/bash
# Skill Selector - Helps choose skills based on priority hierarchy
# Usage: ./scripts/skill-selector.sh [tier|list|search]

set -e

SKILLS_DIR="/data/workspace/skills"
if [ ! -d "$SKILLS_DIR" ]; then
    SKILLS_DIR="./skills"
fi

TIER1="superior-byte-works-wrighter my-farm-advisor"
TIER2="my-farm-breeding-trial-management my-farm-qtl-analysis superior-byte-works-google-timesfm-forecasting"

show_help() {
    cat << 'EOF'
Skill Selector - Priority-based skill selection tool

Usage:
  ./scripts/skill-selector.sh tier [1|2|3]     - Show skills by priority tier
  ./scripts/skill-selector.sh list             - List all available skills
  ./scripts/skill-selector.sh search <term>    - Search skills by name
  ./scripts/skill-selector.sh count            - Count skills by tier

Priority Tiers:
  Tier 1: ALWAYS USE (wrighter, my-farm-advisor)
  Tier 2: Primary project skills
  Tier 3: Supporting skills (K-Dense, Antigravity)

EOF
}

show_tier1() {
    echo "=== TIER 1: ALWAYS USE ==="
    echo "These skills should be considered for almost every task:"
    echo ""
    for skill in $TIER1; do
        if [ -d "$SKILLS_DIR/$skill" ]; then
            echo "  ✓ $skill"
            if [ -f "$SKILLS_DIR/$skill/SKILL.md" ]; then
                head -5 "$SKILLS_DIR/$skill/SKILL.md" | grep -E "^#" | head -1 | sed 's/^#/    /'
            fi
        else
            echo "  ✗ $skill (not found)"
        fi
    done
}

show_tier2() {
    echo "=== TIER 2: PRIMARY PROJECT SKILLS ==="
    echo "Use these for project-specific tasks:"
    echo ""
    for skill in $TIER2; do
        if [ -d "$SKILLS_DIR/$skill" ]; then
            echo "  ✓ $skill"
        else
            echo "  ✗ $skill (not found)"
        fi
    done
}

show_tier3() {
    echo "=== TIER 3: SUPPORTING SKILLS ==="
    echo ""
    
    # Count K-Dense skills
    K_DENSE_COUNT=0
    if [ -d "$SKILLS_DIR" ]; then
        K_DENSE_COUNT=$(find "$SKILLS_DIR" -maxdepth 1 -type d -name "*" | grep -c -E "(adaptyv|aeon|alpha|biopython|citation|clinical|deeptools|geopandas|literature|markitdown|molecular)" || true)
    fi
    echo "K-Dense Scientific Skills: ~$K_DENSE_COUNT directories"
    echo "  Examples: citation-management, clinical-reports, deeptools"
    echo ""
    
    # Count Antigravity skills
    ANTIGRAV_COUNT=0
    if [ -d "$SKILLS_DIR" ]; then
        ANTIGRAV_COUNT=$(find "$SKILLS_DIR" -maxdepth 1 -type d -name "*" | grep -c -E "(agent|ai-|orchestr|memory)" || true)
    fi
    echo "Antigravity Skills: ~$ANTIGRAV_COUNT directories"
    echo "  Examples: agent-orchestrator, ai-engineer, agent-memory-mcp"
}

list_all() {
    echo "=== ALL AVAILABLE SKILLS ==="
    echo ""
    show_tier1
    echo ""
    show_tier2
    echo ""
    show_tier3
}

search_skills() {
    local term="$1"
    echo "=== SEARCH RESULTS FOR: $term ==="
    echo ""
    
    echo "Tier 1 & 2 matches:"
    echo "$TIER1 $TIER2" | tr ' ' '\n' | grep -i "$term" | while read skill; do
        echo "  ⭐ $skill (PRIORITY)"
    done
    echo ""
    
    if [ -d "$SKILLS_DIR" ]; then
        echo "Other matches:"
        find "$SKILLS_DIR" -maxdepth 1 -type d -name "*$term*" -exec basename {} \; | grep -v -E "^(\.|k-dense|antigravity)$" | head -20 | while read skill; do
            echo "  • $skill"
        done
    fi
}

count_skills() {
    echo "=== SKILL COUNT BY TIER ==="
    echo ""
    
    TIER1_COUNT=$(echo "$TIER1" | wc -w)
    TIER2_COUNT=$(echo "$TIER2" | wc -w)
    
    TIER3_COUNT=0
    if [ -d "$SKILLS_DIR" ]; then
        TIER3_COUNT=$(find "$SKILLS_DIR" -maxdepth 1 -type d | wc -l)
        TIER3_COUNT=$((TIER3_COUNT - 1 - 5 - 2))  # minus ., canonical skills, submodules
    fi
    
    echo "Tier 1 (Always Use):    $TIER1_COUNT skills"
    echo "Tier 2 (Primary):         $TIER2_COUNT skills"
    echo "Tier 3 (Supporting):      ~$TIER3_COUNT skills"
    echo "----------------------------------------"
    echo "Total:                    ~$((TIER1_COUNT + TIER2_COUNT + TIER3_COUNT)) skills"
}

# Main
command="${1:-help}"

shift || true

case "$command" in
    tier)
        case "${1:-1}" in
            1) show_tier1 ;;
            2) show_tier2 ;;
            3) show_tier3 ;;
            *) echo "Usage: skill-selector.sh tier [1|2|3]" ;;
        esac
        ;;
    list)
        list_all
        ;;
    search)
        search_skills "$1"
        ;;
    count)
        count_skills
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $command"
        show_help
        exit 1
        ;;
esac
