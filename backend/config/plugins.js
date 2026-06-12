"use strict";

module.exports = ({ env }) => ({
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      landingPage: false,
      depthLimit: 7,
      amountLimit: 100,
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: 'strapi-provider-email-selzy',
      providerOptions: {
        apiKey: env('SELZY_API_KEY'),
      },
      settings: {
        defaultFrom: env('SELZY_DEFAULT_FROM', 'hello@neuronlabs.edu'),
        defaultReplyTo: env('SELZY_DEFAULT_REPLY_TO', 'hello@neuronlabs.edu'),
      },
    },
  },
  comments: {
    enabled: true,
    resolve: './node_modules/strapi-plugin-comments'
  },
});
