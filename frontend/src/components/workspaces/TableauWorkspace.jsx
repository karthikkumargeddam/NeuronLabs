"use client";

import React from "react";

export default function TableauWorkspace() {
  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-[#f3f3f3] rounded-lg shadow-2xl font-sans text-[13px] border border-gray-300">
      
      {/* Top Menu */}
      <div className="h-8 bg-[#2A3439] text-white flex items-center px-4 gap-4 text-xs">
        <span className="font-bold">Tableau</span>
        <span>File</span>
        <span>Data</span>
        <span>Worksheet</span>
        <span>Dashboard</span>
        <span>Story</span>
        <span>Analysis</span>
        <span>Map</span>
        <span>Format</span>
        <span>Server</span>
        <span>Window</span>
        <span>Help</span>
      </div>

      {/* Toolbar */}
      <div className="h-10 bg-[#f8f8f8] border-b border-gray-300 flex items-center px-4 gap-4">
        <button className="p-1 hover:bg-gray-200 rounded">←</button>
        <button className="p-1 hover:bg-gray-200 rounded">→</button>
        <div className="w-px h-5 bg-gray-300"></div>
        <button className="p-1 hover:bg-gray-200 rounded opacity-50">💾</button>
        <div className="w-px h-5 bg-gray-300"></div>
        <button className="px-2 py-1 bg-white border border-gray-300 rounded text-xs shadow-sm flex items-center gap-1">
          <span className="text-blue-500">📊</span> Data Source
        </button>
      </div>

      <div className="flex-grow flex overflow-hidden">
        
        {/* Left Sidebar (Data Pane) */}
        <div className="w-56 bg-[#f8f8f8] border-r border-gray-300 flex flex-col hidden lg:flex">
          
          <div className="flex bg-[#e8e8e8] border-b border-gray-300">
            <button className="flex-1 py-1 text-center font-bold text-gray-700 bg-white border-t-2 border-blue-500">Data</button>
            <button className="flex-1 py-1 text-center text-gray-500 hover:bg-gray-200">Analytics</button>
          </div>

          <div className="p-2 border-b border-gray-300 font-semibold text-gray-700 flex items-center gap-2">
            <span>🛢️</span> Training_Data (Neuron_DB)
          </div>

          <div className="flex-grow overflow-y-auto p-2">
            <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider mb-2">Search</div>
            <div className="relative mb-4">
              <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500" />
            </div>

            <div className="font-bold text-gray-500 mb-2 border-b border-gray-200 pb-1">Tables</div>
            
            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-2 px-1 hover:bg-gray-200 cursor-pointer text-blue-600">
                <span className="text-gray-400">#</span>
                <span>Batch ID</span>
              </div>
              <div className="flex items-center gap-2 px-1 hover:bg-gray-200 cursor-pointer text-blue-600">
                <span className="text-gray-400">Abc</span>
                <span>Category</span>
              </div>
              <div className="flex items-center gap-2 px-1 hover:bg-gray-200 cursor-pointer text-blue-600">
                <span className="text-gray-400">📅</span>
                <span>Created At</span>
              </div>
            </div>

            <div className="w-full h-px bg-gray-300 my-2"></div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 px-1 hover:bg-gray-200 cursor-pointer text-green-600">
                <span className="text-gray-400">#</span>
                <span>Feature Vector X</span>
              </div>
              <div className="flex items-center gap-2 px-1 hover:bg-gray-200 cursor-pointer text-green-600">
                <span className="text-gray-400">#</span>
                <span>Feature Vector Y</span>
              </div>
              <div className="flex items-center gap-2 px-1 hover:bg-gray-200 cursor-pointer text-green-600">
                <span className="text-gray-400">#</span>
                <span>Label</span>
              </div>
              <div className="flex items-center gap-2 px-1 hover:bg-gray-200 cursor-pointer text-green-600 italic">
                <span className="text-gray-400">#</span>
                <span>Measure Values</span>
              </div>
            </div>
          </div>

        </div>

        {/* Center Canvas Area */}
        <div className="flex-grow flex flex-col bg-white">
          
          {/* Shelves */}
          <div className="flex flex-col border-b border-gray-300 bg-gray-50">
            {/* Columns Shelf */}
            <div className="flex border-b border-gray-200 min-h-[36px]">
              <div className="w-24 bg-gray-100 flex items-center justify-end pr-2 text-gray-500 font-bold border-r border-gray-200">
                Columns
              </div>
              <div className="flex-grow flex items-center p-1 gap-1">
                <div className="bg-blue-600 text-white px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                  <span>Category</span>
                  <span className="text-blue-300 ml-1 text-[10px]">▼</span>
                </div>
              </div>
            </div>
            {/* Rows Shelf */}
            <div className="flex min-h-[36px]">
              <div className="w-24 bg-gray-100 flex items-center justify-end pr-2 text-gray-500 font-bold border-r border-gray-200">
                Rows
              </div>
              <div className="flex-grow flex items-center p-1 gap-1">
                <div className="bg-green-600 text-white px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                  <span>SUM(Feature X)</span>
                  <span className="text-green-300 ml-1 text-[10px]">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Visualization Canvas */}
          <div className="flex-grow relative p-8">
            <h2 className="text-xl font-bold text-gray-700 text-center mb-6">Feature X Distribution by Category</h2>
            
            {/* SVG Chart Mockup (Bar Chart) */}
            <div className="w-full h-full max-h-[400px] relative mt-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Y Axis Grid Lines */}
                <line x1="10" y1="10" x2="100" y2="10" stroke="#e0e0e0" strokeWidth="0.5" />
                <line x1="10" y1="30" x2="100" y2="30" stroke="#e0e0e0" strokeWidth="0.5" />
                <line x1="10" y1="50" x2="100" y2="50" stroke="#e0e0e0" strokeWidth="0.5" />
                <line x1="10" y1="70" x2="100" y2="70" stroke="#e0e0e0" strokeWidth="0.5" />
                <line x1="10" y1="90" x2="100" y2="90" stroke="#a0a0a0" strokeWidth="1" />
                
                {/* X Axis */}
                <line x1="10" y1="10" x2="10" y2="90" stroke="#a0a0a0" strokeWidth="1" />

                {/* Bars */}
                <rect x="20" y="40" width="10" height="50" fill="#4e79a7" className="hover:opacity-80 cursor-pointer transition-opacity" />
                <rect x="40" y="20" width="10" height="70" fill="#f28e2b" className="hover:opacity-80 cursor-pointer transition-opacity" />
                <rect x="60" y="60" width="10" height="30" fill="#e15759" className="hover:opacity-80 cursor-pointer transition-opacity" />
                <rect x="80" y="35" width="10" height="55" fill="#76b7b2" className="hover:opacity-80 cursor-pointer transition-opacity" />
              </svg>
              
              {/* Y Axis Labels */}
              <div className="absolute top-0 left-0 bottom-[10%] flex flex-col justify-between text-[10px] text-gray-500">
                <span>100K</span>
                <span>75K</span>
                <span>50K</span>
                <span>25K</span>
                <span>0</span>
              </div>
              
              {/* X Axis Labels */}
              <div className="absolute bottom-0 left-[10%] right-0 flex justify-around text-[11px] text-gray-700 font-semibold pt-2">
                <span>Alpha</span>
                <span>Beta</span>
                <span>Gamma</span>
                <span>Delta</span>
              </div>
            </div>
            
            {/* Tooltip Mockup */}
            <div className="absolute top-1/3 left-1/2 bg-white border border-gray-300 shadow-lg p-2 rounded text-xs opacity-0 hover:opacity-100 transition-opacity z-10">
              <div className="font-bold mb-1">Category: Beta</div>
              <div>SUM(Feature X): 85,432</div>
            </div>

          </div>

        </div>

        {/* Right Sidebar (Show Me) */}
        <div className="w-48 bg-white border-l border-gray-300 flex flex-col hidden xl:flex">
          <div className="h-8 bg-[#f8f8f8] border-b border-gray-300 flex items-center px-2 font-bold text-gray-600 justify-between">
            <span>Show Me</span>
            <span className="text-[10px]">▼</span>
          </div>
          <div className="p-2 grid grid-cols-3 gap-1">
            <div className="aspect-square bg-gray-100 border border-gray-200 rounded hover:border-blue-400 cursor-pointer opacity-50"></div>
            <div className="aspect-square bg-gray-100 border border-gray-200 rounded hover:border-blue-400 cursor-pointer opacity-50"></div>
            <div className="aspect-square bg-gray-100 border border-gray-200 rounded hover:border-blue-400 cursor-pointer opacity-50"></div>
            <div className="aspect-square bg-gray-100 border border-gray-200 rounded hover:border-blue-400 cursor-pointer opacity-50"></div>
            <div className="aspect-square bg-blue-50 border-2 border-blue-400 rounded cursor-pointer relative">
              <div className="absolute inset-2 bg-blue-400 opacity-20"></div>
              <div className="absolute bottom-2 left-2 w-1.5 h-4 bg-blue-600"></div>
              <div className="absolute bottom-2 left-4 w-1.5 h-6 bg-orange-500"></div>
              <div className="absolute bottom-2 left-6 w-1.5 h-3 bg-red-500"></div>
            </div>
            <div className="aspect-square bg-gray-100 border border-gray-200 rounded hover:border-blue-400 cursor-pointer opacity-50"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
