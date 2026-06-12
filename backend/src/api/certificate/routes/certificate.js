module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/certificates/generate',
      handler: 'certificate.generate',
      config: {
        auth: false, // Set to true if only authenticated users can generate certificates
      },
    },
  ],
};
