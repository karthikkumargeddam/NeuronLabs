'use strict';
const { createCoreRouter } = require('@strapi/strapi').factories;
module.exports = createCoreRouter('api::lab.lab', {
  config: {
    find: { auth: false },
    findOne: { auth: false }
  }
});
