const strapiFactory = require('@strapi/strapi');

async function fixDates() {
  const app = await strapiFactory().load();
  
  const users = await app.entityService.findMany('plugin::users-permissions.user', {
    filters: { isPro: true },
  });

  console.log(`Found ${users.length} Pro users.`);

  for (const user of users) {
    if (!user.proValidFrom) {
      console.log(`Fixing user ${user.username} - missing proValidFrom`);
      const validFrom = new Date(user.updatedAt || Date.now());
      
      const validUntil = new Date(validFrom);
      validUntil.setMonth(validUntil.getMonth() + 1);

      await app.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          proValidFrom: validFrom.toISOString(),
          proValidUntil: validUntil.toISOString()
        }
      });
      console.log(`Updated user ${user.username} to validFrom: ${validFrom.toISOString()}`);
    }
  }
  console.log('Done');
  process.exit(0);
}

fixDates().catch(err => {
  console.error(err);
  process.exit(1);
});
