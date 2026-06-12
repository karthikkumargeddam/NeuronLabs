async function run() {
  try {
    const res = await fetch('http://127.0.0.1:1337/api/feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { rating: 5, message: 'Test feedback!' } })
    });
    console.log(res.status, res.statusText);
    const text = await res.text();
    console.log(text);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}
run();
