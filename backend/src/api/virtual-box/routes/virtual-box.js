'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::virtual-box.virtual-box', {
  config: {
    create: {
      middlewares: ['global::is-pro'],
    },
    update: {
      middlewares: ['global::is-pro'],
    },
    delete: {
      middlewares: ['global::is-pro'],
    },
  },
});
