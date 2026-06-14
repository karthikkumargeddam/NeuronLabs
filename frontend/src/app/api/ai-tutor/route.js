import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { code, language, error, question } = await request.json();

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. Using fallback mocked response.");
      return NextResponse.json({ 
        reply: "I am currently in Offline/Mock mode because the GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file to activate my advanced AI capabilities!" 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-flash for fast chat responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `You are an expert PhD-level AI programming tutor named 'NeuronLabs Tutor'.\n`;
    prompt += `The user is writing code in ${language || 'Python'}.\n`;
    
    if (code) {
      prompt += `\nHere is their current code:\n\`\`\`${language}\n${code}\n\`\`\`\n`;
    }

    if (error) {
      prompt += `\nThey just encountered this error:\n${error}\n\nPlease help them fix it. Be concise, encouraging, and provide the exact fix.`;
    } else if (question) {
      prompt += `\nThe user asks: "${question}"\n\nPlease answer their question accurately and concisely. Focus on the code they provided if relevant.`;
    } else {
      prompt += `\nPlease greet them and ask how you can help them with their code today.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Tutor Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
