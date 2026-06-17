"use client";

import { useState } from 'react';
import { Database, Download, Eye, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data distributions based on dataset titles
const getMockData = (title) => {
  if (title.includes('AlphaFold')) {
    return [
      { name: 'Human', count: 4000 },
      { name: 'Mouse', count: 3000 },
      { name: 'Yeast', count: 2000 },
      { name: 'E. Coli', count: 1500 },
    ];
  }
  if (title.includes('Climate')) {
    return [
      { name: '1990s', count: 350 },
      { name: '2000s', count: 420 },
      { name: '2010s', count: 500 },
      { name: '2020s', count: 580 },
    ];
  }
  return [
    { name: 'Category A', count: 1200 },
    { name: 'Category B', count: 2100 },
    { name: 'Category C', count: 800 },
    { name: 'Category D', count: 1500 },
  ];
};

export default function DatasetGridClient({ datasets }) {
  const [previewDataset, setPreviewDataset] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <div key={dataset.id} className="group relative glass-panel rounded-3xl border border-white/5 bg-[#0a0a0a]/80 p-8 hover:-translate-y-1 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${dataset.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-neutral-900 rounded-xl border border-white/5">
                  <Database className="w-6 h-6 text-neutral-300" />
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400 text-sm font-medium bg-neutral-900/50 px-2.5 py-1 rounded-full border border-white/5">
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  {dataset.downloads || "0"}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{dataset.title}</h3>
              <p className="text-neutral-400 text-sm mb-6 flex-grow leading-relaxed">{dataset.description}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex flex-wrap gap-2">
                  {(dataset.tags || []).map(tag => (
                    <span key={tag} className="text-xs font-mono px-2 py-1 bg-white/5 text-neutral-300 rounded-md border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                  <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5"/> {dataset.size || "Unknown"}</span>
                  <span>{dataset.format || "CSV/JSON"}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setPreviewDataset(dataset)}
                  className="flex-1 py-3 rounded-xl font-bold bg-neutral-800 border border-white/10 text-white hover:bg-neutral-700 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button className="flex-1 py-3 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all flex items-center justify-center gap-2 group/btn">
                  <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                  Mount
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 md:p-10 w-full max-w-3xl relative animate-in zoom-in-95 duration-200 shadow-2xl">
            <button 
              onClick={() => setPreviewDataset(null)}
              className="absolute top-6 right-6 p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-black mb-2 text-white">{previewDataset.title}</h2>
            <p className="text-neutral-400 mb-8">{previewDataset.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-neutral-900 rounded-2xl border border-white/5">
                <div className="text-xs text-neutral-500 font-mono mb-1">SIZE</div>
                <div className="text-xl font-bold text-white">{previewDataset.size}</div>
              </div>
              <div className="p-4 bg-neutral-900 rounded-2xl border border-white/5">
                <div className="text-xs text-neutral-500 font-mono mb-1">DOWNLOADS</div>
                <div className="text-xl font-bold text-cyan-400">{previewDataset.downloads}</div>
              </div>
              <div className="p-4 bg-neutral-900 rounded-2xl border border-white/5">
                <div className="text-xs text-neutral-500 font-mono mb-1">FORMAT</div>
                <div className="text-xl font-bold text-emerald-400">{previewDataset.format || 'CSV/JSON'}</div>
              </div>
              <div className="p-4 bg-neutral-900 rounded-2xl border border-white/5">
                <div className="text-xs text-neutral-500 font-mono mb-1">ROWS</div>
                <div className="text-xl font-bold text-purple-400">{(Math.random() * 10).toFixed(1)}M</div>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4 text-neutral-200">Data Distribution Preview</h3>
            <div className="h-64 w-full bg-neutral-900/50 rounded-2xl border border-white/5 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getMockData(previewDataset.title)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                  <YAxis stroke="#888" tick={{ fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button className="px-8 py-3 rounded-xl font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                Mount to Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
