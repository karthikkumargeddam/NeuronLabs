'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::compute-instance.compute-instance');
