"use client";
import React, { useState } from "react";
import { PlayCircle, ArrowLeft, Mic, User, Code, Share2 } from "lucide-react";
import dynamic from "next/dynamic";

const WebGLDemoCanvas = dynamic(() => import("./WebGLDemoCanvas"), {
  ssr: false,
  loading: () => <div className="text-cyan-400 font-mono animate-pulse">Initializing WebGL Context...</div>
});

export default function FeatureDemoViewer({ mockData, slug }) {
  const [isLaunched, setIsLaunched] = useState(false);

  if (isLaunched) {
    return (
      <div className="w-full min-h-[70vh] rounded-3xl border border-gray-800 bg-[#0a0a0a] shadow-2xl overflow-hidden relative flex flex-col mt-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setIsLaunched(false)}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm font-mono text-gray-400">{mockData.title} - Live Session</div>
          <div className="w-16"></div>
        </div>

        {/* Demo Content */}
        <div className="flex-1 relative bg-black flex items-center justify-center p-8">
          
          {slug === '3d-webgl-labs' && (
            <div className="w-full h-full min-h-[500px] relative flex items-center justify-center p-4">
              <WebGLDemoCanvas />
            </div>
          )}

          {slug === 'ai-mock-interviews' && (
            <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 rounded-full bg-cyan-900/50 flex items-center justify-center mb-8 relative border-2 border-cyan-400">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-50"></div>
                <User className="w-16 h-16 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">AI Recruiter is listening...</h2>
              <p className="text-cyan-400 text-xl font-mono mb-12">"Can you explain the difference between a process and a thread?"</p>
              
              {/* Fake Audio Visualizer */}
              <div className="flex items-center gap-2 mb-12 h-16">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-2 bg-cyan-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              
              <div className="flex gap-6">
                <button className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 border border-red-500 flex items-center justify-center hover:bg-red-500/40 transition-colors">
                  <Mic className="w-6 h-6" />
                </button>
                <button className="bg-cyan-600 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  Submit Answer
                </button>
              </div>
            </div>
          )}

          {slug === 'multiplayer-sync' && (
            <div className="w-full h-full min-h-[500px] flex flex-col">
              <div className="flex justify-end p-4 gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">A</div>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">B</div>
                <button className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Share2 className="w-4 h-4"/> Share</button>
              </div>
              <div className="flex-1 bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm text-gray-300 relative border border-gray-700">
                <p><span className="text-blue-400">function</span> <span className="text-yellow-200">calculateTotal</span>(items) {'{'}</p>
                <p className="ml-4"><span className="text-blue-400">let</span> total = <span className="text-green-400">0</span>;</p>
                <p className="ml-4">items.<span className="text-yellow-200">forEach</span>(item =&gt; {'{'}</p>
                
                {/* Fake cursors */}
                <p className="ml-8 relative">
                  total += item.price;
                  <span className="absolute -top-3 -right-2 text-pink-500 animate-bounce">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.5z"/></svg>
                    <span className="bg-pink-500 text-white text-[10px] px-1 rounded ml-1">Alice</span>
                  </span>
                </p>
                
                <p className="ml-4">{'}'});</p>
                <p className="ml-4 relative">
                  <span className="text-blue-400">return</span> total;
                  <span className="absolute top-1 left-28 text-blue-500 animate-pulse">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2.9-3.2-7.4-4.4 4.5z"/></svg>
                    <span className="bg-blue-500 text-white text-[10px] px-1 rounded ml-1">Bob</span>
                  </span>
                </p>
                <p>{'}'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-3xl border ${mockData.border} bg-gradient-to-br ${mockData.gradient} p-8 md:p-16 relative overflow-hidden backdrop-blur-sm shadow-2xl`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="mb-6 inline-flex p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-xl">
            {mockData.icon}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            {mockData.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
            {mockData.description}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {mockData.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-200">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                <span className="font-medium">{highlight}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setIsLaunched(true)}
            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
          >
            <PlayCircle className="w-5 h-5" /> Launch Demo (Pro Unlocked)
          </button>
        </div>
        
        <div className="flex-1 w-full aspect-square md:aspect-[4/3] rounded-2xl bg-black/60 border border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center group cursor-pointer" onClick={() => setIsLaunched(true)}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          {/* Custom thumbnail representation based on feature */}
          {slug === '3d-webgl-labs' && (
            <div className="w-32 h-32 border-4 border-indigo-500/50 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <div className="w-16 h-16 border-4 border-cyan-400/80 rounded-full"></div>
            </div>
          )}
          {slug === 'ai-mock-interviews' && (
            <div className="flex gap-2 items-center">
               {[1,2,3,4,5].map(i => <div key={i} className="w-3 bg-cyan-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 60 + 20}px` }}></div>)}
            </div>
          )}
          {slug === 'multiplayer-sync' && (
             <div className="text-green-400 font-mono text-xl">&lt;Syncing... /&gt;</div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <PlayCircle className="w-20 h-20 text-white/90 scale-90 group-hover:scale-110 transition-all duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
