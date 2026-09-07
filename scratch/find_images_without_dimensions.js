const fs = require('fs');
const path = require('path');

function scanDir(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, results);
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Match full <img ... /> tags even across multiple lines
      const imgRegex = /<img\s+([^>]*?)(\/?>)/gs;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        const attrStr = match[1];
        const line = content.substring(0, match.index).split('\n').length;
        const hasWidth = /width\s*=\s*['"{\d]/.test(attrStr);
        const hasHeight = /height\s*=\s*['"{\d]/.test(attrStr);
        const hasAspectRatio = /aspectRatio|aspect-ratio/.test(attrStr);

        results.push({
          file: fullPath,
          line,
          code: match[0].replace(/\s+/g, ' ').slice(0, 100),
          hasWidth,
          hasHeight,
          hasAspectRatio,
          issue: (!hasWidth || !hasHeight) && !hasAspectRatio
        });
      }
    }
  }
  return results;
}

const appResults = scanDir('app');
const compResults = scanDir('components');
const all = [...appResults, ...compResults];

console.log(`Total <img> tags scanned: ${all.length}`);
const withIssues = all.filter(r => r.issue);
console.log(`Images missing specific dimensions or aspect-ratio: ${withIssues.length}\n`);

withIssues.forEach((item, i) => {
  console.log(`[${i + 1}] ${item.file}:${item.line}`);
  console.log(`    ${item.code}`);
  console.log(`    Width: ${item.hasWidth}, Height: ${item.hasHeight}, AspectRatio: ${item.hasAspectRatio}\n`);
});
