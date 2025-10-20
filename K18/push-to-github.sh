#!/bin/bash

# K18 - GitHub Push Helper Script
# This script helps you safely push your code to GitHub

echo "🚀 K18 GitHub Push Helper"
echo "=========================="
echo ""

# Check if we're in the K18 directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the K18 directory"
    exit 1
fi

# Step 1: Show current status
echo "📊 Current Git Status:"
echo "----------------------"
git status --short
echo ""

# Step 2: Check for large files
echo "🔍 Checking for large files that shouldn't be committed..."
echo "-----------------------------------------------------------"

LARGE_FILES=$(find . -type f -size +10M ! -path "*/node_modules/*" ! -path "*/venv/*" ! -path "*/.git/*" 2>/dev/null)

if [ -n "$LARGE_FILES" ]; then
    echo "⚠️  Warning: Found large files (>10MB):"
    echo "$LARGE_FILES"
    echo ""
    echo "These should probably be in .gitignore!"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ No large files detected"
fi
echo ""

# Step 3: Show what will be committed
echo "📝 Files that will be committed:"
echo "--------------------------------"
git add --dry-run . 2>/dev/null | head -20
echo ""

# Step 4: Verify exclusions
echo "🚫 Verifying .gitignore is working:"
echo "------------------------------------"

if [ -d "node_modules" ]; then
    echo "✅ node_modules/ exists locally ($(du -sh node_modules 2>/dev/null | cut -f1))"
else
    echo "⚠️  node_modules/ not found"
fi

if [ -d "backend/venv" ]; then
    echo "✅ backend/venv/ exists locally ($(du -sh backend/venv 2>/dev/null | cut -f1))"
else
    echo "⚠️  backend/venv/ not found"
fi

# Check if they would be committed
if git ls-files | grep -q "node_modules/"; then
    echo "❌ ERROR: node_modules/ is being tracked by git!"
    echo "Fix: git rm -r --cached node_modules/"
    exit 1
else
    echo "✅ node_modules/ is properly ignored"
fi

if git ls-files | grep -q "venv/"; then
    echo "❌ ERROR: venv/ is being tracked by git!"
    echo "Fix: git rm -r --cached backend/venv/"
    exit 1
else
    echo "✅ venv/ is properly ignored"
fi
echo ""

# Step 5: Estimate repo size
echo "📦 Estimated repository size:"
echo "-----------------------------"
REPO_SIZE=$(git ls-files | xargs -I{} du -ch {} 2>/dev/null | tail -1 | cut -f1)
echo "Repository size: $REPO_SIZE"
echo ""

if [[ $REPO_SIZE == *G* ]]; then
    echo "❌ ERROR: Repository size is in GB! Something is wrong."
    echo "Expected: ~50MB"
    echo "Check .gitignore and remove large files from git"
    exit 1
else
    echo "✅ Repository size looks good"
fi
echo ""

# Step 6: Confirm push
echo "🎯 Ready to push to GitHub!"
echo "============================="
echo ""
echo "This will:"
echo "  1. Stage all files (respecting .gitignore)"
echo "  2. Create a commit"
echo "  3. Push to origin/main"
echo ""
read -p "Continue with push? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push cancelled"
    exit 0
fi

# Step 7: Stage files
echo ""
echo "📥 Staging files..."
git add .

# Step 8: Show what's staged
echo ""
echo "📋 Staged files:"
git status --short | head -20
echo ""

# Step 9: Create commit
echo "💬 Enter commit message (or press Enter for default):"
read -r COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="feat: Complete K18 AI Hair Analysis System

- Add AI-powered hair type detection using Vision Transformer
- Implement weather-aware product recommendations  
- Create comprehensive documentation and setup scripts
- Configure lightweight repo (~50MB)
- Add FastAPI backend + React frontend
- Include automated installation (./start.sh)

Technical Stack:
- Backend: Python 3.10+, FastAPI, PyTorch, Transformers
- Frontend: React 18, TypeScript, Vite, TailwindCSS
- AI: Vision Transformer (google/vit-base-patch16-224)

Installation: Clone repo and run ./start.sh"
fi

echo ""
echo "📝 Creating commit..."
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo "❌ Commit failed"
    exit 1
fi

# Step 10: Push
echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next steps:"
    echo "  1. Visit: https://github.com/Elyeden0/k18-style-guide"
    echo "  2. Verify repo size is ~50MB"
    echo "  3. Check that README displays correctly"
    echo "  4. Test clone + install in a different directory"
    echo ""
    echo "📖 Test clone:"
    echo "  cd /tmp"
    echo "  git clone https://github.com/Elyeden0/k18-style-guide.git"
    echo "  cd k18-style-guide/K18"
    echo "  ./start.sh"
    echo ""
else
    echo ""
    echo "❌ Push failed"
    echo "Check your Git credentials and remote URL"
    exit 1
fi
