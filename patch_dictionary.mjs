import fs from 'fs';
import path from 'path';
const dictPath = path.join(process.cwd(), 'lib', 'i18n', 'masterDictionary.js');
let content = fs.readFileSync(dictPath, 'utf8');
const additions = \`n  "Accédez aux analyses exclusives": {
    "EN": "Access exclusive analyses"
  },
  "BECOME A PREMIUM MEMBER": {
    "EN": "BECOME A PREMIUM MEMBER"
  },
  "Entrer dans la Zone VIP": {
    "EN": "Enter the VIP Zone"
  },
  "DONA : La\\\\nRenaissance\\\\nde la Femme Solaire": {
    "EN": "DONA: The\\\\nRenaissance\\\\nof the Solar Woman"
  },
  "\\"Une femme affirmée, positive, ambitieuse et rayonnante,\\\\nen harmonie avec son époque.\\"": {
    "EN": "\\"An assertive, positive, ambitious and radiant woman,\\\\nin harmony with her time.\\""
  },
  "DÉCOUVRIR DONA": {
    "EN": "DISCOVER DONA"
  },
  "LIRE LE MANIFESTE": {
    "EN": "READ THE MANIFESTO"
  },
\;
content = content.replace('const masterDictionary = {', 'const masterDictionary = {' + additions);
fs.writeFileSync(dictPath, content, 'utf8');
console.log("Done");
