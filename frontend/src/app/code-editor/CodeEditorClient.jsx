"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import toast from 'react-hot-toast';
import { Bot, Users, X, Send, Play, Save } from 'lucide-react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

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
  { id: 'r', name: 'R', defaultCode: '# Hello World in R\nprint("Hello, World!")\n\n# Data Visualization Example\nx <- c(1, 2, 3, 4, 5)\ny <- c(2, 4, 6, 8, 10)\nplot(x, y, main="My Plot")' },
];

export default function CodeEditorClient({ initialChallengeId }) {
  const { data: session } = useSession();
  const [language, setLanguage] = useState(TOP_LANGUAGES[0].id);
  const [code, setCode] = useState(TOP_LANGUAGES[0].defaultCode);
  const [title, setTitle] = useState('My Snippet');
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [savedSnippets, setSavedSnippets] = useState([]);

  // AI Tutor State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([{ role: 'assistant', content: 'Hello! I am your AI Tutor. How can I help you with your code today?' }]);
  const [aiInput, setAiInput] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  // Live Share State
  const [isLiveShare, setIsLiveShare] = useState(false);
  const [roomId, setRoomId] = useState('');
  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const ydocRef = useRef(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchSnippets();
    }
  }, [session]);

  useEffect(() => {
    if (initialChallengeId) {
      fetchChallenge(initialChallengeId);
    }
  }, [initialChallengeId]);

  const fetchChallenge = async (id) => {
    try {
      // API call to arena-challenges
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/arena-challenges?filters[documentId][$eq]=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.data && data.data.length > 0) {
          const challenge = data.data[0];
          setTitle(challenge.title || 'Arena Challenge');
          
          let newCode = `/*\n  CHALLENGE: ${challenge.title}\n  ${challenge.description || ''}\n*/\n\n`;
          if (challenge.starterCode) {
            newCode += challenge.starterCode;
          } else {
            newCode += TOP_LANGUAGES.find(l => l.id === language)?.defaultCode || '';
          }
          setCode(newCode);
          toast.success("Challenge loaded successfully!");
        } else {
          // Check mock fallback if it's mock-1, mock-2, etc.
          if (id.startsWith('mock-')) {
             setTitle('Mock Challenge');
             setCode(`/*\n  Mock Challenge ID: ${id}\n  Solve the challenge!\n*/\n\n`);
             toast.success("Loaded mock challenge");
          } else {
             toast.error("Challenge not found.");
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch challenge details.");
    }
  };

  const fetchSnippets = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/code-snippets?filters[userEmail][$eq]=${session.user.email}&sort=createdAt:desc`);
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

    if (isLiveShare && ydocRef.current) {
      ydocRef.current.getMap('state').set('language', newLangId);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/code-snippets`, {
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
    setOutput("Running via Judge0 CE Cloud Execution...\n");
    
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      
      const data = await res.json();
      if (res.ok) {
        let finalOutput = '';
        if (data.output) finalOutput += data.output;
        const finalResult = finalOutput.trim() || "Program exited with no output.";
        setOutput(finalResult);
        if (isLiveShare && ydocRef.current) ydocRef.current.getMap('state').set('output', finalResult);
      } else {
        setOutput(data.error || "Execution error.");
        if (isLiveShare && ydocRef.current) ydocRef.current.getMap('state').set('output', data.error || "Execution error.");
      }
    } catch (err) {
      setOutput(`Failed to connect to execution engine.\n${err.message}`);
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

  // --- AI Tutor Methods ---
  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMessage = { role: 'user', content: aiInput };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setIsAILoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          code,
          language,
          error: output.includes('Error') || output.includes('Exception') ? output : null
        })
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.reply || "Sorry, I couldn't process that." }]);
    } catch (err) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: "Connection to AI engine failed." }]);
    } finally {
      setIsAILoading(false);
    }
  };

  // --- Live Share Methods ---
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const toggleLiveShare = () => {
    if (isLiveShare) {
      // Disconnect
      if (providerRef.current) {
        providerRef.current.disconnect();
        providerRef.current = null;
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
        ydocRef.current = null;
      }
      setIsLiveShare(false);
      setRoomId('');
      toast.success("Disconnected from Live Share");
    } else {
      // Connect
      const newRoomId = prompt("Enter a Room ID to join, or leave blank to create a new one:") || `neuronlabs-${Math.floor(Math.random()*10000)}`;
      setRoomId(newRoomId);
      
      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;
      
      // Connect to the Strapi Backend WebSocket Server instead of public demo
      const wsUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337').replace(/^http/, 'ws') + '/yjs';
      const provider = new WebsocketProvider(wsUrl, newRoomId, ydoc);
      providerRef.current = provider;

      // Set up Presence/Awareness (Remote Cursors & Names)
      const userColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      const userName = session?.user?.username || session?.user?.name || 'Anonymous';
      provider.awareness.setLocalStateField('user', {
        name: userName,
        color: userColor
      });

      // Set up Global State Sync (Language and Terminal Output)
      const ystate = ydoc.getMap('state');
      ystate.observe(event => {
        event.changes.keys.forEach((change, key) => {
          if (key === 'language') {
            setLanguage(ystate.get('language'));
          } else if (key === 'output') {
            setOutput(ystate.get('output'));
          }
        });
      });

      const type = ydoc.getText('monaco');
      
      if (editorRef.current) {
        new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
      }

      setIsLiveShare(true);
      toast.success(`Connected to room: ${newRoomId}`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] mt-[80px] w-full bg-[#0a0a0a] text-sm font-mono text-gray-300">
      
      {/* Sidebar: Saved Snippets */}
      <div className="hidden lg:flex w-64 bg-[#0c0c0c] flex-col border-r border-gray-800 shrink-0 overflow-hidden">
        <div className="p-4 border-b border-gray-800/80 font-bold text-gray-100 flex items-center justify-between bg-[#111]">
          <h3 className="tracking-wide">Snippets</h3>
          <span className="text-xs bg-cyan-900/40 border border-cyan-800 text-cyan-400 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.2)]">
            {savedSnippets.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {!session && (
            <div className="p-4 text-xs text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center leading-relaxed">
              Please sign in to save snippets.
            </div>
          )}
          {session && savedSnippets.length === 0 && (
            <div className="p-4 text-xs text-gray-500 text-center italic border border-dashed border-gray-800 rounded-lg">
              No snippets saved yet.
            </div>
          )}
          {savedSnippets.map(snippet => (
            <div 
              key={snippet.documentId || snippet.id} 
              onClick={() => loadSnippet(snippet)}
              className="p-3 bg-[#161616] border border-gray-800 rounded-lg cursor-pointer hover:border-cyan-500/60 hover:bg-[#1a1a1a] transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-800 group-hover:bg-cyan-500 transition-colors"></div>
              <div className="font-bold text-cyan-400/90 truncate group-hover:text-cyan-300 ml-1 text-sm">{snippet.title}</div>
              <div className="flex justify-between items-center mt-3 ml-1">
                <span className="text-[10px] px-2 py-0.5 bg-[#222] border border-gray-700 text-gray-300 rounded uppercase tracking-wider font-semibold">
                  {snippet.language}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-800 bg-[#111] shrink-0">
          <div className="flex items-center gap-3">
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
              className="bg-[#1a1a1a] border border-gray-700 rounded px-2 py-1.5 text-gray-300 focus:outline-none focus:border-emerald-500 text-sm cursor-pointer"
            >
              {TOP_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Live Share Button */}
            <button 
              onClick={toggleLiveShare}
              className={`px-3 py-1.5 border rounded transition-all font-bold text-xs flex items-center gap-2 ${
                isLiveShare 
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500 hover:text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                  : "bg-gray-800/50 text-gray-400 border-gray-700 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              {isLiveShare ? `Room: ${roomId}` : "Live Share"}
            </button>

            {/* AI Tutor Button */}
            <button 
              onClick={() => setIsAIOpen(!isAIOpen)}
              className={`px-3 py-1.5 border rounded transition-all font-bold text-xs flex items-center gap-2 ${
                isAIOpen 
                  ? "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.4)]" 
                  : "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30 hover:bg-fuchsia-500 hover:text-white"
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Co-Pilot
            </button>

            <button 
              onClick={handleRun} 
              disabled={isRunning}
              className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/50 hover:bg-blue-500 hover:text-white rounded transition-all font-bold disabled:opacity-50 text-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              {isRunning ? "Running..." : "Run"}
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-black rounded transition-all font-bold disabled:opacity-50 text-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative flex overflow-hidden">
          <div className="flex-1 relative min-h-0 min-w-0">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onMount={handleEditorDidMount}
              onChange={(value) => {
                // Yjs binding handles syncing, but we keep local state synced if not live sharing
                if (!isLiveShare) setCode(value || '');
              }}
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

          {/* AI Chat Pane */}
          {isAIOpen && (
            <div className="w-80 border-l border-gray-800 bg-[#0c0c0c] flex flex-col shrink-0 animate-fade-in">
              <div className="p-3 border-b border-gray-800 bg-[#111] flex items-center justify-between">
                <div className="flex items-center gap-2 text-fuchsia-400 font-bold">
                  <Bot className="w-5 h-5" />
                  AI Tutor
                </div>
                <button onClick={() => setIsAIOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {aiMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-fuchsia-600 text-white rounded-br-none' 
                        : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isAILoading && (
                  <div className="flex items-start">
                    <div className="bg-gray-800 text-gray-200 p-3 rounded-xl rounded-bl-none border border-gray-700 text-xs flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-800 bg-[#111]">
                <form onSubmit={handleAISubmit} className="flex gap-2">
                  <input 
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask about your code..."
                    className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-fuchsia-500 text-white"
                  />
                  <button type="submit" disabled={isAILoading || !aiInput.trim()} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Output Console Pane */}
        <div className="h-48 border-t border-gray-800 bg-[#050505] flex flex-col shrink-0">
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
            {output ? (
              output.includes('NEURON_IMAGE:') ? (
                <div className="flex flex-col gap-4">
                  <span>{output.split('NEURON_IMAGE:')[0]}</span>
                  <img 
                    src={output.split('NEURON_IMAGE:')[1].trim()} 
                    alt="Execution Plot" 
                    className="max-w-full md:max-w-[600px] rounded shadow-lg border border-gray-700 bg-white" 
                  />
                </div>
              ) : (
                <span>{output}</span>
              )
            ) : (
              <span className="text-gray-600 italic">No output yet. Click 'Run' to execute code.</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
