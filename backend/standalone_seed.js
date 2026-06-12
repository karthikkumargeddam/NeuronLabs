const { createStrapi } = require('@strapi/strapi');
const generateLabs150 = require('./generateLabs150');

createStrapi().load().then(async (app) => {
  console.log("Strapi loaded successfully. Starting standalone massive seed...");
  await generateLabs150(app);
  console.log("Done.");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
