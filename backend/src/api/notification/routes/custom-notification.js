module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/notifications/send-realtime',
      handler: 'notification.sendRealTime',
      config: {
        auth: false, // Temporarily false for easy testing
      },
    },
  ],
};
