"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!code) {
      toast.error("Invalid or missing reset code. Please request a new password reset link.");
    }
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) return;

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success("Password Reset Successfully!");
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        toast.error(data?.error?.message || "Failed to reset password. The link might have expired.");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[128px] opacity-10"></div>
      
      <div className="w-full max-w-md bg-[#111] border border-[#333] p-8 rounded-2xl shadow-2xl relative z-10 glass-panel">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono text-white mb-2">Create New Password</h1>
          <p className="text-gray-400 font-mono text-sm">Enter your new secure password.</p>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-white font-bold font-mono text-xl mb-2">Password Reset!</h2>
            <p className="text-gray-400 font-mono text-sm mb-6">Redirecting you to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-gray-400 text-sm font-mono mb-2">New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--secondary)] font-mono transition-colors"
                placeholder="••••••••"
                required
                disabled={!code || success}
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-mono mb-2">Confirm New Password</label>
              <input 
                type="password" 
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--secondary)] font-mono transition-colors"
                placeholder="••••••••"
                required
                disabled={!code || success}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !code || success}
              className="w-full bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white font-mono font-bold py-3 px-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center text-gray-400 text-sm font-mono">
          <Link href="/auth/signin" className="text-[var(--secondary)] hover:text-white transition-colors">
            &larr; Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-b-2 border-[var(--secondary)] rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
