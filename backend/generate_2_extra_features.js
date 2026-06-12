const fs = require('fs');
const path = require('path');

const apis = [
  {
    name: 'virtual-box',
    schema: {
      kind: 'collectionType',
      collectionName: 'virtual_boxes',
      info: { singularName: 'virtual-box', pluralName: 'virtual-boxes', displayName: 'Virtual Box' },
      options: { draftAndPublish: true },
      attributes: {
        name: { type: 'string' },
        os_version: { type: 'string' },
        ram: { type: 'string' },
        storage: { type: 'string' },
        status: { type: 'enumeration', enum: ['running', 'stopped', 'terminated'], default: 'stopped' },
        user: { type: 'string' }
      }
    }
  },
  {
    name: 'sandbox',
    schema: {
      kind: 'collectionType',
      collectionName: 'sandboxes',
      info: { singularName: 'sandbox', pluralName: 'sandboxes', displayName: 'Sandbox' },
      options: { draftAndPublish: true },
      attributes: {
        name: { type: 'string' },
        language: { type: 'string' },
        code_content: { type: 'text' },
        user: { type: 'string' },
        is_public: { type: 'boolean', default: false }
      }
    }
  }
];

const apiDir = path.join(__dirname, 'src', 'api');

apis.forEach(api => {
  const dir = path.join(apiDir, api.name);
  const contentTypesDir = path.join(dir, 'content-types', api.name);
  const controllersDir = path.join(dir, 'controllers');
  const routesDir = path.join(dir, 'routes');
  const servicesDir = path.join(dir, 'services');

  [contentTypesDir, controllersDir, routesDir, servicesDir].forEach(d => {
    fs.mkdirSync(d, { recursive: true });
  });

  // schema.json
  fs.writeFileSync(
    path.join(contentTypesDir, 'schema.json'),
    JSON.stringify(api.schema, null, 2)
  );

  // controller
  fs.writeFileSync(
    path.join(controllersDir, `${api.name}.js`),
    `'use strict';\n\nconst { createCoreController } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreController('api::${api.name}.${api.name}');\n`
  );

  // route
  fs.writeFileSync(
    path.join(routesDir, `${api.name}.js`),
    `'use strict';\n\nconst { createCoreRouter } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreRouter('api::${api.name}.${api.name}');\n`
  );

  // service
  fs.writeFileSync(
    path.join(servicesDir, `${api.name}.js`),
    `'use strict';\n\nconst { createCoreService } = require('@strapi/strapi').factories;\n\nmodule.exports = createCoreService('api::${api.name}.${api.name}');\n`
  );
  
  console.log(`Created API: ${api.name}`);
});

console.log('All APIs created. Please restart Strapi.');
