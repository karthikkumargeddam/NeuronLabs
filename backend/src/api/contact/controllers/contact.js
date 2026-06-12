'use strict';

/**
 * contact controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    // Call the default core action
    const response = await super.create(ctx);

    const { data } = ctx.request.body;
    
    // Attempt to send an email notification
    try {
      await strapi.plugin('email').service('email').send({
        to: process.env.SELZY_DEFAULT_REPLY_TO || 'hello@neuronlabs.edu',
        from: process.env.SELZY_DEFAULT_FROM || 'hello@neuronlabs.edu',
        subject: `New Contact Form Submission: ${data.subject}`,
        text: `You have received a new message from the Connect with Us form:
        
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
`,
      });
      strapi.log.info('Contact notification email sent successfully.');
    } catch (err) {
      strapi.log.error('Failed to send contact notification email:', err);
    }

    return response;
  }
}));
