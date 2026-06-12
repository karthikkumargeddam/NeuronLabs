import GlobalNav from '@/components/GlobalNav';
import { Trophy, Medal, Star, ArrowUpRight, Award, TrendingUp } from 'lucide-react';
import Image from 'next/image';

async function getProfiles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/profiles?sort[0]=rank:asc`, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch profiles:', error);
    return [];
  }
}

export default async function LeaderboardPage() {
  const profiles = await getProfiles();
  
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-amber-500/30 pb-20">
      <GlobalNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 mb-6">
            <Trophy className="w-4 h-4" />
            Global Rankings
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            Hall of Fame
          </h1>
          <p className="text-neutral-400 text-xl max-w-2xl mx-auto leading-relaxed">
            The top-performing data scientists, researchers, and engineers on Neuron. Earn points by completing courses and winning hackathons.
          </p>
        </div>

        {/* Top 3 Podium (Optional extra flair) */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-20 mt-10">
          {/* 2nd Place */}
          {profiles[1] && (
            <div className="flex flex-col items-center w-full md:w-1/4">
              <img src={profiles[1].avatarUrl} alt={profiles[1].username} className="w-20 h-20 rounded-full border-4 border-slate-300 mb-4 bg-slate-900 shadow-[0_0_20px_rgba(203,213,225,0.3)]" />
              <div className="text-lg font-bold text-slate-300 mb-1">{profiles[1].username}</div>
              <div className="text-xs font-mono text-slate-500 mb-4">{profiles[1].score}</div>
              <div className="w-full h-32 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-2xl border border-b-0 border-white/5 flex justify-center pt-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-4xl font-black text-slate-700">2</span>
              </div>
            </div>
          )}
          
          {/* 1st Place */}
          {profiles[0] && (
            <div className="flex flex-col items-center w-full md:w-1/3 z-10">
              <div className="relative mb-4">
                <CrownIcon className="w-8 h-8 text-amber-400 absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                <img src={profiles[0].avatarUrl} alt={profiles[0].username} className="w-28 h-28 rounded-full border-4 border-amber-400 bg-amber-900 shadow-[0_0_30px_rgba(251,191,36,0.4)]" />
              </div>
              <div className="text-xl font-black text-amber-400 mb-1">{profiles[0].username}</div>
              <div className="text-sm font-mono text-amber-500/70 mb-4">{profiles[0].score}</div>
              <div className="w-full h-44 bg-gradient-to-t from-amber-900/40 to-amber-800/40 rounded-t-2xl border border-b-0 border-amber-500/20 flex justify-center pt-4 relative overflow-hidden group shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                <div className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-5xl font-black text-amber-500/30">1</span>
              </div>
            </div>
          )}
          
          {/* 3rd Place */}
          {profiles[2] && (
            <div className="flex flex-col items-center w-full md:w-1/4">
              <img src={profiles[2].avatarUrl} alt={profiles[2].username} className="w-20 h-20 rounded-full border-4 border-orange-400 mb-4 bg-orange-900 shadow-[0_0_20px_rgba(251,146,60,0.3)]" />
              <div className="text-lg font-bold text-orange-400 mb-1">{profiles[2].username}</div>
              <div className="text-xs font-mono text-orange-500/70 mb-4">{profiles[2].score}</div>
              <div className="w-full h-24 bg-gradient-to-t from-orange-950/40 to-orange-900/40 rounded-t-2xl border border-b-0 border-orange-500/20 flex justify-center pt-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-4xl font-black text-orange-800/50">3</span>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-sm font-mono text-neutral-500 uppercase tracking-wider">
                  <th className="p-6 font-medium">Rank</th>
                  <th className="p-6 font-medium">Hacker</th>
                  <th className="p-6 font-medium">Badge</th>
                  <th className="p-6 font-medium">Courses</th>
                  <th className="p-6 font-medium text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {profiles.map((profile, index) => (
                  <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold w-6 text-center \${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-orange-400' : 'text-neutral-500'}`}>
                          #{profile.rank}
                        </span>
                        {index < 3 && <TrendingUp className={`w-4 h-4 \${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : 'text-orange-400'}`} />}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={profile.avatarUrl} alt={profile.username} className="w-10 h-10 rounded-full border border-white/10" />
                        <span className="font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer">
                          {profile.username}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r \${profile.color} bg-opacity-10 text-white border-white/10`}>
                        <Award className="w-3.5 h-3.5" />
                        {profile.badge}
                      </div>
                    </td>
                    <td className="p-6 text-neutral-400 font-mono">
                      {profile.completedCourses}
                    </td>
                    <td className="p-6 text-right font-mono font-bold text-white">
                      {profile.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function CrownIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 4 3 12h14l3-12-6 7-4-11-4 11z" />
    </svg>
  );
}
