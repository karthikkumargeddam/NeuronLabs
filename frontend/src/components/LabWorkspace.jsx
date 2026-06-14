"use client";

import React, { useState, useEffect } from "react";
import Mermaid from "./Mermaid";
import { Loader2, Users, Mic, Activity } from "lucide-react";
import ThreeDViewer from "./ThreeDViewer";
import { io } from "socket.io-client";
import MockInterviewModal from "./MockInterviewModal";

export default function LabWorkspace({ initialCodeSnippet, initialTerminalOutput, visualization }) {
  const formatText = (text) => text ? text.replace(/\\n/g, '\n') : "";
  const [code, setCode] = useState(formatText(initialCodeSnippet) || "# Write your Python code here...");
  const [output, setOutput] = useState(formatText(initialTerminalOutput) || "Waiting for execution...");
  const [plotImage, setPlotImage] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const formattedVisualization = formatText(visualization);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompilerReady, setIsCompilerReady] = useState(false);
  const [pyodideInstance, setPyodideInstance] = useState(null);

  // Multiplayer Collaboration
  const [socket, setSocket] = useState(null);
  const [liveUsers, setLiveUsers] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Determine the lab ID from the URL path
    const labId = window.location.pathname.split('/').pop() || 'default-lab';
    
    // Connect to Strapi WebSocket Server
    const backendUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const newSocket = io(backendUrl);

    newSocket.on("connect", () => {
      newSocket.emit("join-lab", labId);
    });

    newSocket.on("user-joined", () => {
      setLiveUsers(prev => prev + 1);
    });

    newSocket.on("code-update", (newCode) => {
      setIsSyncing(true);
      setCode(newCode);
      // Wait a moment to avoid emitting our own update back
      setTimeout(() => setIsSyncing(false), 100);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (socket && !isSyncing) {
      const labId = window.location.pathname.split('/').pop() || 'default-lab';
      socket.emit("code-change", { labId, code: newCode });
    }
  };

  const getThreeDType = () => {
    const lowerCode = code.toLowerCase();
    if (lowerCode.includes('quantum') || lowerCode.includes('qiskit') || lowerCode.includes('qubit')) return 'quantum_sphere';
    if (lowerCode.includes('protein') || lowerCode.includes('molecule') || lowerCode.includes('dna') || lowerCode.includes('biology')) return 'molecule';
    if (lowerCode.includes('astro') || lowerCode.includes('space') || lowerCode.includes('blackhole')) return 'astrophysics';
    return null;
  };

  const [force3D, setForce3D] = useState(false);
  const autoThreeDType = getThreeDType();
  const shouldRender3D = force3D || (!plotImage && !videoSrc && autoThreeDType);

  // AI Tutor State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiChat, setAiChat] = useState([{ role: 'assistant', content: "Hello! I'm your NeuronLabs PhD AI Tutor. I can see your Python code. How can I assist your research today?" }]);
  const [aiInput, setAiInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Mock Interview State
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);

  // Profiler State
  const [isProfiling, setIsProfiling] = useState(false);
  const [profilerData, setProfilerData] = useState(null);

  const handleProfileCode = async () => {
    setIsProfiling(true);
    try {
      const res = await fetch('/api/code-profiler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setProfilerData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProfiling(false);
    }
  };

  const handleAskAI = async (e) => {
    e?.preventDefault();
    if (!aiInput.trim()) return;
    const currentInput = aiInput;
    const newChat = [...aiChat, { role: 'user', content: currentInput }];
    setAiChat(newChat);
    setAiInput("");
    setIsAiTyping(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput, code, language: 'python' })
      });
      const data = await res.json();
      setAiChat([...newChat, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setAiChat([...newChat, { role: 'assistant', content: "[Error] Connection to AI Tutor core failed." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  React.useEffect(() => {
    // Dynamically load Pyodide
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
    script.onload = async () => {
      try {
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        
        // Expose function to Python for rendering plots
        pyodide.globals.set("render_image", (base64Str) => {
          setVideoSrc(null); // Clear video if rendering image
          setPlotImage("data:image/png;base64," + base64Str);
        });

        // Expose function to Python for rendering video URLs
        pyodide.globals.set("render_video", (url) => {
          setPlotImage(null); // Clear image if rendering video
          setVideoSrc(url ? url.toString() : null);
        });

        setPyodideInstance(pyodide);
        setIsCompilerReady(true);
      } catch (err) {
        console.error("Failed to load Pyodide:", err);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput("Compiling and Running via WebAssembly...");
    setPlotImage(null);
    setVideoSrc(null);

    try {
      if (!isCompilerReady || !pyodideInstance) {
        setOutput("[Error] Python compiler is still initializing. Please wait a moment and try again.");
        setIsExecuting(false);
        return;
      }

      let capturedOutput = "";
      pyodideInstance.setStdout({ batched: (text) => { capturedOutput += text + "\n"; setOutput(capturedOutput); } });
      pyodideInstance.setStderr({ batched: (text) => { capturedOutput += text + "\n"; setOutput(capturedOutput); } });

      // Load required packages
      await pyodideInstance.loadPackagesFromImports(code);

      // Run the code
      await pyodideInstance.runPythonAsync(code);
      
      if (!capturedOutput) {
        setOutput("Execution completed with no output.");
      }
    } catch (error) {
      console.error(error);
      setOutput(prev => prev + "\n[Error]\n" + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      // Use parameters to hide as much of the YouTube UI as currently allowed by Google
      // enablejsapi=1 allows us to control the video via postMessage since it is unclickable
      return "https://www.youtube.com/embed/" + match[2] + "?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1";
    }
    return null;
  };

  const ytEmbedUrl = getYoutubeEmbedUrl(videoSrc);
  const iframeRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const toggleVideoPlayback = () => {
    if (ytEmbedUrl && iframeRef.current) {
      const command = isVideoPlaying ? "pauseVideo" : "playVideo";
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command, args: '' }), '*');
      setIsVideoPlaying(!isVideoPlaying);
    } else if (videoSrc && !ytEmbedUrl && videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className="flex-grow flex flex-col gap-4">
      {/* Top section: Architecture and Code Side-by-side */}
      <div className="flex-grow flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* Dynamic Visualization */}
        {(visualization || plotImage || videoSrc || shouldRender3D) && (
           <div className="flex-1 flex flex-col relative glass-panel border-[#333] bg-[#050505] p-2 overflow-y-auto custom-scrollbar">
             <div className="absolute top-4 left-4 bg-[#111] px-2 py-1 text-xs font-mono text-cyan-500 z-10 border border-cyan-500/30 rounded flex items-center gap-4">
               <span>{shouldRender3D ? "WebGL 3D Simulation" : videoSrc ? "Video Simulation" : plotImage ? "Python Matplotlib Output" : "Architecture Overview"}</span>
               {videoSrc && !shouldRender3D && (
                 <button 
                   onClick={toggleVideoPlayback}
                   className="hover:text-cyan-300 transition-colors bg-[#222] px-2 rounded"
                 >
                   {isVideoPlaying ? "⏸ Pause" : "▶ Play"}
                 </button>
               )}
             </div>
             <div className="absolute top-4 right-4 z-10">
               {autoThreeDType && !shouldRender3D && !force3D && (
                 <button 
                   onClick={() => setForce3D(true)}
                   className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded text-xs transition-colors"
                 >
                   View 3D Simulation
                 </button>
               )}
               {force3D && (
                 <button 
                   onClick={() => setForce3D(false)}
                   className="bg-[#222] hover:bg-[#333] text-gray-400 border border-[#444] px-3 py-1 rounded text-xs transition-colors"
                 >
                   Show 2D Output
                 </button>
               )}
             </div>
             <div className={`flex-grow flex items-center justify-center mt-6 w-full relative ${shouldRender3D ? 'p-0' : 'p-8'}`}>
               {shouldRender3D ? (
                 <div className="w-full h-full min-h-[400px] rounded border border-[#333] overflow-hidden">
                   <ThreeDViewer type={autoThreeDType || 'quantum_sphere'} />
                 </div>
               ) : ytEmbedUrl ? (
                 <iframe 
                   ref={iframeRef}
                   src={ytEmbedUrl} 
                   className="w-full max-w-[700px] h-[400px] rounded border border-[#333] shadow-2xl shadow-cyan-500/10 pointer-events-none" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                 ></iframe>
               ) : videoSrc ? (
                 <video ref={videoRef} src={videoSrc} autoPlay loop muted className="max-w-full max-h-[400px] object-contain rounded border border-[#333] pointer-events-none" />
               ) : plotImage ? (
                 <img src={plotImage} alt="Python plot output" className="max-w-full max-h-[400px] object-contain rounded" />
               ) : (
                 <Mermaid chart={formattedVisualization} />
               )}
             </div>
           </div>
        )}

        {/* Code Editor */}
        <div className={`flex-1 w-full glass-panel border-[#333] p-6 font-mono text-sm bg-[#050505] relative flex flex-col overflow-hidden`}>
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-[#222] px-3 py-1 text-xs text-gray-500 rounded">Interactive Editor</div>
              {liveUsers > 1 && (
                <div className="bg-green-900/30 border border-green-500/30 text-green-400 px-3 py-1 rounded text-xs flex items-center gap-2 animate-pulse">
                  <Users className="w-3 h-3" />
                  {liveUsers} Researchers Live
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleProfileCode}
                disabled={isProfiling}
                className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 bg-[#222] hover:bg-[#333] border border-[#444] text-cyan-400"
              >
                {isProfiling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                Profile Code
              </button>
              <button 
                onClick={handleRunCode}
                disabled={isExecuting || !isCompilerReady}
                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                  (isExecuting || !isCompilerReady)
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                }`}
              >
                {(isExecuting || !isCompilerReady) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isExecuting ? 'Running...' : (!isCompilerReady ? 'Loading Compiler...' : 'Run Code')}
              </button>
              <button 
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]"
              >
                ✨ Ask AI Tutor
              </button>
              <button 
                onClick={() => setIsInterviewOpen(true)}
                className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                <Mic className="w-4 h-4" /> Mock Interview
              </button>
            </div>
          </div>
          
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="w-full flex-grow bg-transparent text-gray-300 resize-none outline-none whitespace-pre overflow-y-auto custom-scrollbar relative z-10"
            spellCheck="false"
          />

          {/* Profiler Overlay */}
          {profilerData && (
            <div className="absolute bottom-6 right-6 w-[400px] bg-[#050505] border border-cyan-500/30 rounded-lg p-4 shadow-2xl z-20 animate-fade-in flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-[#333] pb-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Activity className="w-4 h-4" />
                  <span className="font-bold text-xs uppercase tracking-widest">Big-O Analyzer</span>
                </div>
                <button onClick={() => setProfilerData(null)} className="text-gray-500 hover:text-white">✕</button>
              </div>
              <div className="flex justify-between items-center">
                <div className="bg-[#111] p-3 rounded border border-[#333] w-[48%] text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">Time</p>
                  <p className="text-xl font-bold text-white font-mono">{profilerData.timeComplexity}</p>
                </div>
                <div className="bg-[#111] p-3 rounded border border-[#333] w-[48%] text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">Space</p>
                  <p className="text-xl font-bold text-white font-mono">{profilerData.spaceComplexity}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed bg-cyan-900/10 p-3 rounded border border-cyan-500/20">
                {profilerData.explanation}
              </p>
            </div>
          )}
        </div>

        {/* AI Tutor Panel */}
        {isAIOpen && (
          <div className="w-[350px] flex-shrink-0 glass-panel border-[#333] bg-[#050505] flex flex-col overflow-hidden animate-slide-in-right relative z-20">
            <div className="bg-[#111] border-b border-[#333] p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <span className="font-bold text-purple-400 text-sm tracking-widest uppercase">PhD AI Tutor</span>
              </div>
              <button onClick={() => setIsAIOpen(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4 text-sm">
              {aiChat.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${msg.role === 'assistant' ? 'bg-purple-900/20 border border-purple-500/30 text-purple-100' : 'bg-[#222] border border-[#333] text-gray-200 self-end'}`}>
                  {msg.content}
                </div>
              ))}
              {isAiTyping && (
                <div className="p-3 rounded-lg bg-purple-900/20 border border-purple-500/30 text-purple-400 w-16 flex justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </div>

            <form onSubmit={handleAskAI} className="p-3 bg-[#111] border-t border-[#333] flex gap-2">
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask about your code..." 
                className="flex-grow bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button 
                type="submit" 
                disabled={isAiTyping || !aiInput.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-3 py-2 rounded transition-colors"
              >
                &rarr;
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Terminal */}
      <div className="h-48 min-h-[12rem] flex-shrink-0 glass-panel border-[#333] p-4 font-mono text-xs bg-[#000] text-green-400 overflow-y-auto relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-20"></div>
        <div>root@phd-lab-vbox:~# python main.py</div>
        <div className="text-gray-400 mt-2 whitespace-pre-wrap leading-relaxed">
          {output}
        </div>
        {!isExecuting && (
          <div className="animate-pulse mt-2 flex items-center gap-2">
            <span>root@phd-lab-vbox:~#</span>
            <span className="w-2 h-4 bg-green-500"></span>
          </div>
        )}
      </div>

      <MockInterviewModal 
        isOpen={isInterviewOpen} 
        onClose={() => setIsInterviewOpen(false)} 
        code={code} 
      />
    </div>
  );
}
