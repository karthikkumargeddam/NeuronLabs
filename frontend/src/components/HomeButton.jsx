"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomeButton() {
  const pathname = usePathname();

  // Hide on the home page
  if (pathname === "/") return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <Link href="/">
        <button className="bg-[#111] border border-[#333] px-4 py-2 text-sm font-mono text-gray-300 hover:text-white hover:border-[var(--secondary)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all rounded-full flex items-center gap-2 backdrop-blur-md">
          <span>🏠</span> Home
        </button>
      </Link>
    </div>
  );
}
