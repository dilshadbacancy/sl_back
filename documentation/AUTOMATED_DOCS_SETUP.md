# 🤖 Automated Documentation Setup

Your project now has **automatic documentation generation** enabled!

---

## How It Works

### Option 1: Manual Generation (Anytime)
```bash
npm run generate-docs
```
Run this command whenever you add/modify routes to update docs.

### Option 2: Automatic on Commit (After Setup)
```bash
git commit -m "Add new routes"
# ↓
# Pre-commit hook automatically:
# ✅ Detects route changes
# ✅ Generates documentation
# ✅ Adds docs to commit
```

---

## Setup Instructions

### Step 1: Install Husky (Git Hooks Manager)
```bash
npm install husky --save-dev
npm exec husky install
```

### Step 2: Make Pre-Commit Hook Executable
```bash
chmod +x .husky/pre-commit
```

### Step 3: Done! ✨

Now your documentation will auto-generate on commits with route changes.

---

## What Gets Auto-Generated

When you add/modify routes:

✅ **API_DOCUMENTATION.md** updated with:
- New endpoints
- HTTP methods
- Endpoint paths
- File references

✅ **QUICK_START.md** statistics updated with:
- Route counts by category
- Total endpoint count
- Last generated timestamp

✅ **Git commit** automatically includes docs

---

## Usage Examples

### Example 1: Add New Route
```bash
# Edit src/routes/customer/cutomer.route.ts
# Add: router.post('/new-endpoint', ...)

git add src/routes/customer/cutomer.route.ts
git commit -m "Add new endpoint"

# ↓ Automatically:
# 🔍 Detects route changes
# 📚 Generates documentation
# ✅ Adds documentation to commit
```

### Example 2: Batch Updates
```bash
# Modify multiple route files
git add src/routes/**/*.ts
git commit -m "Refactor multiple routes"

# ↓ All route changes detected and docs updated
```

### Example 3: Manual Generation
```bash
# Want to generate docs without committing?
npm run generate-docs

# Or schedule it:
# npm run generate-docs && npm run build
```

---

## Files Created

### Scripts
- **`scripts/generate-docs.js`** - Doc generator script
  - Scans `src/routes/` directory
  - Extracts route definitions
  - Updates markdown files
  - Generates statistics

### Git Hooks
- **`.husky/pre-commit`** - Runs before every commit
  - Detects route file changes
  - Auto-runs doc generation
  - Adds docs to commit

### Config
- **`package.json`** - Updated with:
  - `npm run generate-docs` script
  - `husky` dependency
  - `prepare` script for setup

---

## What's Documented

The generator extracts:

```
✅ HTTP Method (GET, POST, PUT, DELETE)
✅ Full endpoint path
✅ File location
✅ Route category
✅ Total route count
✅ Category statistics
✅ Last generated timestamp
```

---

## Customization

### Want to change what's generated?
Edit `scripts/generate-docs.js`:

```javascript
// Line 47: Change what patterns are detected
const routePattern = /router\.(get|post|put|delete|patch)...

// Line 60+: Change output format
doc += `### ${route.method} ${route.path}\n`;
```

### Want to generate on different events?
Modify `.husky/pre-commit` or create new hooks:
- `pre-push` - Generate before pushing
- `post-merge` - Generate after pulling
- Custom events

---

## Workflow Integration

### With Your Current Flow

```
┌─ You modify routes
│
├─ git add .
│
├─ git commit -m "message"
│  └─→ 🪝 Pre-commit hook runs
│      ├─ 🔍 Detects route changes
│      ├─ 📚 npm run generate-docs
│      ├─ 📄 Updates documentation
│      └─ ✅ Includes docs in commit
│
└─ git push
```

---

## Troubleshooting

### Pre-commit hook not running?

**Fix 1:** Make it executable
```bash
chmod +x .husky/pre-commit
```

**Fix 2:** Ensure husky is installed
```bash
npm install husky --save-dev
npx husky install
```

**Fix 3:** Check git hooks are enabled
```bash
ls -la .husky/pre-commit
# Should show: -rwxr-xr-x (executable)
```

### Docs not updating?

**Check 1:** Verify route patterns are correct
```bash
npm run generate-docs
# Should output: Found X routes
```

**Check 2:** Verify file paths exist
```bash
ls -la src/routes/
# Should show: admin/, common/, user/, vendor/
```

### Want to skip auto-generation for a commit?

```bash
git commit --no-verify -m "Emergency fix"
# Bypasses pre-commit hook
```

---

## Disabling Auto-Generation

If you want to turn it off:

```bash
# Temporarily disable
git config core.hooksPath ''

# Re-enable
git config core.hooksPath .husky
```

Or delete the hook:
```bash
rm .husky/pre-commit
```

---

## Advanced: Custom Generation

Add your own doc generation:

```bash
# In package.json, add:
"generate-docs": "npm run generate-api-docs && npm run generate-schema-docs && npm run generate-examples"
```

Then create additional scripts:
- `scripts/generate-api-docs.js`
- `scripts/generate-schema-docs.js`
- `scripts/generate-examples.js`

---

## Next Steps

1. **Install Husky:**
   ```bash
   npm install husky --save-dev
   ```

2. **Make hook executable:**
   ```bash
   chmod +x .husky/pre-commit
   ```

3. **Test it:**
   ```bash
   npm run generate-docs
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Setup automated documentation"
   ```

---

## FAQ

**Q: Will this slow down my commits?**
A: Only if you modify routes. Takes ~200ms to generate docs.

**Q: Can I customize what gets documented?**
A: Yes! Edit `scripts/generate-docs.js` to change patterns and output.

**Q: What if I modify a route but don't want docs updated?**
A: Use `git commit --no-verify` to skip the hook.

**Q: Does this work on team projects?**
A: Yes! The hook is committed to git, so all team members get it.

**Q: Can I use this with GitHub Actions?**
A: Yes! Run `npm run generate-docs` in your CI/CD pipeline.

---

## Documentation Files Location

Your documentation is kept in `/documentation/`:

```
documentation/
├── 01-API-Reference/
│   └── API_DOCUMENTATION.md ← Auto-updated
├── QUICK_START.md ← Statistics auto-updated
├── TABLE_OF_CONTENTS.md
└── ... (other documentation)
```

---

**Your documentation is now self-updating! 🚀**

Every time you commit route changes, documentation automatically updates.

No more manual doc updates needed!
