const fs = require('fs');
const path = require('path');

const apis = [
  {
    name: 'dataset',
    schema: {
      kind: 'collectionType',
      collectionName: 'datasets',
      info: { singularName: 'dataset', pluralName: 'datasets', displayName: 'Dataset' },
      options: { draftAndPublish: true },
      pluginOptions: {},
      attributes: {
        title: { type: 'string', required: true },
        description: { type: 'text' },
        size: { type: 'string' },
        downloads: { type: 'string' },
        tags: { type: 'json' },
        color: { type: 'string' }
      }
    }
  },
  {
    name: 'showcase',
    schema: {
      kind: 'collectionType',
      collectionName: 'showcases',
      info: { singularName: 'showcase', pluralName: 'showcases', displayName: 'Showcase' },
      options: { draftAndPublish: true },
      pluginOptions: {},
      attributes: {
        title: { type: 'string', required: true },
        author: { type: 'string' },
        description: { type: 'text' },
        tags: { type: 'json' },
        color: { type: 'string' },
        avatarUrl: { type: 'string' },
        upvotes: { type: 'integer' },
        githubUrl: { type: 'string' }
      }
    }
  },
  {
    name: 'competition',
    schema: {
      kind: 'collectionType',
      collectionName: 'competitions',
      info: { singularName: 'competition', pluralName: 'competitions', displayName: 'Competition' },
      options: { draftAndPublish: true },
      pluginOptions: {},
      attributes: {
        title: { type: 'string', required: true },
        prize: { type: 'string' },
        participants: { type: 'integer' },
        daysLeft: { type: 'integer' },
        tags: { type: 'json' },
        color: { type: 'string' },
        iconStr: { type: 'string' }
      }
    }
  },
  {
    name: 'pipeline',
    schema: {
      kind: 'collectionType',
      collectionName: 'pipelines',
      info: { singularName: 'pipeline', pluralName: 'pipelines', displayName: 'Pipeline' },
      options: { draftAndPublish: true },
      pluginOptions: {},
      attributes: {
        name: { type: 'string', required: true },
        nodes: { type: 'json' },
        edges: { type: 'json' }
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

console.log('All APIs generated successfully.');
