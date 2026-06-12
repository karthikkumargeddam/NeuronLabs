"use client";

import React from "react";

export default function TensorBoardWorkspace() {
  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-white rounded-lg shadow-2xl font-sans text-sm">
      
      {/* Top Header */}
      <div className="h-12 bg-[#ff7043] flex items-center justify-between px-4 text-white shadow">
        <div className="flex items-center gap-6 text-lg font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            TensorBoard
          </div>
          <div className="flex gap-4 text-sm font-normal uppercase tracking-wider opacity-90">
            <span className="border-b-2 border-white pb-1">Scalars</span>
            <span className="cursor-pointer hover:opacity-100 opacity-70">Images</span>
            <span className="cursor-pointer hover:opacity-100 opacity-70">Graphs</span>
            <span className="cursor-pointer hover:opacity-100 opacity-70">Distributions</span>
            <span className="cursor-pointer hover:opacity-100 opacity-70">Histograms</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button className="bg-white/20 px-3 py-1 rounded hover:bg-white/30">↻</button>
          <span>Settings</span>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col p-4 overflow-y-auto">
          <div className="mb-6">
            <div className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-widest">Show data download links</div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-[#ff7043] rounded" />
              <span className="text-gray-600 text-sm">Ignore outliers in chart scaling</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-widest">Tooltip sorting method</div>
            <select className="w-full bg-white border border-gray-300 rounded p-1 text-gray-700">
              <option>default</option>
              <option>descending</option>
              <option>ascending</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-widest">Smoothing</div>
            <input type="range" className="w-full accent-[#ff7043]" defaultValue="60" />
            <div className="text-right text-gray-500 text-xs">0.6</div>
          </div>

          <div>
            <div className="font-bold text-gray-700 mb-2 uppercase text-xs tracking-widest">Runs</div>
            <input type="text" placeholder="Filter runs (regex)" className="w-full bg-white border border-gray-300 rounded p-1.5 mb-2 text-sm" />
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-500" />
                <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                <span className="text-gray-700 truncate">run_resnet50_v1</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-500" />
                <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                <span className="text-gray-700 truncate">run_resnet50_v2_aug</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 accent-green-500" />
                <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                <span className="text-gray-700 truncate text-opacity-50">run_baseline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area (Graphs) */}
        <div className="flex-grow bg-white p-6 overflow-y-auto">
          <input type="text" placeholder="Filter tags (regex)" className="w-full max-w-md bg-white border border-gray-300 rounded p-2 mb-6 shadow-sm" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Graph Card 1 */}
            <div className="border border-gray-200 rounded shadow-sm bg-white overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 font-mono text-sm text-gray-700 flex justify-between">
                <span>epoch_loss</span>
                <span className="text-gray-400">[ ]</span>
              </div>
              <div className="p-4 h-64 relative">
                {/* SVG Graph Mockup */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#f0f0f0" strokeWidth="1" />
                  
                  {/* Run 1 (Blue) */}
                  <path d="M0 90 Q 20 50 40 30 T 100 10" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
                  <path d="M0 85 Q 20 45 40 25 T 100 15" fill="none" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
                  
                  {/* Run 2 (Red) */}
                  <path d="M0 95 Q 20 60 40 40 T 100 20" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
                  <path d="M0 90 Q 20 55 40 35 T 100 25" fill="none" stroke="rgba(239, 68, 68, 1)" strokeWidth="2" />
                </svg>
                {/* Axes */}
                <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] text-gray-400">
                  <span>0</span><span>20k</span><span>40k</span><span>60k</span><span>80k</span><span>100k</span>
                </div>
                <div className="absolute top-4 bottom-4 left-0 flex flex-col justify-between text-[10px] text-gray-400 bg-white pr-1">
                  <span>1.0</span><span>0.5</span><span>0.0</span>
                </div>
              </div>
            </div>

            {/* Graph Card 2 */}
            <div className="border border-gray-200 rounded shadow-sm bg-white overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 font-mono text-sm text-gray-700 flex justify-between">
                <span>epoch_accuracy</span>
                <span className="text-gray-400">[ ]</span>
              </div>
              <div className="p-4 h-64 relative">
                {/* SVG Graph Mockup */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#f0f0f0" strokeWidth="1" />
                  
                  {/* Run 1 (Blue) */}
                  <path d="M0 20 Q 20 60 40 80 T 100 95" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
                  <path d="M0 10 Q 20 50 40 70 T 100 90" fill="none" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
                  
                  {/* Run 2 (Red) */}
                  <path d="M0 30 Q 20 70 40 85 T 100 98" fill="none" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
                  <path d="M0 25 Q 20 65 40 80 T 100 95" fill="none" stroke="rgba(239, 68, 68, 1)" strokeWidth="2" />
                </svg>
                {/* Axes */}
                <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] text-gray-400">
                  <span>0</span><span>20k</span><span>40k</span><span>60k</span><span>80k</span><span>100k</span>
                </div>
                <div className="absolute top-4 bottom-4 left-0 flex flex-col justify-between text-[10px] text-gray-400 bg-white pr-1">
                  <span>1.0</span><span>0.8</span><span>0.5</span>
                </div>
              </div>
            </div>

            {/* Graph Card 3 */}
            <div className="border border-gray-200 rounded shadow-sm bg-white overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 font-mono text-sm text-gray-700 flex justify-between">
                <span>learning_rate</span>
                <span className="text-gray-400">[ ]</span>
              </div>
              <div className="p-4 h-64 relative">
                {/* SVG Graph Mockup */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#f0f0f0" strokeWidth="1" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#f0f0f0" strokeWidth="1" />
                  
                  {/* Step function */}
                  <path d="M0 10 L 30 10 L 30 50 L 70 50 L 70 90 L 100 90" fill="none" stroke="rgba(59, 130, 246, 1)" strokeWidth="2" />
                  <path d="M0 10 L 40 10 L 40 60 L 80 60 L 80 95 L 100 95" fill="none" stroke="rgba(239, 68, 68, 1)" strokeWidth="2" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
