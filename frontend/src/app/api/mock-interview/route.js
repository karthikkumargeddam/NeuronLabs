import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { code, answer } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        reply: "My advanced model is disconnected. Please add GEMINI_API_KEY to your environment variables to enable the AI Mock Interviewer!" 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-pro for complex technical interviewing
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let prompt = `You are a strict, highly technical senior engineering interviewer conducting a mock interview for a top tech company.\n`;
    prompt += `Keep your responses to 1-2 short, spoken sentences. Act like you are speaking to the candidate out loud.\n`;
    
    if (code) {
      prompt += `\nHere is the code the candidate just wrote:\n\`\`\`\n${code}\n\`\`\`\n`;
    }

    if (!answer) {
      prompt += `\nThis is the start of the interview. Based on their code, ask them a challenging technical question about their implementation, time complexity, or system design.`;
    } else {
      prompt += `\nThe candidate answered: "${answer}"\n\nEvaluate their answer briefly, then follow up with another related technical question to test their depth of knowledge.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Mock Interview Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
