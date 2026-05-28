#!/bin/bash
# Initialize git submodules with sparse checkout for K-Dense and Antigravity skills

set -e

echo "Initializing git submodules with sparse checkout..."

# Initialize submodules
git submodule update --init --recursive

# Configure sparse checkout for K-Dense submodule (only scientific-skills directory)
if [ -d "skills/k-dense/.git" ]; then
    echo "Configuring sparse checkout for K-Dense skills..."
    cd skills/k-dense
    git config core.sparseCheckout true
    echo "scientific-skills/*" > .git/info/sparse-checkout
    git checkout HEAD
    cd ../..
fi

# Configure sparse checkout for Antigravity submodule (only skills directory)
if [ -d "skills/antigravity/.git" ]; then
    echo "Configuring sparse checkout for Antigravity skills..."
    cd skills/antigravity
    git config core.sparseCheckout true
    echo "skills/*" > .git/info/sparse-checkout
    git checkout HEAD
    cd ../..
fi

echo "Submodules initialized successfully!"
echo ""
echo "Skills available at:"
echo "  - skills/k-dense/scientific-skills/"
echo "  - skills/antigravity/skills/"
