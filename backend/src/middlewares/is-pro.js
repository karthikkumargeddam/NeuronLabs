'use strict';

/**
 * `is-pro` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in to access this resource.');
    }

    if (user.isPro !== true) {
      return ctx.forbidden('This feature requires an active NeuronLabs Pro subscription.');
    }

    await next();
  };
};
