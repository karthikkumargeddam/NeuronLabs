"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function AuthGuard({ children }) {
  const { status } = useSession();
  const pathname = usePathname();
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" && !pathname?.startsWith("/auth/")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [status, pathname]);

  // Allow access to auth pages without popping up another auth modal
  if (pathname?.startsWith("/auth/")) {
    return children;
  }

  const isUnauthenticated = status === "unauthenticated";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("SignIn error:", err);
      setError("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`transition-all duration-500 flex-grow flex flex-col ${isUnauthenticated ? 'blur-md pointer-events-none select-none h-screen overflow-hidden' : ''}`}>
        {children}
      </div>

      {isUnauthenticated && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto">
          <div className="w-full max-w-md bg-[#111] border border-[#333] p-8 rounded-2xl shadow-2xl relative glass-panel animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-mono text-white mb-2">Initialize Session</h1>
              <p className="text-gray-400 font-mono text-sm">Authentication required to access content.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-6 text-sm font-mono text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm font-mono mb-2">Username or Email</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--secondary)] font-mono transition-colors pointer-events-auto"
                  placeholder="user@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-400 text-sm font-mono">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-[var(--secondary)] hover:underline font-mono pointer-events-auto">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--secondary)] font-mono transition-colors pointer-events-auto"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white font-mono font-bold py-3 px-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer pointer-events-auto"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm font-mono pointer-events-auto">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-[var(--accent)] hover:underline pointer-events-auto">
                Register here
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
