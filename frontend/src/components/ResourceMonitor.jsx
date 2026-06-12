"use client";

import React, { useState, useEffect } from "react";
import { Activity, Cpu, Server, Database } from "lucide-react";

export default function ResourceMonitor() {
  const [metrics, setMetrics] = useState({
    gpu: 42,
    ram: 68,
    cpu: 25,
    network: 15,
  });

  useEffect(() => {
    // Simulate real-time metrics update
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        gpu: Math.min(100, Math.max(0, prev.gpu + (Math.random() * 10 - 5))),
        ram: Math.min(100, Math.max(0, prev.ram + (Math.random() * 4 - 2))),
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 20 - 10))),
        network: Math.min(100, Math.max(0, prev.network + (Math.random() * 30 - 15))),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const CircularProgress = ({ value, color, label, icon: Icon }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-24 h-24 mb-3">
          <svg className="transform -rotate-90 w-24 h-24">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-neutral-800"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${color} transition-all duration-1000 ease-out`}
              style={{ filter: `drop-shadow(0 0 6px ${color === 'text-cyan-400' ? '#22d3ee' : color === 'text-purple-500' ? '#a855f7' : color === 'text-amber-400' ? '#fbbf24' : '#4ade80'})` }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-white">
            <span className="text-lg font-bold">{Math.round(value)}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-400 text-sm font-medium">
          <Icon className="w-4 h-4" />
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
      {/* Background glow effects */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="w-6 h-6 text-cyan-400" />
              Live Resource Monitor
            </h2>
            <p className="text-neutral-400 text-sm mt-1">Real-time metrics across your active Virtual Boxes.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-400 text-sm font-mono tracking-widest uppercase">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <CircularProgress value={metrics.gpu} color="text-cyan-400" label="GPU VRAM" icon={Server} />
          <CircularProgress value={metrics.ram} color="text-purple-500" label="System RAM" icon={Database} />
          <CircularProgress value={metrics.cpu} color="text-amber-400" label="Compute Load" icon={Cpu} />
          <CircularProgress value={metrics.network} color="text-green-400" label="Network I/O" icon={Activity} />
        </div>

        {/* Sparkline chart placeholder area */}
        <div className="mt-10 h-24 border border-white/5 bg-black/40 rounded-2xl relative overflow-hidden flex items-end">
          <div className="absolute top-3 left-4 text-xs font-mono text-neutral-500">Training Compute Graph</div>
          {/* Decorative bars simulating a graph */}
          <div className="w-full flex items-end justify-between px-2 gap-1 h-12 opacity-60">
            {[...Array(30)].map((_, i) => {
              const height = 20 + Math.random() * 60;
              return (
                <div 
                  key={i} 
                  className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-t-sm transition-all duration-1000 ease-out"
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${i * 0.1}s` 
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
