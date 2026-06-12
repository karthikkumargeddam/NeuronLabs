"use client";

import { useState } from "react";

export default function CertificatePage() {
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("Advanced PyTorch Sandbox");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!studentName) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:1337/api/certificates/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName,
          courseName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate certificate");
      }

      // Create a blob from the PDF stream
      const blob = await response.blob();
      // Create a link element, hide it, direct it towards the blob, and then 'click' it programmatically
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${studentName.replace(/\\s+/g, '_')}_Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error generating certificate. Did you enable Public permissions in Strapi?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-16 max-w-4xl mx-auto flex items-center justify-center animate-fade-in">
      <div className="w-full glass-panel p-10 rounded-3xl border border-gray-800/80 bg-[#0a0a0a]/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 mix-blend-overlay filter blur-[100px] opacity-20"></div>
        
        <h1 className="text-4xl font-black mb-2 text-white">Claim Your Certificate</h1>
        <p className="text-gray-400 mb-8">Enter your details below to generate your official completion certificate.</p>
        
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-mono text-cyan-400 mb-2 uppercase tracking-wider">Your Full Name</label>
            <input 
              type="text" 
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-[#111] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-mono text-cyan-400 mb-2 uppercase tracking-wider">Course Completed</label>
            <select 
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="Advanced PyTorch Sandbox">Advanced PyTorch Sandbox</option>
              <option value="Distributed GPU Training">Distributed GPU Training</option>
              <option value="LLM Fine-Tuning Mastery">LLM Fine-Tuning Mastery</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !studentName}
            className="w-full py-4 mt-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-3"
          >
            {loading ? (
              <span className="animate-pulse">Generating PDF...</span>
            ) : (
              <>
                Download PDF Certificate
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
