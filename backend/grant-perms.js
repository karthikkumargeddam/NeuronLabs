const strapi = require('@strapi/strapi');
(async () => {
  const app = await strapi({ distDir: './dist' }).load();
  const publicRole = await app.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  
  if (publicRole) {
    console.log('Public Role Found:', publicRole.id);
    await app.plugin('users-permissions').service('role').updateRole(publicRole.id, {
      permissions: {
        'api::course.course': {
          controllers: {
            course: {
              find: { enabled: true },
              findOne: { enabled: true }
            }
          }
        },
        'api::lab.lab': {
          controllers: {
            lab: {
              find: { enabled: true },
              findOne: { enabled: true },
              create: { enabled: true }
            }
          }
        },
        'api::feedback.feedback': {
          controllers: {
            feedback: {
              create: { enabled: true }
            }
          }
        }
      }
    });
    console.log('Successfully granted permissions!');
  } else {
    console.log('Public role not found');
  }
  process.exit(0);
})();
