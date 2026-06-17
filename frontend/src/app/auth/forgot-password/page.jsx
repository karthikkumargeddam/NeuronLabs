"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to process request.");
      }

      toast.success("Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-10"></div>
      
      <div className="w-full max-w-md bg-[#111] border border-[#333] p-8 rounded-2xl shadow-2xl relative z-10 glass-panel">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono text-white mb-2">Password Recovery</h1>
          <p className="text-gray-400 font-mono text-sm">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm font-mono mb-2">Registered Email</label>
            <input
              type="email"
              required
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-indigo-500 font-mono transition-colors"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-[var(--secondary)] text-white font-mono font-bold py-3 px-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm font-mono">
          <Link href="/auth/signin" className="text-gray-300 hover:text-white hover:underline transition-colors">
            &larr; Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
