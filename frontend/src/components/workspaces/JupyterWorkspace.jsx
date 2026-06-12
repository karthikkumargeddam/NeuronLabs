"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Plus, Save, Trash2, Cpu, Zap, Beaker } from "lucide-react";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from 'monaco-editor';

if (typeof window !== 'undefined') {
  loader.config({ monaco });
}

export default function JupyterWorkspace({ code, setCode }) {
  const [cells, setCells] = useState([
    { type: 'markdown', content: '# Data Exploration\\nLet us load the dataset and visualize the initial parameters.' },
    { type: 'code', content: 'import pandas as pd\\nimport matplotlib.pyplot as plt\\n\\ndf = pd.read_csv("dataset.csv")\\ndf.head()', output: '<table border="1" class="dataframe text-xs text-gray-300"><thead><tr style="text-align: right;"><th></th><th>age</th><th>income</th><th>score</th></tr></thead><tbody><tr><th>0</th><td>25</td><td>45000</td><td>85</td></tr><tr><th>1</th><td>32</td><td>68000</td><td>92</td></tr></tbody></table>' },
    { type: 'code', content: code || 'df.describe()', output: null }
  ]);

  return (
    <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-[#111111] rounded-lg border border-[#333] shadow-2xl text-[#cccccc]">
      
      {/* Sidebar */}
      <div className="w-56 bg-[#212121] flex-col border-r border-[#333] hidden lg:flex">
        <div className="h-10 border-b border-[#333] flex items-center px-4 gap-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <span className="text-sm font-semibold">File Browser</span>
        </div>
        <div className="flex-grow overflow-y-auto p-2 font-sans text-sm space-y-1">
          <div className="flex items-center gap-2 px-2 py-1 bg-[#3a3a3a] rounded cursor-pointer text-gray-200">
            <span className="text-orange-500">📓</span> exploration.ipynb
          </div>
          <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2a2a] rounded cursor-pointer text-gray-400">
            <span className="text-orange-500">📓</span> training.ipynb
          </div>
          <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2a2a] rounded cursor-pointer text-gray-400">
            <span>📊</span> dataset.csv
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-grow flex flex-col min-w-0 bg-[#1e1e1e]">
        {/* Top bar */}
        <div className="flex bg-[#212121] h-10 border-b border-[#333]">
          <div className="flex items-center px-4 bg-[#1e1e1e] border-t-2 border-t-orange-500 text-sm gap-2 min-w-max cursor-pointer">
            <span className="text-orange-500">📓</span> exploration.ipynb
            <button className="ml-2 w-4 h-4 hover:bg-[#333] rounded flex items-center justify-center text-gray-400 hover:text-white">✕</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="h-10 flex items-center px-4 gap-4 border-b border-[#333] bg-[#1e1e1e] text-gray-400">
          <button className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></button>
          <button className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
          <button className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          <div className="w-px h-4 bg-[#444]"></div>
          <button className="hover:text-green-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
          <button className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg></button>
          <button className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.26l3.08-3.08"/></svg></button>
          <div className="w-px h-4 bg-[#444]"></div>
          <select className="bg-[#2a2a2a] text-sm text-gray-300 border border-[#444] rounded px-2 py-1 outline-none">
            <option>Code</option>
            <option>Markdown</option>
          </select>
        </div>

        {/* Notebook Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 lg:px-12 xl:px-24 bg-[#1e1e1e]">
          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {cells.map((cell, index) => (
              <div key={index} className="flex gap-4 group">
                {/* Input Prompt */}
                <div className="w-16 flex-shrink-0 text-right pt-1 font-mono text-xs">
                  {cell.type === 'code' ? (
                    <span className="text-[#569cd6]">In [{index === 2 ? ' ' : index}]:</span>
                  ) : null}
                </div>
                
                {/* Cell Content */}
                <div className="flex-grow min-w-0">
                  {cell.type === 'markdown' ? (
                    <div className="prose prose-invert max-w-none text-gray-300">
                      <h1 className="text-2xl font-bold border-b border-[#333] pb-2 mb-2">Data Exploration</h1>
                      <p>Let us load the dataset and visualize the initial parameters.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className={`border ${index === 2 ? 'border-blue-500' : 'border-[#333]'} rounded-sm overflow-hidden`}>
                        <div className="bg-[#1a1a1a] p-2 font-mono text-sm overflow-x-auto text-[#d4d4d4]">
                          {index === 2 ? (
                              <div className="h-[200px] w-full">
                                <Editor
                                  height="100%"
                                  defaultLanguage="python"
                                  value={code}
                                  onChange={(value) => setCode(value || '')}
                                  theme="vs-dark"
                                  options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    padding: { top: 8, bottom: 8 },
                                  }}
                                />
                              </div>
                          ) : (
                            <pre><code>{cell.content}</code></pre>
                          )}
                        </div>
                      </div>
                      
                      {/* Output */}
                      {cell.output && (
                        <div className="mt-2 flex gap-4">
                          <div className="w-16 flex-shrink-0 text-right font-mono text-xs text-[#d16969] -ml-20">
                            Out[{index}]:
                          </div>
                          <div className="flex-grow bg-[#1e1e1e] text-sm overflow-x-auto" dangerouslySetInnerHTML={{__html: cell.output}}></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
