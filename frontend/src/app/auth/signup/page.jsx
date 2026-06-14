"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}`}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Registration failed.");
      }

      // Automatically sign in after successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        identifier: email,
        password,
        callbackUrl: "/",
      });

      if (signInRes?.error) {
        setError("Registered successfully, but auto-login failed.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob"></div>
      
      <div className="w-full max-w-md bg-[#111] border border-[#333] p-8 rounded-2xl shadow-2xl relative z-10 glass-panel">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono text-white mb-2">Create Account</h1>
          <p className="text-gray-400 font-mono text-sm">Register a new researcher profile.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-6 text-sm font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm font-mono mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--secondary)] font-mono transition-colors"
              placeholder="quantum_ninja"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-mono mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--secondary)] font-mono transition-colors"
              placeholder="user@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-mono mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--secondary)] font-mono transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[var(--accent)] to-purple-600 text-white font-mono font-bold py-3 px-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm font-mono">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-[var(--secondary)] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
