'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import mermaid from 'mermaid';

const MermaidGraph = ({ chart }) => {
  const ref = useRef(null);
  const id = useId().replace(/:/g, '');
  
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid parsing error", err);
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-red-400 text-xs">${err.message}</pre>`;
        }
      }
    };
    if (chart) renderChart();
  }, [chart, id]);

  return <div ref={ref} className="w-full flex justify-center py-2" />;
};

export default function SandboxDetailPage() {
  const params = useParams();
  const { slug } = params;
  
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1500);
  };

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const res = await fetch(`http://localhost:1337/api/sandboxes?filters[slug][$eq]=${slug}`);
        if (!res.ok) throw new Error("Failed to fetch sandbox");
        const data = await res.json();
        
        if (data.data && data.data.length > 0) {
          setLab({
            id: data.data[0].documentId,
            ...data.data[0]
          });
        } else {
          // Fallback if slug wasn't matched but it matches documentId
          const resFallback = await fetch(`http://localhost:1337/api/sandboxes?filters[documentId][$eq]=${slug}`);
          const fallbackData = await resFallback.json();
          if (fallbackData.data && fallbackData.data.length > 0) {
            setLab({
              id: fallbackData.data[0].documentId,
              ...fallbackData.data[0]
            });
          } else {
            setError("Sandbox environment not found.");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Error loading sandbox details.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLab();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !lab) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error || "Sandbox not found"}</h2>
        <Link href="/sandbox" className="text-indigo-600 hover:text-indigo-500 underline">
          Return to Sandboxes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/sandbox" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-sm font-medium transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Sandboxes
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700"
        >
          <div className="p-8 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800">
            <div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 mb-3 inline-block">
                {lab.environment || 'gpu-cluster'}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lab.title}</h1>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors font-medium flex items-center group">
              <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Deploy to VirtualBox
            </button>
          </div>
          
          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Research Description
              </h3>
              <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-lg">{lab.description}</p>
            </div>
            
            {lab.code_content && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    Implementation Reference
                  </h3>
                  <button 
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center transition-colors ${
                      isRunning 
                        ? 'bg-indigo-600/50 text-indigo-200 cursor-wait' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow-indigo-500/20'
                    }`}
                  >
                    {isRunning ? (
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                    )}
                    {isRunning ? 'Running Simulation...' : 'Run Code'}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-xl p-5 overflow-x-auto border border-gray-700 shadow-inner">
                  <pre className="text-green-400 font-mono text-sm">
                    {lab.code_content}
                  </pre>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {lab.visualization && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                    Architecture Graph
                  </h3>
                  <div className="bg-slate-800/80 rounded-xl p-5 overflow-x-auto border border-slate-600 shadow-inner h-full min-h-[200px] flex items-center justify-center">
                    <MermaidGraph chart={lab.visualization} />
                  </div>
                </div>
              )}
              
              {lab.terminalOutput && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Execution Metrics
                  </h3>
                  <div className="bg-black rounded-xl p-5 overflow-x-auto border border-gray-700 shadow-inner h-full min-h-[200px]">
                    <pre className="text-blue-400 font-mono text-sm whitespace-pre-wrap">
                      {lab.terminalOutput}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
