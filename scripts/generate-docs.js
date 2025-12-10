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
const ROUTES_GUIDE_PATH = path.join(DOCS_DIR, '02-Routes-Guide/COMPLETE_ROUTES_DOCUMENTATION.md');
const FLOWCHART_PATH = path.join(DOCS_DIR, '03-Flowcharts/ROUTES_OVERVIEW.mmd');
const TABLE_OF_CONTENTS_PATH = path.join(DOCS_DIR, 'TABLE_OF_CONTENTS.md');

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
 * Generate or update the complete routes documentation (02-Routes-Guide)
 */
function generateRoutesGuide() {
  // ensure directory
  const dir = path.dirname(ROUTES_GUIDE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let doc = `# Complete Routes Documentation - Auto-Generated\n\n`;
  doc += `**Last Updated:** ${new Date().toLocaleString()}  \n**Total Routes:** ${totalRoutes}\n\n---\n\n`;

  Object.keys(routesByCategory).forEach(category => {
    const routes = routesByCategory[category];
    doc += `## ${category.toUpperCase()} (${routes.length})\n\n`;

    routes.forEach(route => {
      doc += `### ${route.method} ${route.path}\n`;
      doc += `- **Defined In:** \`${route.file}\`\n`;
      doc += `- **Category:** ${route.category}\n\n`;
    });
  });

  fs.writeFileSync(ROUTES_GUIDE_PATH, doc, 'utf8');
  console.log(`✅ Routes Guide updated: ${ROUTES_GUIDE_PATH}`);
}

/**
 * Generate a simple mermaid flowchart overview of routes by category
 */
function generateFlowchartOverview() {
  const dir = path.dirname(FLOWCHART_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Build a simple flowchart showing categories and counts
  let chart = `flowchart TD\n`;
  chart += `    A[Routes] --> B[Categories]\n`;
  Object.keys(routesByCategory).forEach((cat, i) => {
    const node = `C${i}`;
    const count = routesByCategory[cat].length || 0;
    chart += `    B --> ${node}[${cat} (${count})]\n`;
  });

  fs.writeFileSync(FLOWCHART_PATH, chart, 'utf8');
  console.log(`✅ Flowchart overview updated: ${FLOWCHART_PATH}`);
}

/**
 * Update / regenerate documentation/TABLE_OF_CONTENTS.md with links to generated docs
 */
function updateTableOfContents() {
  const dir = path.dirname(TABLE_OF_CONTENTS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const now = new Date().toLocaleString();
  let toc = `# Documentation Index - Auto-Generated\n\n`;
  toc += `**Last Updated:** ${now}\n\n`;
  toc += `- [API Reference](./01-API-Reference/API_DOCUMENTATION.md) - Auto-generated\n`;
  toc += `- [Complete Routes Guide](./02-Routes-Guide/COMPLETE_ROUTES_DOCUMENTATION.md) - Auto-generated\n`;
  toc += `- [Quick Start](./QUICK_START.md)\n`;
  toc += `- [Routes Overview Flowchart](./03-Flowcharts/ROUTES_OVERVIEW.mmd)\n\n`;
  toc += `## Routes Summary\n\n`;

  Object.keys(routesByCategory).forEach(cat => {
    const count = routesByCategory[cat].length || 0;
    toc += `- **${cat}**: ${count} routes\n`;
  });

  fs.writeFileSync(TABLE_OF_CONTENTS_PATH, toc, 'utf8');
  console.log(`✅ Table of Contents updated: ${TABLE_OF_CONTENTS_PATH}`);
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
 * Update README.md with latest route counts
 */
function updateReadmeStats() {
  const README_PATH = path.join(__dirname, '../README.md');
  if (!fs.existsSync(README_PATH)) return;
  
  let content = fs.readFileSync(README_PATH, 'utf8');
  
  // Update documentation reference count
  content = content.replace(
    /All \d+ endpoints with examples/,
    `All ${totalRoutes} endpoints with examples`
  );
  
  // Update API Statistics table - use HTML comments as precise markers
  const startMarker = '<!-- API_STATS_START -->';
  const endMarker = '<!-- API_STATS_END -->';
  
  const newStatsContent = `<!-- API_STATS_START -->
## 📊 API Statistics

| Metric | Value |
|--------|-------|
| **Total Endpoints** | ${totalRoutes} |
| **Common Routes** | ${routesByCategory['common']?.length || 0} |
| **User Routes** | ${routesByCategory['user']?.length || 0} |
| **Vendor Routes** | ${routesByCategory['vendor']?.length || 0} |
| **HTTP Methods** | GET + POST |
| **Last Updated** | Auto-generated |

---
<!-- API_STATS_END -->`;

  // Find and replace content between markers
  const markerPattern = /<!-- API_STATS_START -->[\s\S]*?<!-- API_STATS_END -->/;
  
  if (markerPattern.test(content)) {
    content = content.replace(markerPattern, newStatsContent);
  }
  
  fs.writeFileSync(README_PATH, content, 'utf8');
  console.log(`✅ README.md statistics updated`);
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
    generateRoutesGuide();
    generateFlowchartOverview();
    updateQuickStartStats();
    updateReadmeStats();
    
    console.log('\n✨ Documentation generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Documentation generation failed:', error);
    process.exit(1);
  }
}

main();
