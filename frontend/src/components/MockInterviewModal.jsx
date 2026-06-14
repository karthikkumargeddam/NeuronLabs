"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Volume2, User, Bot, Loader2 } from 'lucide-react';

export default function MockInterviewModal({ isOpen, onClose, code }) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const speak = useCallback((text) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices.find(v => v.lang === "en-US");
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      synthRef.current.speak(utterance);
    }
  }, []);

  const startInterview = useCallback(async () => {
    setIsAiThinking(true);
    try {
      const res = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, answer: null })
      });
      const data = await res.json();
      setChatLog([{ role: 'interviewer', content: data.reply }]);
      speak(data.reply);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiThinking(false);
    }
  }, [code, speak]);

  const handleUserResponse = useCallback(async (answer) => {
    const newLog = [...chatLog, { role: 'user', content: answer }];
    setChatLog(newLog);
    setIsAiThinking(true);
    
    try {
      const res = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, answer })
      });
      const data = await res.json();
      setChatLog([...newLog, { role: 'interviewer', content: data.reply }]);
      speak(data.reply);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiThinking(false);
    }
  }, [chatLog, code, speak]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (transcript.trim()) {
            handleUserResponse(transcript);
            setTranscript("");
          }
        };
      }
    }
  }, [transcript, handleUserResponse]);

  useEffect(() => {
    if (isOpen && chatLog.length === 0) {
      requestAnimationFrame(() => startInterview());
    }
  }, [isOpen, chatLog.length, startInterview]);



  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-[600px] bg-[#050505] border border-[#333] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[70vh]">
        {/* Header */}
        <div className="bg-[#111] border-b border-[#333] p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-full border border-red-500/30">
              <Volume2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-wide uppercase">AI Mock Interview</h2>
              <p className="text-xs text-gray-400 font-mono">Simulated Technical Round</p>
            </div>
          </div>
          <button onClick={() => {
            synthRef.current?.cancel();
            recognitionRef.current?.stop();
            onClose();
          }} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Log */}
        <div className="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 font-mono text-sm">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'interviewer' ? 'bg-red-900/40 text-red-400 border border-red-500/30' : 'bg-[#222] text-gray-300 border border-[#444]'}`}>
                {msg.role === 'interviewer' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-xl max-w-[80%] leading-relaxed ${msg.role === 'interviewer' ? 'bg-[#111] border border-[#333] text-gray-200' : 'bg-blue-900/20 border border-blue-500/30 text-blue-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isAiThinking && (
             <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-red-900/40 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                 <Bot className="w-4 h-4" />
               </div>
               <div className="p-4 rounded-xl bg-[#111] border border-[#333] text-gray-200 w-24 flex justify-center items-center">
                 <Loader2 className="w-5 h-5 animate-spin text-red-500" />
               </div>
             </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-[#111] border-t border-[#333] p-6 shrink-0 flex flex-col items-center gap-4">
          <div className="text-center h-6">
            {transcript && <p className="text-sm text-gray-300 font-mono italic">&quot;{transcript}&quot;</p>}
            {!transcript && isListening && <p className="text-sm text-red-400 font-mono animate-pulse">Listening to your answer...</p>}
          </div>
          
          <button 
            onClick={toggleListen}
            disabled={isAiThinking}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] scale-110' 
                : 'bg-[#222] hover:bg-[#333] text-gray-300 border border-[#444] shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? <Mic className="w-8 h-8 animate-pulse" /> : <MicOff className="w-6 h-6" />}
          </button>
          <p className="text-xs text-gray-500 font-mono">Click to {isListening ? 'Stop' : 'Speak Answer'}</p>
        </div>
      </div>
    </div>
  );
}
