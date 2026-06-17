import React, { Suspense } from 'react';
import { fetchAPI } from '../../lib/api';
import { Calendar, Users, Trophy, ChevronRight } from 'lucide-react';

async function HackathonsList() {
  let hackathons = [];
  try {
    const response = await fetchAPI('/api/hackathons', { populate: '*' }, { next: { revalidate: 60 } });
    hackathons = response?.data || [];
  } catch (e) {
    console.error("Failed to fetch hackathons", e);
  }

  if (hackathons.length === 0) {
    hackathons = [
      {
        id: 'mock-h1',
        title: 'Global LLM Optimization Challenge',
        description: 'Compress and optimize open-source LLMs to run efficiently on edge devices. $50k prize pool.',
        date: 'Oct 15 - Nov 1, 2026',
        participants: 1205,
        prize: '$50,000',
        status: 'Upcoming'
      },
      {
        id: 'mock-h2',
        title: 'Quantum ML Hackathon',
        description: 'Build hybrid quantum-classical machine learning algorithms using Qiskit and PyTorch.',
        date: 'Currently Active',
        participants: 450,
        prize: '$25,000',
        status: 'Active'
      },
      {
        id: 'mock-h3',
        title: 'Climate Data Forecasting',
        description: 'Predict extreme weather events using geospatial data and deep learning architectures.',
        date: 'Completed',
        participants: 890,
        prize: '$10,000',
        status: 'Completed'
      }
    ];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {hackathons.map((event) => {
        const attrs = event.attributes || event;
        const id = attrs.documentId || attrs.uuid || event.id;
        
        return (
          <div key={id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
            <div className={`h-2 w-full ${attrs.status === 'Active' ? 'bg-green-500' : attrs.status === 'Upcoming' ? 'bg-indigo-500' : 'bg-gray-500'}`}></div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${attrs.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : attrs.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {attrs.status || 'Upcoming'}
                </span>
                <span className="flex items-center text-sm font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                  <Trophy className="w-4 h-4 mr-1" />
                  {attrs.prize || '$0'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {attrs.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                {attrs.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {attrs.date || 'TBA'}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {attrs.participants || 0} Participants
                </div>
              </div>
              
              <button className="w-full mt-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                {attrs.status === 'Completed' ? 'View Results' : 'Join Hackathon'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HackathonsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030303] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl tracking-tight relative z-10">
            Hackathons & Live Events
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto relative z-10">
            Join global, time-bound coding events. Collaborate, build, and win prizes.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-indigo-400 animate-pulse text-xl py-12">Loading Hackathons...</div>}>
          <HackathonsList />
        </Suspense>
      </div>
    </div>
  );
}
