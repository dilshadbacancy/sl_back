#!/usr/bin/env node

/**
 * Automatic Documentation Generator
 * Scans src/routes and generates comprehensive API documentation
 * 
 * Usage: npm run generate-docs
 */

const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.join(__dirname, '../src/routes');
const DOCS_DIR = path.join(__dirname, '../documentation');
const API_DOC_PATH = path.join(DOCS_DIR, '01-API-Reference/API_DOCUMENTATION.md');
const QUICK_START_PATH = path.join(DOCS_DIR, 'QUICK_START.md');

let totalRoutes = 0;
const routesByCategory = {};
const allRoutes = [];

/**
 * Extract routes from a file
 */
function extractRoutesFromFile(filePath, category) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to find router methods: router.get, router.post, etc.
    const routePattern = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]\s*,/g;
    let match;
    
    while ((match = routePattern.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      
      totalRoutes++;
      
      const route = {
        method,
        path: `/${category}${routePath}`,
        category,
        file: path.relative(ROUTES_DIR, filePath)
      };
      
      allRoutes.push(route);
      
      if (!routesByCategory[category]) {
        routesByCategory[category] = [];
      }
      routesByCategory[category].push(route);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
}

/**
 * Recursively scan routes directory
 */
function scanRoutes() {
  const categories = ['admin', 'common', 'user', 'vendor'];
  
  categories.forEach(category => {
    const categoryPath = path.join(ROUTES_DIR, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.route.ts') || f.endsWith('.route.js'));
      
      files.forEach(file => {
        const filePath = path.join(categoryPath, file);
        extractRoutesFromFile(filePath, category);
      });
    }
  });
}

/**
 * Generate API Documentation
 */
function generateAPIDocumentation() {
  let doc = `# API Documentation - Auto-Generated

**Last Updated:** ${new Date().toLocaleString()}  
**Total Routes:** ${totalRoutes}

---

## 📚 Routes by Category\n\n`;

  // Add stats table
  doc += `| Category | Routes | Methods |\n`;
  doc += `|----------|--------|----------|\n`;
  
  Object.keys(routesByCategory).forEach(category => {
    const routes = routesByCategory[category];
    const methods = new Set(routes.map(r => r.method)).size;
    doc += `| ${category} | ${routes.length} | ${methods} |\n`;
  });
  
  doc += `\n---\n\n`;

  // Add routes by category
  Object.keys(routesByCategory).forEach(category => {
    const routes = routesByCategory[category];
    doc += `## ${category.toUpperCase()} Routes (${routes.length})\n\n`;
    
    routes.forEach(route => {
      doc += `### ${route.method} ${route.path}\n`;
      doc += `- **File:** \`${route.file}\`\n`;
      doc += `- **Method:** ${route.method}\n`;
      doc += `- **Endpoint:** \`${route.path}\`\n\n`;
    });
  });

  doc += `\n---\n\n`;
  doc += `## Summary\n\n`;
  doc += `- Total endpoints: **${totalRoutes}**\n`;
  doc += `- Categories: **${Object.keys(routesByCategory).length}**\n`;
  doc += `- Generated: **${new Date().toLocaleString()}**\n`;

  fs.writeFileSync(API_DOC_PATH, doc, 'utf8');
  console.log(`✅ API Documentation updated: ${totalRoutes} routes found`);
}

/**
 * Update route statistics in QUICK_START.md
 */
function updateQuickStartStats() {
  if (!fs.existsSync(QUICK_START_PATH)) return;
  
  let content = fs.readFileSync(QUICK_START_PATH, 'utf8');
  
  // Update route summary table
  const statsTable = `| Category | Count | Key Routes |
|----------|-------|-----------|
${Object.keys(routesByCategory).map(cat => {
  const count = routesByCategory[cat].length;
  const methods = new Set(routesByCategory[cat].map(r => r.method)).size;
  return `| ${cat} | ${count} | ${methods} methods |`;
}).join('\n')}`;

  // Replace the old stats table (if exists)
  const statsPattern = /\| Category \| Count \| Key Routes \|\n\|----------|-------|-----------|[\s\S]*?\n(?=\n---)/;
  content = content.replace(statsPattern, statsTable);

  fs.writeFileSync(QUICK_START_PATH, content, 'utf8');
  console.log(`✅ QUICK_START.md statistics updated`);
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning routes...');
  
  try {
    scanRoutes();
    console.log(`📍 Found ${totalRoutes} routes across ${Object.keys(routesByCategory).length} categories`);
    
    generateAPIDocumentation();
    updateQuickStartStats();
    
    console.log('\n✨ Documentation generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Documentation generation failed:', error);
    process.exit(1);
  }
}

main();
