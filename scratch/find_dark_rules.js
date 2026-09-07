const fs = require('fs');
const content = fs.readFileSync('styles/globals.css', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('data-theme') || l.includes('.dark')) {
    console.log(`L${i+1}: ${l.trim()}`);
  }
});
