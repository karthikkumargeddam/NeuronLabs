"use client";

import React from "react";
import Mermaid from "../Mermaid";

export default function VSCodeWorkspace({ 
  code, setCode, 
  output, 
  isExecuting, handleRunCode, 
  visualization 
}) {
  return (
    <div className="flex-grow flex flex-col md:flex-row gap-0 overflow-hidden bg-[#1e1e1e] rounded-lg border border-[#333] shadow-2xl">
      
      {/* Activity Bar (Leftmost thin strip) */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-4 border-r border-[#252526] gap-6 hidden md:flex">
        <div className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer relative group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500 rounded-r -ml-3"></div>
        </div>
        <div className="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div className="w-6 h-6 text-gray-500 hover:text-gray-300 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
        </div>
      </div>

      {/* Explorer Sidebar */}
      <div className="w-60 bg-[#252526] flex-col border-r border-[#1e1e1e] hidden lg:flex">
        <div className="text-[11px] uppercase text-gray-400 p-4 tracking-wider font-semibold">Explorer</div>
        <div className="flex-grow overflow-y-auto">
          <div className="px-4 py-1 text-sm text-gray-300 font-mono font-bold flex items-center gap-2 uppercase text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            NEURON_LAB
          </div>
          <div className="pl-8 py-1 mt-1 text-sm text-cyan-400 font-mono flex items-center gap-2 bg-[#37373d]">
            <span className="text-[#519aba]">{"{}"}</span> main.py
          </div>
          <div className="pl-8 py-1 text-sm text-gray-400 hover:text-gray-200 font-mono flex items-center gap-2 cursor-pointer">
            <span className="text-yellow-500">{"{}"}</span> utils.py
          </div>
          <div className="pl-8 py-1 text-sm text-gray-400 hover:text-gray-200 font-mono flex items-center gap-2 cursor-pointer">
            <span className="text-[#a074c4]">{"[]"}</span> dataset.csv
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Editor Tabs */}
        <div className="flex bg-[#2d2d2d] h-9 border-b border-[#1e1e1e] overflow-x-auto overflow-y-hidden">
          <div className="flex items-center px-4 bg-[#1e1e1e] text-cyan-400 text-sm font-mono border-t border-t-cyan-400 gap-2 min-w-max cursor-pointer">
            <span className="text-[#519aba]">{"{}"}</span> main.py
            <button className="ml-2 w-4 h-4 hover:bg-[#333] rounded flex items-center justify-center text-gray-400 hover:text-white">✕</button>
          </div>
        </div>

        {/* Editor & Vis Split */}
        <div className="flex-grow flex flex-col md:flex-row min-h-0 relative">
          
          <div className={`flex-grow ${visualization ? 'md:w-1/2 border-r border-[#333]' : 'w-full'} flex flex-col bg-[#1e1e1e]`}>
            {/* Top Toolbar overlay */}
            <div className="absolute top-4 right-6 flex gap-2 z-10">
              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg transition-all ${
                  isExecuting 
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                    : "bg-[#007acc] hover:bg-[#005c99] text-white"
                }`}
              >
                {isExecuting ? (
                  <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
                {isExecuting ? "Executing" : "Run Python File"}
              </button>
            </div>

            {/* Line numbers + Textarea */}
            <div className="flex-grow flex overflow-auto custom-scrollbar p-2 relative text-[14px]">
              <div className="w-10 flex-shrink-0 text-right pr-4 text-[#858585] font-mono select-none opacity-50 py-[2px] leading-[21px]">
                {code.split('\\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-transparent text-[#d4d4d4] font-mono resize-none outline-none whitespace-pre overflow-hidden leading-[21px]"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Visualization Split View */}
          {visualization && (
            <div className="md:w-1/2 flex flex-col relative bg-[#1e1e1e] overflow-y-auto custom-scrollbar">
              <div className="bg-[#2d2d2d] h-9 border-b border-[#1e1e1e] flex items-center px-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                Preview: Architecture
              </div>
              <div className="flex-grow flex items-center justify-center p-8">
                <Mermaid chart={visualization} />
              </div>
            </div>
          )}

        </div>

        {/* Integrated Terminal */}
        <div className="h-48 border-t border-[#333] flex flex-col bg-[#1e1e1e] flex-shrink-0">
          <div className="flex gap-6 px-4 pt-2 text-[11px] uppercase tracking-wider font-semibold border-b border-[#333]">
            <div className="text-gray-500 hover:text-gray-300 cursor-pointer pb-2">Problems</div>
            <div className="text-gray-500 hover:text-gray-300 cursor-pointer pb-2">Output</div>
            <div className="text-cyan-400 border-b border-cyan-400 pb-2 cursor-pointer">Terminal</div>
          </div>
          <div className="flex-grow p-4 font-mono text-[13px] overflow-y-auto text-[#cccccc]">
            <div className="flex items-center text-[#519aba] mb-1">
              <span>root@vbox-lab:~/workspace$</span>
              {isExecuting && <span className="ml-2 text-gray-400">python main.py</span>}
            </div>
            <div className="whitespace-pre-wrap leading-relaxed opacity-90">
              {output}
            </div>
            {!isExecuting && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#519aba]">root@vbox-lab:~/workspace$</span>
                <span className="w-2 h-4 bg-[#cccccc] animate-pulse"></span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
