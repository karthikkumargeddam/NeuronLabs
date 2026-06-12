"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function GlobalNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800/60 flex flex-col shadow-xl">
      <div className="px-8 py-3 flex items-center justify-between">
        {/* Left side: Home / Brand */}
        <div>
          <Link href="/">
            <div className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-sm">
                N
              </div>
              NeuronLabs
            </div>
          </Link>
        </div>

        {/* Right side: Auth */}
        <div>
          {session ? (
            <div className="flex items-center gap-4">
              <div className="text-sm font-mono text-[var(--secondary)] hidden sm:flex items-center">
                {session.user?.name} ({session.user?.role || "Student"})
                {session.user?.isPro && (
                  <span className="ml-2 inline-flex items-center justify-center bg-amber-500/20 text-amber-400 p-1 rounded-full border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]" title="Pro Member">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  </span>
                )}
              </div>
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors border border-transparent hover:border-cyan-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                <span className="text-sm font-mono hidden md:block">Dashboard</span>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 text-sm font-mono text-red-400 hover:text-red-300 border border-red-900/50 hover:border-red-500 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all rounded-full flex items-center gap-2"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {pathname !== "/auth/signin" && (
                <Link href="/auth/signin">
                  <button className="text-sm font-mono text-gray-300 hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
              )}
              {pathname !== "/auth/signup" && (
                <Link href="/auth/signup">
                  <button className="px-4 py-2 text-sm font-mono text-black bg-[var(--secondary)] hover:bg-opacity-90 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all rounded-full flex items-center gap-2 font-bold">
                    Sign Up
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Navigation Links */}
      <div className="w-full border-t border-gray-800/40 bg-[#050505]/50">
        <div className="px-8 py-3 overflow-x-auto hide-scrollbar flex justify-center">
          <nav className="flex gap-4 md:gap-6 lg:gap-8 text-sm font-semibold tracking-wide items-center whitespace-nowrap">
            <Link href="/courses" className="text-gray-300 hover:text-cyan-400 transition-colors">Courses</Link>
            <Link href="/datasets" className="text-gray-300 hover:text-cyan-400 transition-colors">Datasets</Link>
            <Link href="/playground" className="text-gray-300 hover:text-rose-400 transition-colors">Playground</Link>
            <Link href="/code-editor" className="text-gray-300 hover:text-purple-400 transition-colors">Code Editor</Link>
            <Link href="/labs" className="text-gray-300 hover:text-fuchsia-400 transition-colors">Labs</Link>
            <Link href="/sandbox" className="text-gray-300 hover:text-emerald-400 transition-colors">Sandbox</Link>
            <Link href="/virtual-box" className="text-gray-300 hover:text-blue-400 transition-colors">Virtual Box</Link>
            <Link href="/builder" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
              Builder <span className="relative flex h-2 w-2 ml-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span>
            </Link>
            <Link href="/community" className="text-gray-300 hover:text-cyan-400 transition-colors">Community</Link>
            <Link href="/arena" className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
              Arena
            </Link>
            <Link href="/leaderboard" className="text-amber-400 hover:text-amber-300 transition-colors">Leaderboard</Link>
            <Link href="/careers" className="text-purple-400 hover:text-purple-300 transition-colors">Careers</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
