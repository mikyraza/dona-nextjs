import fs from 'fs';
const translations = JSON.parse(fs.readFileSync('db_translations.json', 'utf8'));
const path = 'lib/i18n/masterDictionary.js';
let content = fs.readFileSync(path, 'utf8');

let insertionPoint = content.lastIndexOf('}');
if (insertionPoint === -1) process.exit(1);

let extraLines = [];
for (const [fr, en] of Object.entries(translations)) {
  if (!content.includes(JSON.stringify(fr))) {
    extraLines.push(`  ${JSON.stringify(fr)}: ${JSON.stringify(en)},`);
  }
}

if (extraLines.length > 0) {
  const beforeEnd = content.slice(0, insertionPoint).trimEnd();
  const needsComma = !beforeEnd.endsWith(',');
  let newContent = beforeEnd + (needsComma ? ',' : '') + '\n' + extraLines.join('\n') + '\n};';
  fs.writeFileSync(path, newContent, 'utf8');
  console.log('Added ' + extraLines.length + ' translations to dictionary.');
} else {
  console.log('No new translations to add.');
}
