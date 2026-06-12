module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/labs/seed',
      handler: 'lab.seedLabs',
      config: {
        auth: false,
      },
    },
  ],
};
