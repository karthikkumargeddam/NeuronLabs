'use strict';
const Razorpay = require('razorpay');
const crypto = require('crypto');

module.exports = {
  async createOrder(ctx) {
    try {
      const { amount } = ctx.request.body;
      if (!amount) return ctx.badRequest('Amount is required');

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount * 100, // Amount in paise
        currency: "INR",
        receipt: "receipt_order_" + Date.now(),
      };

      const order = await instance.orders.create(options);
      return ctx.send(order);
    } catch (err) {
      console.error(err);
      return ctx.internalServerError('Could not create Razorpay order');
    }
  },

  async verifyPayment(ctx) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_email } = ctx.request.body;
      
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                .update(body.toString())
                                .digest('hex');

      if (expectedSignature === razorpay_signature) {
          const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
              filters: { email: user_email }
          });
          if (users && users.length > 0) {
              await strapi.entityService.update('plugin::users-permissions.user', users[0].id, {
                  data: { isPro: true, paymentStatus: 'verified' }
              });
              return ctx.send({ status: 'success' });
          } else {
              return ctx.badRequest('User not found');
          }
      } else {
          return ctx.badRequest('Invalid signature');
      }
    } catch (err) {
      console.error(err);
      return ctx.internalServerError('Payment verification failed');
    }
  }
};
