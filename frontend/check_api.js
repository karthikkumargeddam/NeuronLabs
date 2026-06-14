const http = require('https');

http.get('https://wise-action-3f2ccfecaa.strapiapp.com/api/sandboxes?pagination[limit]=200', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Sandboxes count:', parsed.data ? parsed.data.length : 'No data array', parsed.error || '');
    } catch(e) {
      console.log('Error parsing response:', e);
    }
  });
}).on('error', err => console.log('HTTP Error:', err.message));

http.get('https://wise-action-3f2ccfecaa.strapiapp.com/api/labs?pagination[limit]=200', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Labs count:', parsed.data ? parsed.data.length : 'No data array', parsed.error || '');
    } catch(e) {
      console.log('Error parsing response:', e);
    }
  });
}).on('error', err => console.log('HTTP Error:', err.message));
