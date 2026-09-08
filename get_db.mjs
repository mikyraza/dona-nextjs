import { getDatabase } from './lib/db.js'; const db = getDatabase(); console.log(JSON.stringify(db.prepare('SELECT title, summary, desc FROM articles').all(), null, 2));
