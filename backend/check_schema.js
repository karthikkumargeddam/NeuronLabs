const Database = require('better-sqlite3');
const db = new Database('./.tmp/data.db');
const count = db.prepare('SELECT COUNT(*) as c FROM labs WHERE uuid LIKE "phd-lab-%"').get();
console.log(`Total PhD labs in database: ${count.c}`);
