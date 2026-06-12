'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/models/chat',
      handler: 'custom.chat',
      config: {
        auth: false,
      },
    },
  ],
};
