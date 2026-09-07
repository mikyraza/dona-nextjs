const fs = require('fs');

function inspectFile(file) {
  console.log('=== INSPECTING: ' + file + ' ===');
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    const l = line.toLowerCase();
    if (
      l.includes('#fff') ||
      l.includes('#111') ||
      l.includes('#f9f6f3') ||
      l.includes('#f4f3f0') ||
      l.includes('#fcfcfb') ||
      l.includes('#ffffff') ||
      l.includes('background: "#fff') ||
      l.includes('background: "#111') ||
      l.includes("background: '#fff") ||
      l.includes("background: '#111") ||
      l.includes('background: "white') ||
      l.includes("background: 'white") ||
      l.includes('background: "rgb') ||
      l.includes('color: "#fff') ||
      l.includes('color: "#111')
    ) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
    }
  });
}

inspectFile('app/search/page.jsx');
inspectFile('app/today/page.jsx');
