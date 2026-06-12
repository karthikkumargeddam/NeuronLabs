const strapi = require('@strapi/strapi');

async function test() {
  const app = await strapi().load();
  const users = await app.entityService.findMany('plugin::users-permissions.user', {
    populate: '*'
  });
  console.log("Users in DB:", users.map(u => ({
    id: u.id,
    email: u.email,
    upiTransactionId: u.upiTransactionId,
    paymentStatus: u.paymentStatus,
    isPro: u.isPro
  })));
  process.exit(0);
}

test();
