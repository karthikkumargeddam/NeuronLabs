const testCodex = async () => {
  try {
    const res = await fetch('https://api.codex.jaagrav.in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: 'print("Hello from CodeX!")',
        language: 'py'
      })
    });
    const data = await res.json();
    console.log("CodeX Response:", data);
  } catch (err) {
    console.error("CodeX Error:", err);
  }
};
testCodex();
