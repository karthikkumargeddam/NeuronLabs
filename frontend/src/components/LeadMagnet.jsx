"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { sendGTMEvent } from '@next/third-parties/google';

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API call to save email
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Track Lead Conversion with Google Ads / Analytics
    sendGTMEvent({ event: 'generate_lead', value: email });
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', { 'send_to': 'AW-XXXXXXXXX/lead_magnet' });
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-32 mb-16 relative px-6 z-10 animate-fade-in">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative glass-panel rounded-3xl bg-card-bg/90 border border-cyan-500/30 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex-1 text-left">
          <div className="inline-flex items-center gap-2 text-cyan-500 text-sm font-mono mb-4 bg-cyan-500/10 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span>
            Limited Time Offer
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Claim Your Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">7-Day Premium Sandbox</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-0 max-w-lg">
            Join 15,000+ developers accelerating their careers. Enter your email to get instant access to GPU-accelerated cloud sandboxes and AI Mock Interviews.
          </p>
        </div>

        <div className="w-full md:w-auto">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center bg-green-500/10 border border-green-500/30 rounded-2xl p-6 min-w-[300px]">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="text-green-500 font-bold text-lg mb-1">Access Granted!</h3>
              <p className="text-green-600/80 dark:text-green-400/80 text-sm text-center">Check your inbox for your exclusive login link.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 min-w-[300px] w-full">
              <input 
                type="email" 
                placeholder="developer@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-background border border-card-border focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-foreground transition-all shadow-inner"
              />
              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-5 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {status === "loading" ? "Securing Access..." : "Get Free Access"}
                {status !== "loading" && <Send className="w-4 h-4" />}
              </button>
              <p className="text-xs text-center text-gray-500 mt-2">No credit card required. Cancel anytime.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
