
import { getDatabase } from './lib/db.js';
const db = getDatabase();
const strings = new Set();
const add = (str) => { if (str && typeof str === 'string' && str.length > 1) strings.add(str.trim()); };

db.prepare('SELECT title, summary, desc FROM articles').all().forEach(r => { add(r.title); add(r.summary); add(r.desc); });
db.prepare('SELECT title, description FROM dossiers').all().forEach(r => { add(r.title); add(r.description); });
try { db.prepare('SELECT current_title, current_subtitle, current_guest FROM tv_live').all().forEach(r => { add(r.current_title); add(r.current_subtitle); add(r.current_guest); }); } catch(e){}
db.prepare('SELECT title, subtitle FROM videos').all().forEach(r => { add(r.title); add(r.subtitle); });

console.log(JSON.stringify(Array.from(strings), null, 2));

