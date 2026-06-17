'use client';

import React from "react";
import VirtualToolbox from "../../../components/VirtualToolbox";

export default function VirtualToolboxSlugPage({ params }) {
  // Use React.use() to unwrap params if this is a Client Component in Next 15, or just use params.slug directly.
  // We'll safely access the slug from params
  const { slug } = params;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Toolbox Header */}
      <header className="bg-[#111] border-b border-[#333] px-6 py-4 flex justify-between items-center flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-sm bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.6)]"></div>
          <h1 className="font-mono text-xl text-gray-200">Practice Sandbox: {slug}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-3 py-1 bg-cyan-500/10 rounded">
            Free Practice Mode
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex p-0 overflow-hidden relative">
        <VirtualToolbox initialTool={slug} />
      </div>
    </div>
  );
}
