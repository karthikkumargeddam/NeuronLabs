"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user?.name) {
      setUsername(session.user.name);
    }
  }, [status, router, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-b-2 border-[var(--secondary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!username.trim() || username === session.user.name) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/users/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({
          username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Failed to update profile");
      }

      // Update the NextAuth session so the UI reflects the change immediately
      await update({ name: username });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center p-6 pt-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--secondary)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl relative z-10 space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-[#111] border border-[#333] p-8 rounded-2xl shadow-2xl glass-panel">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--secondary)] to-[var(--accent)] flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] border-2 border-[#222]">
            {session.user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-mono text-white flex items-center justify-center md:justify-start gap-3">
              {session.user.name}
              {session.user.isPro && (
                <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-xs font-bold rounded shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  PRO
                </span>
              )}
            </h1>
            <p className="text-gray-400 font-mono text-sm mt-1">{session.user.email}</p>
          </div>
          <div className="text-center">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="px-6 py-2 border border-red-500/50 text-red-400 font-mono text-sm rounded hover:bg-red-500/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Subscription details */}
        <div className="bg-[#111] border border-[#333] p-8 rounded-2xl shadow-2xl glass-panel relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${session.user.isPro ? 'bg-amber-400' : 'bg-[#444]'}`}></div>
          <h2 className="text-xl font-mono text-white mb-6 pl-4 border-b border-[#333] pb-4">Subscription Status</h2>
          
          <div className="pl-4">
            {session.user.isPro ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-amber-500/20 flex items-center justify-center border border-amber-500/50">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-mono font-bold">NeuronLabs Pro</h3>
                    <p className="text-emerald-400 text-xs font-mono">Active</p>
                  </div>
                </div>
                {session.user.proValidUntil && (
                  <div className="pt-4 border-t border-[#222]">
                    <p className="text-gray-400 font-mono text-sm">Valid until: <span className="text-white">{new Date(session.user.proValidUntil).toLocaleDateString()}</span></p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-mono font-bold">Free Tier</h3>
                  <p className="text-gray-400 text-sm font-mono mt-1">Limited lab access.</p>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] text-white font-mono font-bold rounded shadow-lg shadow-[var(--secondary)]/20 hover:opacity-90 transition-opacity">
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings form */}
        <div className="bg-[#111] border border-[#333] p-8 rounded-2xl shadow-2xl glass-panel">
          <h2 className="text-xl font-mono text-white mb-6 border-b border-[#333] pb-4">Account Settings</h2>
          
          <form onSubmit={handleUpdate} className="space-y-5 max-w-md">
            <div>
              <label className="block text-gray-400 text-sm font-mono mb-2">Display Name</label>
              <input
                type="text"
                required
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--secondary)] font-mono transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || username === session.user.name}
              className="px-6 py-2 bg-white text-black font-mono font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
