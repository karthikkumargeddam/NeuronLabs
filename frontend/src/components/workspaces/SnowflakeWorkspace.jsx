"use client";

import React, { useState } from "react";

export default function SnowflakeWorkspace() {
  const [query, setQuery] = useState("SELECT *\\nFROM NEURON_DB.PUBLIC.TRAINING_DATA\\nLIMIT 100;");
  
  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-white rounded-lg shadow-2xl font-sans text-sm border border-gray-200">
      
      {/* Header */}
      <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#29B5E8] font-bold text-lg tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Snowflake
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-gray-700 font-medium">Worksheets</div>
          <div className="text-gray-400">&gt;</div>
          <div className="text-gray-700 font-semibold">Customer Analysis 2026</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 bg-[#f1f3f4] text-gray-700 rounded-md text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> COMPUTE_WH
          </div>
          <button className="bg-[#29B5E8] text-white px-4 py-1.5 rounded-md font-semibold shadow-sm hover:bg-[#1a95c4]">Share</button>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar (Databases) */}
        <div className="w-64 bg-[#f8f9fa] border-r border-gray-200 flex flex-col hidden lg:flex">
          <div className="p-3 border-b border-gray-200">
            <div className="bg-white border border-gray-300 rounded-md flex items-center px-2 py-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search databases" className="w-full pl-2 outline-none text-xs bg-transparent" />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto p-2">
            <div className="font-semibold text-gray-800 text-xs mb-2 pl-2">Databases</div>
            
            {/* Database Tree */}
            <div className="space-y-1">
              <div>
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded cursor-pointer text-gray-700">
                  <span className="text-gray-400 w-4 text-center">▼</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#29B5E8]"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  <span className="font-medium text-sm">NEURON_DB</span>
                </div>
                
                {/* Schemas */}
                <div className="pl-6 space-y-1">
                  <div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded cursor-pointer text-gray-700">
                      <span className="text-gray-400 w-4 text-center">▼</span>
                      <span className="font-medium text-sm">PUBLIC</span>
                    </div>
                    {/* Tables */}
                    <div className="pl-6 space-y-1 mt-1">
                      <div className="flex items-center gap-2 px-2 py-1 bg-[#e8f4fa] text-[#0f5b82] rounded cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                        <span className="text-xs">TRAINING_DATA</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded cursor-pointer text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                        <span className="text-xs">MODEL_METRICS</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded cursor-pointer text-gray-700">
                      <span className="text-gray-400 w-4 text-center">▶</span>
                      <span className="font-medium text-sm">INFORMATION_SCHEMA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded cursor-pointer text-gray-700">
                  <span className="text-gray-400 w-4 text-center">▶</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                  <span className="font-medium text-sm">SNOWFLAKE_SAMPLE_DATA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-grow flex flex-col bg-white overflow-hidden">
          
          {/* Query Editor */}
          <div className="h-1/2 flex flex-col border-b border-gray-200">
            <div className="h-10 bg-[#f8f9fa] border-b border-gray-200 flex items-center px-4 justify-between">
              <div className="flex gap-4 text-xs font-semibold text-gray-600">
                <span className="cursor-pointer border-b-2 border-[#29B5E8] text-[#29B5E8] pb-2.5 mt-2.5">SQL</span>
                <span className="cursor-pointer hover:text-gray-800 mt-0.5">Python</span>
              </div>
              <button className="bg-[#29B5E8] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#1a95c4] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run
              </button>
            </div>
            <div className="flex-grow p-4 font-mono text-sm bg-white overflow-auto">
              <textarea 
                className="w-full h-full resize-none outline-none text-[#0000ff]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                spellCheck="false"
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="h-1/2 flex flex-col bg-white">
            <div className="h-10 bg-[#f8f9fa] border-b border-gray-200 flex items-center px-4 justify-between">
              <div className="text-xs font-semibold text-gray-700">Results</div>
              <div className="text-xs text-gray-500">100 rows • 124 ms • Query ID: 01ab-23cd...</div>
            </div>
            <div className="flex-grow overflow-auto p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-300 pb-2 font-bold text-gray-600 px-2 sticky top-0 bg-white">ID</th>
                    <th className="border-b border-gray-300 pb-2 font-bold text-gray-600 px-2 sticky top-0 bg-white">BATCH_ID</th>
                    <th className="border-b border-gray-300 pb-2 font-bold text-gray-600 px-2 sticky top-0 bg-white">FEATURE_VECTOR</th>
                    <th className="border-b border-gray-300 pb-2 font-bold text-gray-600 px-2 sticky top-0 bg-white">LABEL</th>
                    <th className="border-b border-gray-300 pb-2 font-bold text-gray-600 px-2 sticky top-0 bg-white">CREATED_AT</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 font-mono">
                  <tr className="hover:bg-blue-50 cursor-pointer">
                    <td className="border-b border-gray-100 py-2 px-2">1</td>
                    <td className="border-b border-gray-100 py-2 px-2">B_001</td>
                    <td className="border-b border-gray-100 py-2 px-2 truncate max-w-[200px] text-gray-500">[0.45, 0.12, 0.89, -0.1...]</td>
                    <td className="border-b border-gray-100 py-2 px-2">1</td>
                    <td className="border-b border-gray-100 py-2 px-2">2026-06-07 10:14:00</td>
                  </tr>
                  <tr className="hover:bg-blue-50 cursor-pointer">
                    <td className="border-b border-gray-100 py-2 px-2">2</td>
                    <td className="border-b border-gray-100 py-2 px-2">B_001</td>
                    <td className="border-b border-gray-100 py-2 px-2 truncate max-w-[200px] text-gray-500">[0.33, 0.92, 0.11, -0.5...]</td>
                    <td className="border-b border-gray-100 py-2 px-2">0</td>
                    <td className="border-b border-gray-100 py-2 px-2">2026-06-07 10:14:01</td>
                  </tr>
                  <tr className="hover:bg-blue-50 cursor-pointer">
                    <td className="border-b border-gray-100 py-2 px-2">3</td>
                    <td className="border-b border-gray-100 py-2 px-2">B_002</td>
                    <td className="border-b border-gray-100 py-2 px-2 truncate max-w-[200px] text-gray-500">[0.88, 0.44, 0.22, 0.01...]</td>
                    <td className="border-b border-gray-100 py-2 px-2">1</td>
                    <td className="border-b border-gray-100 py-2 px-2">2026-06-07 10:15:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
