import Link from 'next/link';
import { fetchAPI } from '../../lib/api';
import { Suspense } from 'react';

async function LabList() {
  const response = await fetchAPI('/api/labs', { populate: '*', pagination: { limit: 200 } }, { cache: 'no-store' });
  const labs = response?.data || [];

  if (labs.length === 0) {
    return (
      <div className="text-center p-12 text-gray-400 glass-panel">
        <p>No lab environments found. Check your Strapi backend.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {labs.map((lab) => {
        const attrs = lab.attributes || lab;
        const id = attrs.uuid || lab.id;
        
        return (
          <Link href={`/labs/${id}`} key={lab.id}>
            <div className="glass-panel p-6 h-full hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] mix-blend-overlay filter blur-[64px] opacity-20"></div>
              
              <div className="inline-block border border-[var(--accent)] bg-[rgba(244,63,94,0.1)] text-[var(--accent)] text-xs font-mono px-3 py-1 rounded-full mb-4 self-start">
                {attrs.level || 'PhD'} Environment
              </div>
              <h3 className="text-xl font-bold mb-2">{attrs.title}</h3>
              <p className="text-gray-400 text-sm flex-grow line-clamp-3">{attrs.description}</p>
              
              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[var(--secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse"></span>
                Status: Online
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function LabsPage() {
  return (
    <div className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Virtual Labs</h1>
        <p className="text-xl text-gray-400 mb-8">Access isolated, high-performance environments for hands-on research.</p>
        
        <div className="flex justify-center mb-8">
          <Link href="/labs/advanced" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            Explore Most Highly Advanced Labs (MIT Standard)
          </Link>
        </div>
      </div>

      <Suspense fallback={<div className="text-center text-[var(--accent)] animate-pulse text-xl py-12">Booting lab clusters...</div>}>
        <LabList />
      </Suspense>
    </div>
  );
}
