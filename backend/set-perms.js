const Database = require('better-sqlite3');
const db = new Database('./.tmp/data.db');

try {
  // Find public role ID
  const publicRole = db.prepare("SELECT id FROM up_roles WHERE type = 'public'").get();
  if (publicRole) {
    console.log("Public role ID:", publicRole.id);
    
    // We also need find and findOne on labs just in case they aren't fully enabled
    const actions = ['api::lab.lab.create', 'api::lab.lab.find', 'api::lab.lab.findOne'];

    for (const action of actions) {
      const existingPerm = db.prepare("SELECT id FROM up_permissions WHERE action = ?").get(action);
      let permId;
      
      if (!existingPerm) {
        const result = db.prepare("INSERT INTO up_permissions (action, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))").run(action);
        permId = result.lastInsertRowid;
        console.log("Inserted permission:", action, permId);
      } else {
        permId = existingPerm.id;
        console.log("Permission already exists:", action, permId);
      }

      const existingLink = db.prepare("SELECT * FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = ?").get(permId, publicRole.id);
      
      if (!existingLink) {
        db.prepare("INSERT INTO up_permissions_role_lnk (permission_id, role_id) VALUES (?, ?)").run(permId, publicRole.id);
        console.log(`Granted ${action} permission to public role.`);
      } else {
        console.log(`Permission link already exists for ${action}.`);
      }
    }
  } else {
    console.log("Public role not found.");
  }
} catch (error) {
  console.error("Error updating permissions:", error);
}
