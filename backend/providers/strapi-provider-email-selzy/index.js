'use strict';
const axios = require('axios');

module.exports = {
  init(providerOptions = {}, settings = {}) {
    return {
      async send(options) {
        const {
          from = settings.defaultFrom,
          replyTo = settings.defaultReplyTo,
          fromName = settings.defaultFromName || 'NeuronLabs',
          to,
          cc,
          bcc,
          subject,
          text,
          html,
          ...rest
        } = options;

        const data = new URLSearchParams();
        data.append('api_key', providerOptions.apiKey);
        data.append('email', to);
        data.append('sender_email', from);
        data.append('sender_name', fromName);
        data.append('subject', subject);
        if (html) {
          data.append('body', html);
        } else if (text) {
          data.append('body', text);
        }
        data.append('format', 'json');

        try {
          const response = await axios.post('https://api.selzy.com/en/api/sendEmail', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          
          if (response.data.error) {
            throw new Error(`Selzy API Error: ${response.data.error}`);
          }
        } catch (error) {
          console.error('Error sending email via Selzy:', error.response?.data || error.message);
          throw error;
        }
      },
    };
  },
};
