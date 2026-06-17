module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/execute-terminal',
      handler: 'terminal.execute',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // We can require auth later, but keeping it open for demo ease or requiring it via config
      },
    },
  ],
};
