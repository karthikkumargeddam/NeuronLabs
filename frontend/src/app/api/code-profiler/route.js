import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ 
        timeComplexity: "O(1)", 
        spaceComplexity: "O(1)", 
        explanation: "No code provided to analyze." 
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        timeComplexity: "O(Unknown)", 
        spaceComplexity: "O(Unknown)", 
        explanation: "Please add GEMINI_API_KEY to your .env.local file to enable the advanced Big-O Code Analyzer!" 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-pro for accurate code analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let prompt = `You are an expert static code analyzer and Big-O profiler.\n`;
    prompt += `Analyze the following code and return ONLY a strict JSON object with exactly three keys: "timeComplexity", "spaceComplexity", and "explanation".\n`;
    prompt += `Format the complexity like "O(N)" or "O(N log N)". The explanation should be a short 2-3 sentence paragraph explaining your reasoning and suggesting optimizations if applicable.\n\n`;
    prompt += `CODE:\n\`\`\`\n${code}\n\`\`\`\n\n`;
    prompt += `RESPONSE FORMAT (JSON ONLY, NO MARKDOWN TAGS):\n`;
    prompt += `{"timeComplexity": "O(...)", "spaceComplexity": "O(...)", "explanation": "..."}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", text);
      return NextResponse.json({ 
        timeComplexity: "O(?)", 
        spaceComplexity: "O(?)", 
        explanation: "The AI analyzer encountered an error evaluating this code. Try simplifying it." 
      });
    }

  } catch (err) {
    console.error("Code Profiler Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
