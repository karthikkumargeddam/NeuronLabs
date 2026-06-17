"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export default function TerminalWorkspace() {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  
  const [cwd, setCwd] = useState("/home/researcher");
  // Use a ref to hold current cwd because xterm's onData listener closes over it
  const cwdRef = useRef("/home/researcher");

  useEffect(() => {
    cwdRef.current = cwd;
  }, [cwd]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      theme: {
        background: '#0a0a0a',
        foreground: '#e5e5e5',
        cursor: '#22d3ee',
        cursorAccent: '#0a0a0a',
        selection: 'rgba(34, 211, 238, 0.3)',
      }
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.writeln('\x1b[1;36mWelcome to NeuronLabs Pro Terminal\x1b[0m');
    term.writeln('Type \x1b[1;32mhelp\x1b[0m to see available mock commands.');
    term.writeln('Connected to Strapi Backend Shell API.');
    term.write(`\r\n\x1b[1;32mresearcher@neuron\x1b[0m:\x1b[1;34m${cwdRef.current}\x1b[0m$ `);

    let currentCommand = '';

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    term.onData(async (data) => {
      // Enter key
      if (data === '\r') {
        term.write('\r\n');
        
        if (currentCommand.trim() !== '') {
          // Special local handling for clear
          if (currentCommand.trim() === 'clear') {
            term.clear();
            currentCommand = '';
            term.write(`\x1b[1;32mresearcher@neuron\x1b[0m:\x1b[1;34m${cwdRef.current}\x1b[0m$ `);
            return;
          }

          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/execute-terminal`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                command: currentCommand, 
                cwd: cwdRef.current 
              })
            });

            const data = await res.json();
            
            if (data.output) {
              if (data.output === '\x1b[2J\x1b[3J\x1b[H') {
                 term.clear();
              } else {
                 const lines = data.output.split('\n');
                 lines.forEach(line => term.writeln(line));
              }
            }
            if (data.cwd && data.cwd !== cwdRef.current) {
              setCwd(data.cwd);
            }
            
            // Wait for next tick so cwd update takes effect
            setTimeout(() => {
              term.write(`\x1b[1;32mresearcher@neuron\x1b[0m:\x1b[1;34m${cwdRef.current}\x1b[0m$ `);
            }, 10);
          } catch (err) {
            term.writeln(`\x1b[1;31mError connecting to Strapi backend: ${err.message}\x1b[0m`);
            term.write(`\x1b[1;32mresearcher@neuron\x1b[0m:\x1b[1;34m${cwdRef.current}\x1b[0m$ `);
          }
        } else {
          term.write(`\x1b[1;32mresearcher@neuron\x1b[0m:\x1b[1;34m${cwdRef.current}\x1b[0m$ `);
        }
        
        currentCommand = '';
      } 
      // Backspace
      else if (data === '\x7f') {
        if (currentCommand.length > 0) {
          currentCommand = currentCommand.slice(0, -1);
          term.write('\b \b');
        }
      } 
      // Arrow keys or other control characters (ignore for simple mock)
      else if (data < String.fromCharCode(32) && data !== '\r' && data !== '\t') {
        return;
      }
      // Normal characters
      else {
        currentCommand += data;
        term.write(data);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []); // Only run once on mount

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-800 shadow-2xl relative">
      <div className="h-10 bg-[#161616] border-b border-gray-800 flex items-center px-4 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="mx-auto text-xs font-mono text-gray-400">researcher@neuron-pro-instance: ~</div>
      </div>
      <div className="flex-1 p-2 overflow-hidden" ref={terminalRef}></div>
    </div>
  );
}
