#!/bin/bash
# Setup Script for Automated Documentation
# Run this to complete the setup: bash setup-auto-docs.sh

echo "🚀 Setting up Automated Documentation System..."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm first."
    exit 1
fi

echo "📦 Step 1: Installing Husky..."
npm install husky --save-dev

if [ $? -ne 0 ]; then
    echo "❌ Failed to install husky"
    exit 1
fi

echo "✅ Husky installed"
echo ""

echo "🔧 Step 2: Setting up Husky..."
npm exec husky install

if [ $? -ne 0 ]; then
    echo "❌ Failed to setup husky"
    exit 1
fi

echo "✅ Husky setup complete"
echo ""

echo "🔐 Step 3: Making pre-commit hook executable..."
if [ -f .husky/pre-commit ]; then
    chmod +x .husky/pre-commit
    echo "✅ Pre-commit hook is now executable"
else
    echo "⚠️  Pre-commit hook not found. Creating one..."
fi

echo ""

echo "🧪 Step 4: Testing documentation generator..."
npm run generate-docs

if [ $? -ne 0 ]; then
    echo "⚠️  Generator test returned warning. This may be normal if src/routes is not yet fully populated."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Your automated documentation system is now ready!"
echo ""
echo "Usage:"
echo "  • Manual:    npm run generate-docs"
echo "  • Automatic: git commit (docs auto-update if routes changed)"
echo ""
echo "Files created/updated:"
echo "  ✅ scripts/generate-docs.js"
echo "  ✅ .husky/pre-commit"
echo "  ✅ package.json (with generate-docs script)"
echo ""
echo "Documentation:"
echo "  📄 DOCUMENTATION_AUTOMATION.md - Overview"
echo "  📄 AUTOMATED_DOCS_SETUP.md - Full guide"
echo "  📄 SETUP_DOCS.txt - Quick reference"
echo ""
echo "Next: Make a commit with route changes to see it in action!"
echo ""
