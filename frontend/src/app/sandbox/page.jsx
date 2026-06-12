'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SandboxPage() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchLabs = async () => {
    setLoading(true);
    try {
      // Fetch from sandboxes instead of labs
      const res = await fetch('http://localhost:1337/api/sandboxes?pagination[limit]=200');
      if (!res.ok) throw new Error("Failed to fetch sandboxes");
      const data = await res.json();
      
      // Filter for advanced labs or just show all of them
      const labData = data.data.map(item => ({
        id: item.documentId,
        ...item
      }));
      setLabs(labData);
    } catch (err) {
      console.error(err);
      // Fallback dummy data if API fails to avoid breaking UI completely
      setLabs([
        { id: 1, title: 'Network Loading...', description: 'Please make sure backend is running' }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const filteredLabs = labs.filter(lab => 
    lab.title?.toLowerCase().includes(filter.toLowerCase()) || 
    lab.description?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 sm:text-5xl md:text-6xl tracking-tight">
            Advanced PhD Sandbox
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            GPU-Accelerated Interactive Research Environments for Deep Learning, Computer Vision, and Neural Networks.
          </p>
          <div className="mt-6">
            <input 
              type="text"
              placeholder="Search algorithms, architectures, models..."
              className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700 animate-pulse">
                 <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-4"></div>
                 <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-full mb-2"></div>
                 <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs.map((lab, index) => (
              <Link 
                href={`/sandbox/${lab.slug || lab.documentId}`}
                key={lab.id || index}
                className="block"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 cursor-pointer overflow-hidden flex flex-col h-full"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                        {lab.environment || 'gpu-cluster'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{lab.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {lab.description}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 mt-auto">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:text-indigo-500 flex items-center">
                      Launch Environment <span className="ml-1">→</span>
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
