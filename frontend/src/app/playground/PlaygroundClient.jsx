'use client';

import { useState } from 'react';
import { Bot, Sparkles, Send, Settings, Cpu, Zap, Activity } from 'lucide-react';

export default function PlaygroundClient({ models }) {
  const [selectedModel, setSelectedModel] = useState(models[0] || null);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `System Initialized. I am ${models[0]?.name || 'the AI'}, loaded and ready for inference. You can adjust generation parameters like Temperature and Top-P from the settings menu. How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !selectedModel) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/models/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, modelName: selectedModel.name })
      });
      
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not connect to the model." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Connection failed." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex h-full pt-16 w-full">
      {/* Sidebar - Models */}
      <div className="w-80 border-r border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col hidden md:flex z-10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            Available Models
          </h2>
          <p className="text-xs text-neutral-500">Live inference powered by Neuron Cloud.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {models.map((model, idx) => (
            <div 
              key={model.id || idx} 
              onClick={() => {
                setSelectedModel(model);
                setMessages([{ role: 'assistant', content: `Switched to ${model.name}. How can I assist you today?` }]);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedModel?.id === model.id ? 'border-rose-500/50 bg-rose-500/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-sm text-neutral-200">{model.name}</div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-400">
                  {model.task}
                </div>
              </div>
              <div className="text-xs text-neutral-500 mb-3">{model.architecture}</div>
              <div className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                {model.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Playground Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 via-[#030303] to-[#030303] pointer-events-none"></div>
        
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 z-10 bg-[#0a0a0a]/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-neutral-400" />
            <span className="font-medium text-neutral-200">{selectedModel?.name || 'Select a Model'}</span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </span>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 z-10">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-neutral-800' : 'bg-gradient-to-br from-rose-400 to-orange-500'}`}>
                {msg.role === 'user' ? <div className="w-4 h-4 bg-neutral-400 rounded-full" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`bg-white/5 border border-white/10 rounded-2xl p-4 max-w-2xl ${msg.role === 'user' ? 'bg-neutral-800/50' : ''}`}>
                <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-2xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-[#030303] z-10">
          <div className="max-w-4xl mx-auto relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your prompt..." 
              className="w-full bg-neutral-900/50 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-transparent transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 p-2 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-mono text-neutral-600">
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> A100 80GB</span>
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> 42 tok/s</span>
            <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> 340ms latency</span>
          </div>
        </div>
      </div>
    </div>
  );
}
