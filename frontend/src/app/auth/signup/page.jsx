"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/auth/local/register`, {
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
        const errorMessage = data?.error?.message || "Registration failed.";
        if (errorMessage.toLowerCase().includes("taken")) {
            throw new Error("This Username or Email is already taken. Please choose a different one.");
        }
        throw new Error(errorMessage);
      }

      toast.success("Account created successfully!");

      // Automatically sign in after successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        identifier: email,
        password,
        callbackUrl: "/",
      });

      if (signInRes?.error) {
        toast.error("Registered successfully, but auto-login failed.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      toast.error(err.message);
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

        <div className="mt-6 flex items-center justify-center space-x-2">
          <div className="h-px bg-[#333] flex-grow"></div>
          <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">or</span>
          <div className="h-px bg-[#333] flex-grow"></div>
        </div>

        <button
          onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/connect/google`}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 px-4 rounded hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          Continue with Google
        </button>

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
