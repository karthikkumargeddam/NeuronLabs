import Link from 'next/link';
import { fetchAPI } from '../../lib/api';
import { Suspense } from 'react';
import { Trophy, Code2, BrainCircuit, Star, Zap } from 'lucide-react';

async function ArenaChallenges() {
  let challenges = [];
  try {
    const response = await fetchAPI('/api/arena-challenges', { populate: '*' }, { next: { revalidate: 60 } });
    challenges = response?.data || [];
  } catch (e) {
    console.error("Failed to fetch challenges", e);
  }

  // Fallback UI if Strapi hasn't populated yet
  if (challenges.length === 0) {
    challenges = [
      {
        id: 'mock-1',
        title: 'Optimize the Spiking Neural Network',
        difficulty: 'Expert',
        bounty_points: 500,
        description: 'Reduce the memory footprint of our simulated 1-million neuron SNN by 40% without losing spike accuracy.',
      },
      {
        id: 'mock-2',
        title: 'Quantum Error Correction Algorithm',
        difficulty: 'Hard',
        bounty_points: 350,
        description: 'Implement a Shor code to correct phase-flip errors in the provided 9-qubit quantum state simulation.',
      },
      {
        id: 'mock-3',
        title: 'Data Pipeline Vectorization',
        difficulty: 'Medium',
        bounty_points: 150,
        description: 'Rewrite the given pure Python loop for processing the 10GB astronomy dataset using numpy vectorization.',
      }
    ];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => {
        const attrs = challenge.attributes || challenge;
        const id = attrs.documentId || attrs.uuid || challenge.id;
        
        return (
          <div key={id} className="glass-panel p-6 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 mix-blend-overlay filter blur-[64px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                <Zap className="w-3 h-3" />
                {attrs.difficulty || 'Medium'}
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded">
                <Star className="w-4 h-4 fill-current" />
                {attrs.bounty_points || 100} PTS
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-3">{attrs.title}</h3>
            <p className="text-gray-400 text-sm flex-grow line-clamp-3">{attrs.description}</p>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#333] border-2 border-[#111] flex items-center justify-center text-xs text-gray-500">
                    U{i}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-[#222] border-2 border-[#111] flex items-center justify-center text-xs text-gray-500">
                  +42
                </div>
              </div>
              <Link href={`/labs/arena/${id}`} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded font-mono text-sm transition-colors flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Solve
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ArenaPage() {
  return (
    <div className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 border border-amber-500 bg-amber-500/10 text-amber-400 text-sm font-mono px-4 py-2 rounded-full mb-6">
          <Trophy className="w-4 h-4" />
          Global Bounties
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">The Research Arena</h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          Compete against the world's brightest minds. Solve complex computational challenges, optimize cutting-edge algorithms, and climb the global leaderboard.
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-amber-400 animate-pulse text-xl py-12">Loading Active Challenges...</div>}>
        <ArenaChallenges />
      </Suspense>
    </div>
  );
}
