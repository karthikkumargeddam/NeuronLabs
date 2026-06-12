'use strict';

/**
 * notification service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::notification.notification', ({ strapi }) => ({
  async sendRealTimeMail({ userId, emailAddress, subject, message }) {
    try {
      // 1. Send the email
      if (emailAddress) {
        await strapi.plugin('email').service('email').send({
          to: emailAddress,
          subject: subject,
          text: message,
          html: `<p>${message}</p>`,
        });
        strapi.log.info(`Email sent to ${emailAddress}`);
      }

      // 2. Save the notification in the database (optional but recommended)
      if (userId) {
        const notification = await strapi.documents('api::notification.notification').create({
          data: {
            title: subject,
            message: message,
            user: userId,
            isRead: false,
            publishedAt: new Date(),
          },
        });
        strapi.log.info(`Notification saved for user ${userId}`);

        // 3. Emit real-time event via Socket.io
        if (strapi.io) {
          strapi.io.to(`user_${userId}`).emit('new_notification', {
            id: notification.id,
            title: subject,
            message: message,
            createdAt: notification.createdAt,
          });
          strapi.log.info(`Socket event emitted to user_${userId}`);
        }
      }

      return { success: true };
    } catch (err) {
      strapi.log.error('Error sending real-time mail:', err);
      throw err;
    }
  },
}));
