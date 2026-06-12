import Link from 'next/link';
import { fetchAPI } from '../../../lib/api';

export default async function AdvancedLabsPage() {
  const response = await fetchAPI('/api/labs', { populate: '*', pagination: { limit: 200 } }, { cache: 'no-store' });
  const backendLabs = response?.data || [];
  
  const advancedLabsFromBackend = backendLabs.filter(lab => {
    const attrs = lab.attributes || lab;
    // Assume labs might have an isAdvanced flag, or level set to Post-Doctoral/MIT Standard
    return attrs.isAdvanced === true || attrs.level === 'Post-Doctoral' || attrs.level === 'MIT Standard';
  });

  const fallbackTopics = [
    {
      id: 'mit-quantum',
      title: 'Quantum Computing Dynamics',
      level: 'Post-Doctoral',
      description: 'MIT-standard lab on quantum entanglement and superposition. Simulate quantum circuits with real-time noise models and decoherence tracking.',
      status: 'Online',
    },
    {
      id: 'mit-neuro',
      title: 'Neural Network Architectures',
      level: 'PhD',
      description: 'Advanced spiking neural networks and neuromorphic computing architectures. Design and train large-scale brain-like networks.',
      status: 'Online',
    },
    {
      id: 'mit-fusion',
      title: 'Plasma Fusion Reactors',
      level: 'Post-Doctoral',
      description: 'Simulate magnetic confinement and plasma dynamics in tokamak reactors. Analyze heating methods and plasma instabilities.',
      status: 'Online',
    },
    {
      id: 'mit-synthetic',
      title: 'Synthetic Biology & Genomics',
      level: 'PhD',
      description: 'Design synthetic gene circuits and edit genomes using CRISPR-Cas9 models. Predict protein folding using advanced AI tools.',
      status: 'Online',
    },
    {
      id: 'mit-fluid',
      title: 'Computational Fluid Dynamics',
      level: 'Post-Doctoral',
      description: 'Massive 3D turbulence and fluid dynamics simulations. Render high-fidelity particle grids in real-time.',
      status: 'Online',
    }
  ];

  const labsToDisplay = advancedLabsFromBackend.length > 0 ? advancedLabsFromBackend.map(lab => {
    const attrs = lab.attributes || lab;
    return {
      id: attrs.uuid || lab.id,
      title: attrs.title,
      level: attrs.level || 'Post-Doctoral',
      description: attrs.description,
      status: 'Online',
    };
  }) : fallbackTopics;

  return (
    <div className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-12 text-center">
        <div className="inline-block border border-[var(--accent)] bg-[rgba(244,63,94,0.1)] text-[var(--accent)] text-sm font-mono px-4 py-2 rounded-full mb-6">
          MIT Standard
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Most Highly Advanced Labs</h1>
        <p className="text-xl text-gray-400">Explore our most advanced topics and cutting-edge research environments.</p>
      </div>

      <div className="mb-8 flex justify-center">
        <Link href="/labs" className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-400 transition-all">
          &larr; Back to All Labs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {labsToDisplay.map((lab) => (
          <Link href={`/labs/${lab.id}`} key={lab.id}>
            <div className="glass-panel p-8 h-full hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600 mix-blend-overlay filter blur-[64px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              
              <div className="inline-block border border-purple-500 bg-purple-500/10 text-purple-400 text-xs font-mono px-3 py-1 rounded-full mb-4 self-start">
                {lab.level} Environment
              </div>
              <h3 className="text-2xl font-bold mb-3">{lab.title}</h3>
              <p className="text-gray-300 text-base flex-grow">{lab.description}</p>
              
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Status: {lab.status}
                </div>
                <div className="text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                  Enter Lab &rarr;
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
