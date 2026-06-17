import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { language, code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // Map language identifiers to Judge0 language IDs
    const languageMap = {
      'javascript': 102, // Node.js 22
      'python': 109,     // Python 3.13
      'java': 91,        // Java 17
      'c': 103,          // C GCC 14
      'cpp': 105,        // C++ GCC 14
      'go': 107,         // Go 1.23
      'rust': 108,       // Rust 1.85
      'ruby': 72,        // Ruby 2.7
      'php': 98,         // PHP 8.3
      'csharp': 51,      // C# Mono
      'swift': 83,       // Swift 5.2
      'r': 80            // R 4.0.0
    };

    const languageId = languageMap[language.toLowerCase()];

    if (!languageId) {
      return NextResponse.json({ error: `Language '${language}' is not supported yet.` }, { status: 400 });
    }

    let finalCode = code;
    
    // Automatically capture plots for R
    if (language.toLowerCase() === 'r') {
      finalCode = `
options(device = function() png("neuron_plot.png", width=600, height=400, bg="white"))
${code}
if(names(dev.cur()) != "null device") invisible(dev.off())
if(file.exists("neuron_plot.png") && file.info("neuron_plot.png")$size > 0) {
  b64 <- system("base64 -w 0 neuron_plot.png", intern=TRUE)
  cat(paste0("\\nNEURON_IMAGE:data:image/png;base64,", b64, "\\n"))
}
`;
    }

    // Call Judge0 public free tier API for secure remote code execution
    const judge0Res = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_code: finalCode,
        language_id: languageId
      })
    });

    if (!judge0Res.ok) {
      const errorText = await judge0Res.text();
      return NextResponse.json({ error: `Execution engine error: ${errorText}` }, { status: 500 });
    }

    const data = await judge0Res.json();
    
    // Check for compilation errors
    if (data.compile_output) {
      return NextResponse.json({ output: '', error: data.compile_output });
    }

    // Check for runtime errors
    if (data.stderr) {
      return NextResponse.json({ output: data.stdout || '', error: data.stderr });
    }

    // Return successful execution
    if (data.stdout !== null && data.stdout !== undefined) {
      return NextResponse.json({ output: data.stdout, error: '' });
    }

    // Fallback if status code implies an error but no stderr/compile_output provided (e.g. timeout)
    if (data.status && data.status.id > 3) {
      return NextResponse.json({ output: data.stdout || '', error: `Execution failed: ${data.status.description}` });
    }

    return NextResponse.json({ output: '', error: "Program executed silently with no output" });

  } catch (err) {
    console.error("Execution error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
