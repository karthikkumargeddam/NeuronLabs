import React, { Suspense } from 'react';
import { fetchAPI } from '../../lib/api';
import { Code2, Target, DollarSign, Clock, ArrowRight } from 'lucide-react';

async function BountiesList() {
  let bounties = [];
  try {
    const response = await fetchAPI('/api/bounties', { populate: '*' }, { next: { revalidate: 60 } });
    bounties = response?.data || [];
  } catch (e) {
    console.error("Failed to fetch bounties", e);
  }

  if (bounties.length === 0) {
    bounties = [
      {
        id: 'mock-b1',
        title: 'Optimize TensorFlow Data Pipeline',
        company: 'NeuralOps Inc.',
        description: 'Our tf.data pipeline is bottlenecking our A100 cluster. We need an expert to rewrite the preprocessing steps using tf.function and XLA.',
        reward: '$2,500',
        deadline: '7 days',
        difficulty: 'Hard',
        skills: ['TensorFlow', 'Python', 'Performance']
      },
      {
        id: 'mock-b2',
        title: 'Implement Custom CUDA Kernel for Matrix Multiplications',
        company: 'QuantResearch',
        description: 'Looking for a C++/CUDA engineer to implement a specialized batched GEMM kernel for a novel hardware architecture.',
        reward: '$5,000',
        deadline: '14 days',
        difficulty: 'Expert',
        skills: ['CUDA', 'C++', 'Linear Algebra']
      },
      {
        id: 'mock-b3',
        title: 'Build API Wrapper for Open-Source Vision Model',
        company: 'AI Startup',
        description: 'Create a scalable FastAPI wrapper around the latest Segment Anything Model (SAM) with batching support.',
        reward: '$800',
        deadline: '3 days',
        difficulty: 'Medium',
        skills: ['FastAPI', 'PyTorch', 'Docker']
      }
    ];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {bounties.map((bounty) => {
        const attrs = bounty.attributes || bounty;
        const id = attrs.documentId || attrs.uuid || bounty.id;
        
        return (
          <div key={id} className="bg-[#111] rounded-2xl shadow-xl overflow-hidden border border-emerald-900/30 flex flex-col group hover:border-emerald-500/50 transition-colors duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{attrs.title}</h3>
                  <p className="text-gray-500 text-sm font-mono">{attrs.company}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="flex items-center text-lg font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {attrs.reward?.replace('$', '') || '1,000'}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                {attrs.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {attrs.deadline || '14 days left'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="w-4 h-4 mr-2 text-amber-400" />
                  {attrs.difficulty || 'Medium'}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(attrs.skills || []).map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-[#1a1a1a] text-gray-300 rounded-full text-xs font-mono border border-gray-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-auto border-t border-gray-800 bg-[#0a0a0a]">
              <button className="w-full p-4 flex items-center justify-center gap-2 text-emerald-400 hover:bg-emerald-400/10 font-bold transition-colors">
                Claim Bounty <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BountiesPage() {
  return (
    <div className="min-h-screen bg-[#030303] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight relative z-10">
            Bounties & Freelance Hub
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto relative z-10">
            Earn rewards by solving real-world ML tasks, optimizing codebases, and contributing to open-source AI.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-emerald-400 animate-pulse text-xl py-12">Loading Bounties...</div>}>
          <BountiesList />
        </Suspense>
      </div>
    </div>
  );
}
