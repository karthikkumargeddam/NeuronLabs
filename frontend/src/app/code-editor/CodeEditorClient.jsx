"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import toast from 'react-hot-toast';

if (typeof window !== 'undefined') {
  loader.config({ monaco });
}

const TOP_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', defaultCode: 'console.log("Hello, World!");' },
  { id: 'python', name: 'Python', defaultCode: 'print("Hello, World!")' },
  { id: 'java', name: 'Java', defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}' },
  { id: 'c', name: 'C', defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
  { id: 'cpp', name: 'C++', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}' },
  { id: 'go', name: 'Go', defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
  { id: 'rust', name: 'Rust', defaultCode: 'fn main() {\n    println!("Hello, World!");\n}' },
  { id: 'ruby', name: 'Ruby', defaultCode: 'puts "Hello, World!"' },
  { id: 'php', name: 'PHP', defaultCode: '<?php\n  echo "Hello, World!";\n?>' },
  { id: 'csharp', name: 'C#', defaultCode: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' },
  { id: 'swift', name: 'Swift', defaultCode: 'print("Hello, World!")' },
];

export default function CodeEditorClient() {
  const { data: session } = useSession();
  const [language, setLanguage] = useState(TOP_LANGUAGES[0].id);
  const [code, setCode] = useState(TOP_LANGUAGES[0].defaultCode);
  const [title, setTitle] = useState('My Snippet');
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [savedSnippets, setSavedSnippets] = useState([]);

  // Fetch user's saved snippets
  useEffect(() => {
    if (session?.user?.email) {
      fetchSnippets();
    }
  }, [session]);

  const fetchSnippets = async () => {
    try {
      const res = await fetch(`http://localhost:1337/api/code-snippets?filters[userEmail][$eq]=${session.user.email}&sort=createdAt:desc`);
      const data = await res.json();
      if (data && data.data) {
        setSavedSnippets(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch snippets", err);
    }
  };

  const handleLanguageChange = (e) => {
    const newLangId = e.target.value;
    setLanguage(newLangId);
    const langObj = TOP_LANGUAGES.find(l => l.id === newLangId);
    if (langObj) {
      setCode(langObj.defaultCode);
    }
  };

  const handleSave = async () => {
    if (!session) {
      toast.error("Please sign in to save snippets.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please provide a title for the snippet.");
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:1337/api/code-snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            title: title.trim(),
            language,
            code,
            userEmail: session.user.email
          }
        })
      });

      if (res.ok) {
        toast.success("Snippet saved successfully!");
        fetchSnippets();
      } else {
        const errData = await res.json();
        console.error("Save error:", errData);
        toast.error("Failed to save snippet.");
      }
    } catch (error) {
      toast.error("Error connecting to backend.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running locally...\n");
    
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        let finalOutput = '';
        if (data.output) finalOutput += data.output;
        if (data.error) finalOutput += (finalOutput ? '\n' : '') + data.error;
        setOutput(finalOutput.trim() || "Program exited with no output.");
      } else {
        setOutput(data.error || "Execution error.");
      }
    } catch (err) {
      setOutput(`Failed to connect to local execution engine.\n${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const loadSnippet = (snippet) => {
    setTitle(snippet.title);
    setLanguage(snippet.language);
    setCode(snippet.code);
    toast.success("Loaded snippet!");
  };

  return (
    <div className="flex h-full flex-col lg:flex-row bg-[#0a0a0a] text-sm font-mono text-gray-300">
      
      {/* Editor & Output Section */}
      <div className="flex-1 flex flex-col border-r border-gray-800 h-[600px] lg:h-auto overflow-hidden">
        {/* Toolbar */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-800 bg-[#111] backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border border-gray-700 rounded px-3 py-1.5 text-cyan-400 focus:outline-none focus:border-cyan-500 w-32 md:w-48 text-sm placeholder:text-gray-600 transition-colors"
              placeholder="Snippet Title"
            />
            <select 
              value={language} 
              onChange={handleLanguageChange}
              className="bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1.5 text-gray-300 focus:outline-none focus:border-emerald-500 text-sm cursor-pointer transition-colors hover:bg-[#222]"
            >
              {TOP_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRun} 
              disabled={isRunning}
              className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/50 hover:bg-blue-500 hover:text-white rounded transition-all font-bold disabled:opacity-50 text-sm whitespace-nowrap flex items-center gap-2"
            >
              {isRunning ? "Running..." : "▶ Run"}
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black rounded transition-all font-bold disabled:opacity-50 text-sm whitespace-nowrap flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "💾 Save"}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative min-h-[300px]">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              fontFamily: "'Geist Mono', monospace",
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              roundedSelection: false,
              cursorStyle: 'line-thin',
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output Console Pane */}
        <div className="h-48 md:h-64 border-t border-gray-800 bg-[#050505] flex flex-col shrink-0">
          <div className="px-4 py-2 border-b border-gray-800 bg-[#0f0f0f] flex items-center justify-between">
            <span className="font-bold text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              Output Console
            </span>
            <button 
              onClick={() => setOutput('')} 
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors bg-gray-800/50 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap text-green-400 custom-scrollbar">
            {output || <span className="text-gray-600 italic">No output yet. Click 'Run' to execute code.</span>}
          </div>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="w-full lg:w-72 bg-[#0c0c0c] flex flex-col h-64 lg:h-auto border-t lg:border-t-0 border-gray-800 shrink-0">
        <div className="p-4 border-b border-gray-800/80 font-bold text-gray-100 flex items-center justify-between bg-[#111]">
          <h3 className="tracking-wide">Saved Snippets</h3>
          <span className="text-xs bg-cyan-900/40 border border-cyan-800 text-cyan-400 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.2)]">
            {savedSnippets.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {!session && (
            <div className="p-4 text-xs text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center leading-relaxed">
              Please sign in to view and save your practice snippets.
            </div>
          )}
          {session && savedSnippets.length === 0 && (
            <div className="p-4 text-xs text-gray-500 text-center italic border border-dashed border-gray-800 rounded-lg">
              No snippets saved yet. Write some code and hit Save!
            </div>
          )}
          {savedSnippets.map(snippet => (
            <div 
              key={snippet.documentId || snippet.id} 
              onClick={() => loadSnippet(snippet)}
              className="p-3 bg-[#161616] border border-gray-800 rounded-lg cursor-pointer hover:border-cyan-500/60 hover:bg-[#1a1a1a] hover:shadow-[0_0_12px_rgba(34,211,238,0.1)] transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-800 group-hover:bg-cyan-500 transition-colors"></div>
              <div className="font-bold text-cyan-400/90 truncate group-hover:text-cyan-300 ml-1 text-sm">{snippet.title}</div>
              <div className="flex justify-between items-center mt-3 ml-1">
                <span className="text-[10px] px-2 py-0.5 bg-[#222] border border-gray-700 text-gray-300 rounded uppercase tracking-wider font-semibold">
                  {snippet.language}
                </span>
                <span className="text-[10px] text-gray-500">
                  {new Date(snippet.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
