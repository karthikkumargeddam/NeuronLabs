module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      // 1. Fetch the full notification including the attached User so we can get their email
      const notification = await strapi.documents('api::notification.notification').findOne({
        documentId: result.documentId,
        populate: ['user'],
      });

      // 2. If the notification is attached to a user with a valid email, send it!
      if (notification && notification.user && notification.user.email) {
        await strapi.plugins['email'].services.email.send({
          to: notification.user.email,
          from: process.env.SELZY_DEFAULT_FROM || 'hello@neuronlabs.edu',
          subject: notification.title || 'New Notification from NeuronLabs',
          text: notification.message,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #fafafa;">
              <h2 style="color: #8b5cf6; margin-bottom: 5px;">NeuronLabs</h2>
              <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${notification.title}</h3>
              <p style="color: #334155; font-size: 16px; line-height: 1.6; padding: 10px 0;">
                ${notification.message}
              </p>
              <div style="margin-top: 20px; text-align: center;">
                <a href="https://neuron-frontend-o7em.vercel.app/dashboard" style="background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
              </div>
              <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 30px 0 15px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">This is an automated message from NeuronLabs. Please do not reply.</p>
            </div>
          `,
        });
        strapi.log.info(`✅ Successfully sent email notification to ${notification.user.email}`);
      }
    } catch (error) {
      strapi.log.error('❌ Failed to send email notification:', error);
    }
  },
};
