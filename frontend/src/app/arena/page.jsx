import React from 'react';
import GlobalNav from '@/components/GlobalNav';
import { Trophy, Flame, Users, Clock, ArrowUpRight, Crown, ChevronRight, Activity, Terminal } from 'lucide-react';

async function getCompetitions() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/competitions`, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch competitions:', error);
    return [];
  }
}

const topHackers = [
  { rank: 2, name: 'AlexTheAI', score: '98.4%', badge: 'Grandmaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', color: 'text-slate-300' },
  { rank: 1, name: 'NeuralNinja', score: '99.1%', badge: 'Legend', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja', color: 'text-amber-400' },
  { rank: 3, name: 'DataQueen', score: '97.8%', badge: 'Master', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Queen', color: 'text-orange-400' }
];

export default async function ArenaPage() {
  const competitions = await getCompetitions();
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-cyan-500/30">
      <GlobalNav />
      
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            <Flame className="w-4 h-4" /> Live Season 4
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-500 to-purple-600">Arena</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Compete in global data science challenges, climb the leaderboards, and win massive prizes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Active Competitions - Spans 2 cols */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" /> Active Competitions
              </h2>
              <button className="text-neutral-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {competitions.map((comp) => (
                <div key={comp.id} className="group relative glass-panel rounded-3xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all duration-300">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl bg-gradient-to-b ${comp.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${comp.color} bg-opacity-10 shadow-inner`}>
                        {comp.iconStr === 'Terminal' ? <Terminal className="w-8 h-8 text-white" /> :
                         comp.iconStr === 'Flame' ? <Flame className="w-8 h-8 text-white" /> :
                         <Activity className="w-8 h-8 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{comp.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {comp.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs font-mono rounded bg-white/5 text-neutral-300 border border-white/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-neutral-400">
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {comp.participants} teams</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {comp.daysLeft} days left</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-center">
                      <div className="text-3xl font-black text-white tracking-tight mb-3">{comp.prize}</div>
                      <button className="px-6 py-2 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2">
                        Enter <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Leaderboard - Spans 1 col */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Crown className="w-6 h-6 text-amber-400" /> Global Top 3
            </h2>

            {/* Podium Design */}
            <div className="glass-panel rounded-3xl border border-white/5 bg-[#0a0a0a]/80 p-8 flex items-end justify-center gap-4 h-[350px] relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-[60px]"></div>

              {topHackers.map((hacker) => (
                <div key={hacker.rank} className="flex flex-col items-center relative z-10 w-1/3">
                  {/* Floating Avatar */}
                  <div className="mb-4 relative group">
                    <div className={`absolute -inset-1 rounded-full opacity-50 blur group-hover:opacity-100 transition duration-500 
                      ${hacker.rank === 1 ? 'bg-amber-400' : hacker.rank === 2 ? 'bg-slate-300' : 'bg-orange-400'}`}></div>
                    <img src={hacker.avatar} alt={hacker.name} className="relative w-16 h-16 rounded-full border-2 border-neutral-900 bg-neutral-800" />
                    {hacker.rank === 1 && (
                      <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-6 text-amber-400 animate-bounce" />
                    )}
                  </div>
                  
                  {/* Podium Block */}
                  <div className={`w-full rounded-t-xl flex flex-col items-center pt-4 border-t border-l border-r border-white/10
                    ${hacker.rank === 1 ? 'h-40 bg-gradient-to-t from-amber-500/20 to-amber-500/5' : 
                      hacker.rank === 2 ? 'h-32 bg-gradient-to-t from-slate-400/20 to-slate-400/5' : 
                                          'h-24 bg-gradient-to-t from-orange-500/20 to-orange-500/5'}`}>
                    <span className={`text-2xl font-black ${hacker.color}`}>#{hacker.rank}</span>
                    <span className="text-sm font-bold text-white mt-2 truncate w-full text-center px-2">{hacker.name}</span>
                    <span className="text-xs font-mono text-cyan-400 mt-1">{hacker.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Feed */}
            <div className="glass-panel rounded-3xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" /> Live Feed
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2"></div>
                    <div>
                      <p className="text-sm text-neutral-300">
                        <span className="font-bold text-white">DataQueen</span> just submitted to Protein Predictor.
                      </p>
                      <p className="text-xs text-neutral-500 font-mono mt-1">{i * 12} mins ago • Score: 96.4%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
