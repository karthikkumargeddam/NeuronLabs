import GlobalNav from '@/components/GlobalNav';
import { Briefcase, MapPin, DollarSign, ArrowRight, Building, Search, Filter } from 'lucide-react';
import Image from 'next/image';

async function getJobs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}`}/api/jobs`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await getJobs();
  
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-purple-500/30 pb-20">
      <GlobalNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm text-purple-400 mb-6">
            <Briefcase className="w-4 h-4" />
            AI Talent Network
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            Shape the Future
          </h1>
          <p className="text-neutral-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Discover roles at the world's most innovative AI labs and tech companies. Your Neuron ranking gives you priority access.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search jobs, skills, or companies..." 
              className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-neutral-900/50 border border-white/10 text-white hover:bg-neutral-800 transition-colors">
            <Filter className="w-5 h-5 text-neutral-400" />
            Filters
          </button>
        </div>

        {/* Jobs List */}
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="group glass-panel rounded-3xl border border-white/5 bg-[#0a0a0a]/80 p-8 hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex items-start gap-6 z-10">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg p-2">
                  <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-neutral-400 mb-4">
                    <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {job.company}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-400" /> <span className="text-emerald-400">{job.salary}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-bold px-2 py-1 bg-white/10 text-white rounded-md border border-white/10">
                      {job.type}
                    </span>
                    {job.tags?.map(tag => (
                      <span key={tag} className="text-xs font-mono px-2 py-1 bg-purple-500/10 text-purple-300 rounded-md border border-purple-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="z-10 mt-4 md:mt-0">
                <a 
                  href={job.applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.company + ' ' + job.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-6 py-3 rounded-xl font-bold bg-[#0A66C2] text-white hover:bg-[#084e96] transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  Apply on LinkedIn
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
