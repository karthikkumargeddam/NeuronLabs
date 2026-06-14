fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    source_code: 'print("hello python from judge0")',
    language_id: 71 // Python 3
  })
}).then(r => r.json()).then(console.log).catch(console.error);
