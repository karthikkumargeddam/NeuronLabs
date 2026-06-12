"use client";

import React, { useState } from "react";
import VSCodeWorkspace from "./workspaces/VSCodeWorkspace";
import JupyterWorkspace from "./workspaces/JupyterWorkspace";
import PyTorchStudioWorkspace from "./workspaces/PyTorchStudioWorkspace";
import TensorBoardWorkspace from "./workspaces/TensorBoardWorkspace";
import SnowflakeWorkspace from "./workspaces/SnowflakeWorkspace";
import TableauWorkspace from "./workspaces/TableauWorkspace";

export default function VirtualToolbox() {
  const [activeTool, setActiveTool] = useState("vscode");
  const [code, setCode] = useState("# Write your Python code here...");
  const [output, setOutput] = useState("Waiting for execution...");
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput("Running...");

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: "python", code: code })
      });

      const data = await response.json();
      
      if (data.run) {
        setOutput(data.run.output || "Execution completed with no output.");
      } else if (data.message) {
        setOutput(`Error: ${data.message}`);
      } else {
        setOutput("Unknown error occurred.");
      }
    } catch (error) {
      console.error(error);
      setOutput("Failed to connect to execution environment.");
    } finally {
      setIsExecuting(false);
    }
  };

  const tools = [
    { id: "vscode", name: "VS Code", icon: "💻" },
    { id: "jupyter", name: "Jupyter", icon: "📓" },
    { id: "pytorch", name: "PyTorch", icon: "🔥" },
    { id: "tensorboard", name: "TensorBoard", icon: "📈" },
    { id: "snowflake", name: "Snowflake", icon: "❄️" },
    { id: "tableau", name: "Tableau", icon: "📊" }
  ];

  return (
    <div className="flex-grow flex h-full overflow-hidden bg-[#0a0a0a]">
      {/* Tools Dock (Left Sidebar) */}
      <div className="w-16 bg-[#111] flex flex-col items-center py-4 gap-4 border-r border-[#333] z-10 shadow-xl flex-shrink-0">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 relative group ${
              activeTool === tool.id 
                ? "bg-[rgba(6,182,212,0.15)] text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                : "text-gray-500 hover:text-gray-300 hover:bg-[#222]"
            }`}
            title={tool.name}
          >
            {tool.icon}
            {activeTool === tool.id && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full"></div>
            )}
            
            {/* Tooltip */}
            <div className="absolute left-16 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity border border-gray-800 z-50">
              {tool.name}
            </div>
          </button>
        ))}
      </div>

      {/* Main Workspace Area */}
      <div className="flex-grow p-4 md:p-6 overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20"></div>
        
        {/* Render Active Tool Component */}
        {activeTool === "vscode" && (
          <VSCodeWorkspace 
            code={code} setCode={setCode} 
            output={output} isExecuting={isExecuting} 
            handleRunCode={handleRunCode} 
          />
        )}
        
        {activeTool === "jupyter" && (
          <JupyterWorkspace 
            code={code} setCode={setCode} 
          />
        )}
        
        {activeTool === "pytorch" && (
          <PyTorchStudioWorkspace />
        )}
        
        {activeTool === "tensorboard" && (
          <TensorBoardWorkspace />
        )}
        
        {activeTool === "snowflake" && (
          <SnowflakeWorkspace />
        )}
        
        {activeTool === "tableau" && (
          <TableauWorkspace />
        )}

      </div>
    </div>
  );
}
