'use strict';

const crypto = require('crypto');
const axios = require('axios');

module.exports = {
  async initiate(ctx) {
    try {
      const { amount, userId, courseId, redirectUrl } = ctx.request.body;

      const merchantId = process.env.PHONEPE_MERCHANT_ID;
      const saltKey = process.env.PHONEPE_SALT_KEY;
      const saltIndex = process.env.PHONEPE_SALT_INDEX;
      const phonepeEnv = process.env.PHONEPE_ENV;

      const merchantTransactionId = `T${Date.now()}`;

      // Payload for PhonePe
      const data = {
        merchantId: merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userId || 'U12345',
        amount: amount * 100, // PhonePe expects amount in paise (1 INR = 100 paise)
        redirectUrl: redirectUrl || 'http://localhost:3000/payment/success',
        redirectMode: 'POST',
        callbackUrl: 'http://localhost:1337/api/payment/callback',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const payload = Buffer.from(JSON.stringify(data)).toString('base64');
      const stringToHash = payload + '/pg/v1/pay' + saltKey;
      const checksum = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + saltIndex;

      const phonePeHost = phonepeEnv === 'UAT' 
        ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
        : 'https://api.phonepe.com/apis/hermes';

      const response = await axios.post(`${phonePeHost}/pg/v1/pay`, { request: payload }, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': merchantId
        }
      });

      return ctx.send(response.data);

    } catch (error) {
      const phonePeError = error.response ? error.response.data : error.message;
      console.error('PhonePe Initiate Error:', phonePeError);
      return ctx.badRequest('Payment initiation failed', { details: phonePeError });
    }
  },

  async callback(ctx) {
    try {
      // PhonePe sends the transaction status in a base64 encoded response object
      const { response } = ctx.request.body;
      const xVerify = ctx.request.headers['x-verify'];

      const saltKey = process.env.PHONEPE_SALT_KEY;
      const saltIndex = process.env.PHONEPE_SALT_INDEX;

      // Security: Verify the checksum to ensure the webhook actually came from PhonePe
      const stringToHash = response + saltKey;
      const checksum = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + saltIndex;

      if (checksum !== xVerify) {
        return ctx.badRequest('Invalid signature');
      }

      const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString('utf-8'));

      if (decodedResponse.code === 'PAYMENT_SUCCESS') {
        // [STUDENT ACCESS LOGIC HERE]
        // Example: strapi.entityService.update('api::order.order', orderId, { data: { status: 'Success' } });
        
        // [WHATSAPP NOTIFICATION LOGIC HERE]
        console.log('🎉 Payment Successful! Triggering WhatsApp & Email...', decodedResponse);
        
        return ctx.send({ status: 'success' });
      } else {
        console.log('❌ Payment Failed!', decodedResponse);
        return ctx.send({ status: 'failed' });
      }

    } catch (error) {
      console.error('PhonePe Callback Error:', error);
      return ctx.badRequest('Callback processing failed');
    }
  },

  async verify(ctx) {
    try {
      const { transactionId, userId, amount } = ctx.request.body;

      if (!transactionId || !userId) {
        return ctx.badRequest('Missing transactionId or userId');
      }

      // 1. Strict Validation: exactly 12 numeric digits
      const utrRegex = /^\d{12}$/;
      if (!utrRegex.test(transactionId)) {
        return ctx.badRequest('Invalid UTR format. Must be exactly 12 digits.');
      }

      // 1.5. Prevent Duplicate UTRs across the entire system
      const existingTransactions = await strapi.entityService.findMany('api::transaction.transaction', {
        filters: { utr: transactionId },
        limit: 1
      });

      if (existingTransactions && existingTransactions.length > 0) {
        return ctx.badRequest('This UTR number has already been used.');
      }

      // Fetch user to ensure they exist and get their email
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId);
      if (!user) {
        return ctx.notFound('User not found');
      }

      // Create permanent transaction record
      await strapi.entityService.create('api::transaction.transaction', {
        data: {
          utr: transactionId,
          amount: amount,
          status: 'pending',
          user: userId
        }
      });

      // 2. Set to PENDING instead of granting Pro instantly
      await strapi.entityService.update('plugin::users-permissions.user', userId, {
        data: {
          paymentStatus: 'pending',
          upiTransactionId: transactionId,
        },
      });

      // 3. Send email to Admin
      if (process.env.SELZY_API_KEY) {
        try {
          await strapi.plugin('email').service('email').send({
            to: 'hello@neuronlabs.edu', // Admin Email (change this later in dashboard or env)
            subject: 'ACTION REQUIRED: New UTR Payment Verification',
            text: `User ${user.email} (${user.username}) claims they paid ₹${amount} using UTR: ${transactionId}. Please check your bank app and manually approve them in the Strapi Dashboard.`,
            html: `
              <h2>Action Required: Payment Verification</h2>
              <p><strong>User:</strong> ${user.email} (${user.username})</p>
              <p><strong>Claimed Amount:</strong> ₹${amount}</p>
              <p><strong>Provided UTR:</strong> <span style="font-size:1.2em; font-weight:bold; color:red;">${transactionId}</span></p>
              <hr/>
              <p>Please open your bank app to verify you received this exact UTR. If yes, go to the Strapi Admin Dashboard > Users > edit this user and toggle <strong>isPro</strong> to true, and set paymentStatus to 'verified'.</p>
            `,
          });
          console.log(`Admin alert email sent successfully for UTR: ${transactionId}`);
        } catch (emailError) {
          console.error('Failed to send admin alert email:', emailError);
        }
      }

      // 4. Send Telegram to Admin via Telegram Bot API
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      let backendUrl = process.env.PUBLIC_BACKEND_URL || 'http://127.0.0.1.nip.io:1337';
      
      // Telegram strictly rejects "localhost" in inline button URLs. 
      // If the env variable is still cached as localhost, force it to nip.io
      if (backendUrl.includes('localhost')) {
        backendUrl = backendUrl.replace('localhost', '127.0.0.1.nip.io');
      }

      if (telegramToken && telegramChatId) {
        try {
          const escapeHtml = (text) => {
            if (!text) return '';
            return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          };
          
          const safeEmail = escapeHtml(user.email);
          const safeUsername = escapeHtml(user.username);
          
          const textMsg = `🚨 <b>New Payment Verification</b>\n\n<b>User:</b> ${safeEmail} (${safeUsername})\n<b>Amount:</b> ₹${amount}\n<b>UTR:</b> <code>${transactionId}</code>`;
          
          const replyMarkup = {
            inline_keyboard: [
              [
                { text: "✅ Approve", url: `${backendUrl}/api/payment/admin-action?tx=${transactionId}&action=approve` },
                { text: "❌ Reject", url: `${backendUrl}/api/payment/admin-action?tx=${transactionId}&action=reject` }
              ]
            ]
          };

          await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            chat_id: telegramChatId,
            text: textMsg,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
          });
          
          console.log(`Admin Telegram notification sent successfully for UTR: ${transactionId}`);
        } catch (tgError) {
          console.error('Failed to send admin Telegram notification:', tgError.response ? tgError.response.data : tgError.message);
        }
      } else {
        console.log('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not found in env. Skipping Telegram notification.');
      }

      return ctx.send({ success: true, message: 'Payment verification requested. Pending admin approval.' });
    } catch (error) {
      console.error('Verify Payment Error:', error);
      return ctx.internalServerError('Failed to process payment verification');
    }
  },

  async razorpayWebhook(ctx) {
    try {
      const signature = ctx.request.headers['x-razorpay-signature'];
      const body = ctx.request.body;
      const rawBody = ctx.request.rawBody || JSON.stringify(body); // Ensure we have raw string for crypto
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

      // 1. Signature Verification (Only if secret is provided in .env)
      if (secret && signature) {
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(rawBody)
          .digest('hex');

        if (expectedSignature !== signature) {
          console.error('Razorpay Webhook: Invalid Signature');
          return ctx.badRequest('Invalid signature');
        }
      } else {
        console.warn('Razorpay Webhook: RAZORPAY_WEBHOOK_SECRET is not set. Bypassing signature verification for now.');
      }

      // 2. Process the payload
      const event = body.event;
      
      // We are looking for successful payments or order completions
      if (event === 'payment.captured' || event === 'payment_link.paid' || event === 'order.paid') {
        const paymentEntity = body.payload?.payment?.entity;
        const email = paymentEntity?.email;
        const transactionId = paymentEntity?.id;
        const amount = (paymentEntity?.amount || 0) / 100; // Convert paise to INR

        if (!email) {
          console.log(`Razorpay Webhook: Success but no email found in payload. Transaction: ${transactionId}`);
          return ctx.send({ status: 'ok', note: 'No email found' });
        }

        // 3. Find user by email
        const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
          filters: { email: email },
          limit: 1
        });

        if (users && users.length > 0) {
          const user = users[0];

          // 4. Upgrade user to Pro
          const validUntil = new Date();
          validUntil.setMonth(validUntil.getMonth() + 1);

          await strapi.entityService.update('plugin::users-permissions.user', user.id, {
            data: {
              isPro: true,
              proValidFrom: new Date().toISOString(),
              proValidUntil: validUntil.toISOString(),
              upiTransactionId: transactionId,
            },
          });

          await strapi.entityService.create('api::subscription.subscription', {
            data: {
              planName: 'Pro Member',
              status: 'active',
              startDate: new Date().toISOString(),
              endDate: validUntil.toISOString(),
              user: user.id
            }
          });

          console.log(`🎉 Razorpay Webhook: User ${user.email} upgraded to Pro! (Txn: ${transactionId})`);

          // 5. Send Welcome Email
          try {
            await strapi.plugin('email').service('email').send({
              to: user.email,
              subject: 'Welcome to NeuronLabs Pro!',
              text: `Hello ${user.username},\n\nThank you for your payment of ₹${amount}. Your Razorpay transaction ID ${transactionId} has been recorded.\n\nYour account has been successfully upgraded to the Pro plan!\n\nBest regards,\nThe NeuronLabs Team`,
              html: `<p>Hello ${user.username},</p><p>Thank you for your payment of ₹${amount}. Your Razorpay transaction ID <strong>${transactionId}</strong> has been recorded.</p><p>Your account has been successfully upgraded to the <strong>Pro plan</strong>!</p><br/><p>Best regards,<br/>The NeuronLabs Team</p>`,
            });
            console.log(`Email sent successfully to ${user.email}`);
          } catch (emailError) {
            console.error('Failed to send email:', emailError);
          }
        } else {
          console.log(`Razorpay Webhook: Payment successful, but no user found with email ${email}`);
        }
      }

      // Always return 200 OK so Razorpay doesn't retry
      return ctx.send({ status: 'success' });
    } catch (error) {
      console.error('Razorpay Webhook Error:', error);
      return ctx.internalServerError('Failed to process webhook');
    }
  },

  async adminAction(ctx) {
    try {
      const { tx, action } = ctx.request.query;

      if (!tx || !action) {
        return ctx.badRequest('Missing transaction ID or action');
      }

      // Find transaction by UTR
      const transactions = await strapi.entityService.findMany('api::transaction.transaction', {
        filters: { utr: tx },
        populate: ['user'],
        limit: 1
      });

      if (!transactions || transactions.length === 0) {
        return ctx.notFound('No transaction found with that UTR.');
      }

      const transaction = transactions[0];
      const user = transaction.user;

      if (!user) {
        return ctx.badRequest('Transaction exists but no user is linked to it.');
      }

      if (transaction.status === 'verified' || transaction.status === 'rejected') {
        return ctx.send(`<h1>Already Processed</h1><p>This transaction has already been <b>${transaction.status}</b>.</p>`);
      }

      if (action === 'approve') {
        // Update transaction status
        await strapi.entityService.update('api::transaction.transaction', transaction.id, {
          data: { status: 'verified' }
        });

        const validUntil = new Date();
        validUntil.setMonth(validUntil.getMonth() + 1);

        // Update user
        await strapi.entityService.update('plugin::users-permissions.user', user.id, {
          data: {
            isPro: true,
            proValidFrom: new Date().toISOString(),
            proValidUntil: validUntil.toISOString(),
            paymentStatus: 'verified',
            upiTransactionId: tx
          },
        });

        await strapi.entityService.create('api::subscription.subscription', {
          data: {
            planName: 'Pro Member',
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: validUntil.toISOString(),
            user: user.id,
            transaction: transaction.id
          }
        });
        
        // Emit Socket event to the user's room
        if (strapi.io) {
          strapi.io.to(`user_${user.id}`).emit('payment_status_update', {
            transactionId: tx,
            status: 'approved'
          });
        }
        
        return ctx.send(`<h1>Payment Approved</h1><p>User ${user.username} has been upgraded to Pro.</p>`);
      } else if (action === 'reject') {
        // Update transaction status
        await strapi.entityService.update('api::transaction.transaction', transaction.id, {
          data: { status: 'rejected' }
        });

        // Update user (if pending or if you want to reset their status)
        await strapi.entityService.update('plugin::users-permissions.user', user.id, {
          data: {
            paymentStatus: 'rejected',
          },
        });

        // Emit Socket event to the user's room
        if (strapi.io) {
          strapi.io.to(`user_${user.id}`).emit('payment_status_update', {
            transactionId: tx,
            status: 'rejected'
          });
        }

        return ctx.send(`<h1>Payment Rejected</h1><p>User ${user.username}'s transaction has been rejected.</p>`);
      } else {
        return ctx.badRequest('Invalid action');
      }
    } catch (error) {
      console.error('Admin Action Error:', error);
      return ctx.internalServerError('Failed to process admin action');
    }
  }
};
