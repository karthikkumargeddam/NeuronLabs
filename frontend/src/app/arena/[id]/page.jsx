import Link from 'next/link';
import { fetchAPI } from '../../../lib/api';
import { Trophy, Code2, Star, Zap, Clock, Users, ArrowLeft, Target, Award } from 'lucide-react';
import GlobalNav from "@/components/GlobalNav";
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Arena Challenge #${id} | NeuronLabs`,
    description: 'Solve research challenges and earn bounty points.',
  };
}

async function getChallenge(id) {
  try {
    const response = await fetchAPI(`/api/arena-challenges?filters[documentId][$eq]=${id}`, { populate: '*' });
    if (response?.data && response.data.length > 0) {
      return response.data[0];
    }
  } catch (e) {
    console.error("Failed to fetch challenge", e);
  }
  
  // Fallback mocks
  const mocks = [
    {
      id: 'mock-1',
      title: 'Optimize the Spiking Neural Network',
      difficulty: 'Expert',
      bounty_points: 500,
      description: 'Reduce the memory footprint of our simulated 1-million neuron SNN by 40% without losing spike accuracy.\n\nSpiking Neural Networks (SNNs) are promising for low-power AI, but scaling them to millions of neurons requires massive memory bandwidth. Your task is to implement a sparse representation technique that compresses the synaptic weight matrices while maintaining at least 95% of the original classification accuracy on the provided benchmark dataset.',
      requirements: ['Python 3.9+', 'PyTorch or NumPy', 'Memory constraint: < 2GB RAM'],
      deadline: '7 Days',
      solvers: 12
    },
    {
      id: 'mock-2',
      title: 'Quantum Error Correction Algorithm',
      difficulty: 'Hard',
      bounty_points: 350,
      description: 'Implement a Shor code to correct phase-flip errors in the provided 9-qubit quantum state simulation.\n\nQuantum bits (qubits) are highly susceptible to environmental noise. You must write a quantum circuit simulation that applies the 9-qubit Shor code to detect and correct single-qubit phase-flip errors without collapsing the superposition of the data qubits.',
      requirements: ['Qiskit or Cirq', 'Correctly identify syndrome measurements'],
      deadline: '14 Days',
      solvers: 4
    },
    {
      id: 'mock-3',
      title: 'Data Pipeline Vectorization',
      difficulty: 'Medium',
      bounty_points: 150,
      description: 'Rewrite the given pure Python loop for processing the 10GB astronomy dataset using numpy vectorization.\n\nOur current data ingestion pipeline uses vanilla Python nested for-loops to filter and normalize star coordinate data. It currently takes 45 minutes to run. Vectorize the mathematical operations using NumPy to bring the execution time under 30 seconds.',
      requirements: ['NumPy', 'Pandas', 'Execution time < 30s'],
      deadline: '3 Days',
      solvers: 142
    }
  ];

  return mocks.find(m => m.id === id) || null;
}

export default async function ArenaChallengeDetail({ params }) {
  const { id } = await params;
  const challenge = await getChallenge(id);

  if (!challenge) {
    notFound();
  }

  const attrs = challenge.attributes || challenge;

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-amber-500/30">
      <GlobalNav />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <Link href="/arena" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-8 font-mono text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Arena
        </Link>
        
        <div className="glass-panel p-8 md:p-12 relative overflow-hidden border border-amber-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 mix-blend-overlay filter blur-[100px] opacity-10 pointer-events-none"></div>
          
          <div className="flex flex-wrap gap-4 mb-6 relative z-10">
            <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              {attrs.difficulty || 'Medium'}
            </div>
            <div className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20">
              <Star className="w-4 h-4 fill-current" />
              {attrs.bounty_points || 100} PTS
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-mono text-sm px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <Clock className="w-4 h-4" />
              {attrs.deadline || 'No Deadline'}
            </div>
            <div className="flex items-center gap-2 text-gray-400 font-mono text-sm px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <Users className="w-4 h-4" />
              {attrs.solvers || 0} Solvers
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight relative z-10">
            {attrs.title}
          </h1>
          
          <div className="prose prose-invert prose-amber max-w-none relative z-10 mb-12">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-amber-500" /> Objective
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {attrs.description}
            </p>

            {attrs.requirements && (
              <>
                <h3 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" /> Requirements
                </h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-2">
                  {attrs.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10 relative z-10">
            <Link 
              href={`/code-editor?challengeId=${id}`} 
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-lg transition-colors flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
            >
              <Code2 className="w-6 h-6" />
              Start Challenge in Code Editor
            </Link>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-lg transition-colors border border-white/10">
              Join Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
