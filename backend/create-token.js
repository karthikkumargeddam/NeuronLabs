const { createStrapi } = require('@strapi/strapi');
require('dotenv').config();
(async () => {
  const app = await createStrapi({ distDir: './dist' }).load();
  const apiTokenService = app.plugin('admin').service('api-token');
  const token = await apiTokenService.create({
    name: 'SuperToken3',
    description: 'Agent generated token',
    type: 'full-access',
    lifespan: null
  });
  console.log('NEW TOKEN IS:', token.accessKey);
  process.exit(0);
})();
