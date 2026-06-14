import Link from 'next/link';
import { fetchAPI } from '../../lib/api';
import { Suspense } from 'react';
import FeedbackWidget from '../../components/FeedbackWidget';

async function PhdResearchList() {
  const response = await fetchAPI('/api/labs', { 
    populate: '*', 
    sort: ['createdAt:desc'],
    pagination: { limit: 300 }
  }, { next: { revalidate: 60 } });
  
  // Filter in JS because Strapi SQLite $contains might be bugged
  let labs = response?.data || [];
  labs = labs.filter(lab => {
    const attrs = lab.attributes || lab;
    const name = attrs.name || '';
    return name.includes('lab');
  });

  if (labs.length === 0) {
    return (
      <div className="text-center p-12 text-gray-400 glass-panel">
        <p>No PhD research environments found. Please check your backend database.</p>
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
            <div className="glass-panel p-6 h-full hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col relative overflow-hidden border border-purple-500/30 bg-[#0a0a0a]/90 hover:bg-[#111]/90">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 mix-blend-overlay filter blur-[64px] opacity-20"></div>
              
              <div className="inline-block border border-purple-500/50 bg-purple-500/10 text-purple-400 text-xs font-mono px-3 py-1 rounded-full mb-4 self-start shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                Advanced PhD Research
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{attrs.title}</h3>
              <p className="text-gray-400 text-sm flex-grow line-clamp-3">{attrs.description}</p>
              
              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                VBox Status: Ready
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function PhdResearchPage() {
  return (
    <div className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto animate-fade-in mt-16">
      <div className="mb-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 relative z-10">Advanced PhD Research</h1>
        <p className="text-xl text-gray-400 relative z-10">Access exclusive, highly sophisticated environments for cutting-edge experiments.</p>
      </div>

      <Suspense fallback={<div className="text-center text-purple-400 animate-pulse text-xl py-12">Provisioning Secure PhD Clusters...</div>}>
        <PhdResearchList />
      </Suspense>

      <FeedbackWidget />
    </div>
  );
}
