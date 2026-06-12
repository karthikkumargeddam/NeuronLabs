const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');
const db = new Database(dbPath);

try {
  // 1. Get the public role ID
  const role = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
  
  if (!role) {
    throw new Error('Public role not found');
  }
  
  const roleId = role.id;
  const actions = [
    'api::code-snippet.code-snippet.find',
    'api::code-snippet.code-snippet.findOne',
    'api::code-snippet.code-snippet.create',
    'api::code-snippet.code-snippet.update',
    'api::code-snippet.code-snippet.delete'
  ];
  
  actions.forEach(action => {
    let permId;
    const existingPerm = db.prepare("SELECT id FROM up_permissions WHERE action = ?").get(action);
    
    if (!existingPerm) {
      const result = db.prepare("INSERT INTO up_permissions (action, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))").run(action);
      permId = result.lastInsertRowid;
    } else {
      permId = existingPerm.id;
    }
    
    const existingLink = db.prepare("SELECT * FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = ?").get(permId, roleId);
    if (!existingLink) {
      db.prepare("INSERT INTO up_permissions_role_lnk (permission_id, role_id) VALUES (?, ?)").run(permId, roleId);
      console.log(`Granted ${action} to public role`);
    } else {
      console.log(`${action} already granted to public role`);
    }
  });

  console.log('✅ Public permissions granted for code-snippet.');
} catch (err) {
  console.error('Error granting permissions:', err);
} finally {
  db.close();
}
