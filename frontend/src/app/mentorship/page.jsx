import React, { Suspense } from 'react';
import { fetchAPI } from '../../lib/api';
import { User, Star, Clock, Video, MessageSquare } from 'lucide-react';

async function MentorsList() {
  let mentors = [];
  try {
    const response = await fetchAPI('/api/mentors', { populate: '*' }, { next: { revalidate: 60 } });
    mentors = response?.data || [];
  } catch (e) {
    console.error("Failed to fetch mentors", e);
  }

  if (mentors.length === 0) {
    mentors = [
      {
        id: 'mock-m1',
        name: 'Dr. Sarah Chen',
        title: 'Senior AI Researcher @ DeepMind',
        bio: 'Specializing in Reinforcement Learning and Neural Architecture Search. Happy to help with PhD applications and architecture reviews.',
        rating: 4.9,
        reviews: 124,
        hourlyRate: '$150',
        tags: ['RL', 'Deep Learning', 'Career']
      },
      {
        id: 'mock-m2',
        name: 'James Rodriguez',
        title: 'Lead MLOps Engineer @ OpenAI',
        bio: 'I build the infrastructure that scales massive LLMs. Let us chat about Kubernetes, distributed training, and optimizing inference.',
        rating: 4.8,
        reviews: 89,
        hourlyRate: '$120',
        tags: ['MLOps', 'Distributed Systems', 'LLM']
      },
      {
        id: 'mock-m3',
        name: 'Dr. Emily Watson',
        title: 'Professor of Computer Science @ MIT',
        bio: 'Focusing on algorithmic fairness and interpretability. Available for thesis reviews, paper drafting, and academic guidance.',
        rating: 5.0,
        reviews: 42,
        hourlyRate: '$200',
        tags: ['Academia', 'Ethics', 'Interpretability']
      }
    ];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mentors.map((mentor) => {
        const attrs = mentor.attributes || mentor;
        const id = attrs.documentId || attrs.uuid || mentor.id;
        
        return (
          <div key={id} className="bg-[#111] rounded-2xl shadow-xl overflow-hidden border border-gray-800 flex flex-col group hover:border-blue-500/50 transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center border-2 border-blue-500/50">
                    <User className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{attrs.name}</h3>
                    <p className="text-blue-400 text-sm font-medium">{attrs.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span className="font-bold">{attrs.rating || '5.0'}</span>
                  <span className="text-gray-500 ml-1">({attrs.reviews || 0} reviews)</span>
                </div>
                <div className="text-gray-400 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {attrs.hourlyRate || '$100'}/hr
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                {attrs.bio}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(attrs.tags || []).map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs border border-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-auto p-4 border-t border-gray-800 bg-[#0a0a0a] flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition-colors">
                <Video className="w-4 h-4" /> Book Session
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-[#030303] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight relative z-10">
            Mentorship & 1-on-1 Sessions
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto relative z-10">
            Accelerate your career by learning directly from industry experts and leading researchers.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-blue-400 animate-pulse text-xl py-12">Loading Mentors...</div>}>
          <MentorsList />
        </Suspense>
      </div>
    </div>
  );
}
