require('dotenv').config();
const { createStrapi } = require('@strapi/strapi');

(async () => {
  const app = await createStrapi({ distDir: './dist' }).load();
  const publicRole = await app.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
    populate: ['permissions']
  });

  if (publicRole) {
    console.log('Public Role Found:', publicRole.id);
    
    // Fetch all current permissions for public role
    const currentPermissions = await app.db.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id }
    });

    // We only need to enable api::contact.contact.create
    // Let's use the users-permissions role service which handles the transformation
    const roleService = app.plugin('users-permissions').service('role');
    const role = await roleService.findOne(publicRole.id);
    
    // role.permissions is structured as a nested object
    if (!role.permissions['api::contact']) {
      role.permissions['api::contact'] = { controllers: { contact: {} } };
    }
    if (!role.permissions['api::contact'].controllers) {
      role.permissions['api::contact'].controllers = { contact: {} };
    }
    if (!role.permissions['api::contact'].controllers.contact) {
      role.permissions['api::contact'].controllers.contact = {};
    }
    role.permissions['api::contact'].controllers.contact.create = { enabled: true };

    await roleService.updateRole(publicRole.id, {
      permissions: role.permissions
    });
    
    console.log('Successfully granted create permission for contact API!');
  } else {
    console.log('Public role not found');
  }
  process.exit(0);
})();
