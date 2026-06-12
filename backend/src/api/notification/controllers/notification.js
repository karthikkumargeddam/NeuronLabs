'use strict';

/**
 * notification controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::notification.notification', ({ strapi }) => ({
  async sendRealTime(ctx) {
    const { userId, emailAddress, subject, message } = ctx.request.body;
    
    if (!subject || !message) {
      return ctx.badRequest('Subject and message are required');
    }

    try {
      await strapi.service('api::notification.notification').sendRealTimeMail({
        userId,
        emailAddress,
        subject,
        message,
      });
      ctx.send({ success: true, message: 'Notification triggered successfully' });
    } catch (err) {
      ctx.internalServerError('Failed to send notification');
    }
  }
}));
