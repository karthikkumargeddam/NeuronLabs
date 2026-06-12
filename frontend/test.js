const qs = require('qs');
fetch('http://127.0.0.1:1337/api/courses?' + qs.stringify({ filters: { $or: [{ uuid: { $eq: 'data-analyst-bootcamp' } }, { documentId: { $eq: 'data-analyst-bootcamp' } }] }, populate: '*' }))
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
