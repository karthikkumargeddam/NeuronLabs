const fs = require('fs');
const path = require('path');

const apiName = 'code-snippet';
const apiDir = path.join(__dirname, 'src', 'api', apiName);

const controllerCode = `
'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::${apiName}.${apiName}');
`;

const routeCode = `
'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::${apiName}.${apiName}');
`;

const serviceCode = `
'use strict';
const { createCoreService } = require('@strapi/strapi').factories;
module.exports = createCoreService('api::${apiName}.${apiName}');
`;

fs.writeFileSync(path.join(apiDir, 'controllers', `${apiName}.js`), controllerCode);
fs.writeFileSync(path.join(apiDir, 'routes', `${apiName}.js`), routeCode);
fs.writeFileSync(path.join(apiDir, 'services', `${apiName}.js`), serviceCode);

console.log('✅ Wrote controller, route, and service boilerplate.');
