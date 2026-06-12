"use client";

import React, { useState } from "react";
import Mermaid from "./Mermaid";
import { Loader2 } from "lucide-react";

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
        {(visualization || plotImage || videoSrc) && (
           <div className="flex-1 flex flex-col relative glass-panel border-[#333] bg-[#050505] p-2 overflow-y-auto custom-scrollbar">
             <div className="absolute top-4 left-4 bg-[#111] px-2 py-1 text-xs font-mono text-cyan-500 z-10 border border-cyan-500/30 rounded flex items-center gap-4">
               <span>{videoSrc ? "Video Simulation" : plotImage ? "Python Matplotlib Output" : "Architecture Overview"}</span>
               {videoSrc && (
                 <button 
                   onClick={toggleVideoPlayback}
                   className="hover:text-cyan-300 transition-colors bg-[#222] px-2 rounded"
                 >
                   {isVideoPlaying ? "⏸ Pause" : "▶ Play"}
                 </button>
               )}
             </div>
             <div className="flex-grow flex items-center justify-center p-8 mt-6 w-full relative">
               {ytEmbedUrl ? (
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
            <div className="bg-[#222] px-3 py-1 text-xs text-gray-500 rounded">Interactive Editor</div>
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
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full flex-grow bg-transparent text-gray-300 resize-none outline-none whitespace-pre overflow-y-auto custom-scrollbar"
            spellCheck="false"
          />
        </div>
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
    </div>
  );
}
