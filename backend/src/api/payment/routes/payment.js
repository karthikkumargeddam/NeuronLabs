module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment/initiate',
      handler: 'payment.initiate',
      config: {
        auth: false, // Change to true if users must be logged in to pay
      },
    },
    {
      method: 'POST',
      path: '/payment/callback',
      handler: 'payment.callback',
      config: {
        auth: false, // Must be false so PhonePe can ping it
      },
    },
    {
      method: 'POST',
      path: '/payment/verify',
      handler: 'payment.verify',
      config: {
        auth: false, // We will manually verify or we can use false and pass userId
      },
    },
    {
      method: 'POST',
      path: '/payment/razorpay-webhook',
      handler: 'payment.razorpayWebhook',
      config: {
        auth: false, // Webhooks from Razorpay don't have JWT auth
      },
    },
    {
      method: 'GET',
      path: '/payment/admin-action',
      handler: 'payment.adminAction',
      config: {
        auth: false,
      },
    },
  ],
};
