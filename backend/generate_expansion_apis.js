const fs = require('fs');
const path = require('path');

const apis = [
  {
    name: 'job',
    schema: {
      kind: 'collectionType',
      collectionName: 'jobs',
      info: { singularName: 'job', pluralName: 'jobs', displayName: 'Job' },
      options: { draftAndPublish: true },
      pluginOptions: {},
      attributes: {
        title: { type: 'string', required: true },
        company: { type: 'string' },
        salary: { type: 'string' },
        type: { type: 'string' },
        location: { type: 'string' },
        logo: { type: 'string' },
        tags: { type: 'json' }
      }
    }
  },
  {
    name: 'profile',
    schema: {
      kind: 'collectionType',
      collectionName: 'profiles',
      info: { singularName: 'profile', pluralName: 'profiles', displayName: 'Profile' },
      options: { draftAndPublish: true },
      pluginOptions: {},
      attributes: {
        username: { type: 'string', required: true },
        avatarUrl: { type: 'string' },
        rank: { type: 'integer' },
        score: { type: 'string' },
        badge: { type: 'string' },
        completedCourses: { type: 'integer' },
        color: { type: 'string' }
      }
    }
  },
  {
    name: 'model',
    schema: {
      kind: 'collectionType',
      collectionName: 'models',
      info: { singularName: 'model', pluralName: 'models', displayName: 'Model' },
      options: { draftAndPublish: true },
      pluginOptions: {},
      attributes: {
        name: { type: 'string', required: true },
        description: { type: 'text' },
        architecture: { type: 'string' },
        task: { type: 'string' },
        color: { type: 'string' }
      }
    }
  }
];

const apiDir = path.join(__dirname, 'src', 'api');

apis.forEach(api => {
  const dirPath = path.join(apiDir, api.name);
  
  // Create directories
  ['content-types', 'controllers', 'routes', 'services'].forEach(folder => {
    fs.mkdirSync(path.join(dirPath, folder, folder === 'content-types' ? api.name : ''), { recursive: true });
  });

  // Write schema.json
  fs.writeFileSync(
    path.join(dirPath, 'content-types', api.name, 'schema.json'),
    JSON.stringify(api.schema, null, 2)
  );

  // Write controller
  fs.writeFileSync(
    path.join(dirPath, 'controllers', `${api.name}.js`),
    `'use strict';\nconst { createCoreController } = require('@strapi/strapi').factories;\nmodule.exports = createCoreController('api::${api.name}.${api.name}');\n`
  );

  // Write route
  fs.writeFileSync(
    path.join(dirPath, 'routes', `${api.name}.js`),
    `'use strict';\nconst { createCoreRouter } = require('@strapi/strapi').factories;\nmodule.exports = createCoreRouter('api::${api.name}.${api.name}', {\n  config: {\n    find: { auth: false },\n    findOne: { auth: false },\n    create: { auth: false },\n    update: { auth: false },\n    delete: { auth: false }\n  }\n});\n`
  );

  // Write service
  fs.writeFileSync(
    path.join(dirPath, 'services', `${api.name}.js`),
    `'use strict';\nconst { createCoreService } = require('@strapi/strapi').factories;\nmodule.exports = createCoreService('api::${api.name}.${api.name}');\n`
  );
  
  console.log(`Generated API for ${api.name}`);
});

console.log('Expansion APIs generated successfully.');
