const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./.tmp/data.db');

db.all('SELECT * FROM up_permissions WHERE action LIKE "%page%"', (err, rows) => {
  console.log('Permissions:');
  console.log(rows);
});

db.all('SELECT * FROM up_users_role_links LIMIT 1', (err, rows) => {
  console.log('Roles:');
  console.log(rows);
});
