import { fetchAPI } from '../../lib/api';
import { Suspense } from 'react';
import { Trophy, Medal, Star, Shield } from 'lucide-react';

async function LeaderboardTable() {
  let entries = [];
  try {
    const response = await fetchAPI('/api/leaderboard-entries', { 
      populate: ['user'],
      sort: ['score:desc'],
      pagination: { limit: 100 } 
    }, { next: { revalidate: 60 } });
    entries = response?.data || [];
  } catch (e) {
    console.error("Failed to fetch leaderboard", e);
  }

  // Fallback UI if Strapi hasn't populated yet
  if (entries.length === 0) {
    entries = [
      { id: 1, user: { username: 'KarthikGeddam' }, score: 14500, rank_title: 'Grandmaster' },
      { id: 2, user: { username: 'QuantumPanda' }, score: 12200, rank_title: 'Master' },
      { id: 3, user: { username: 'NeuralKnight' }, score: 10800, rank_title: 'Master' },
      { id: 4, user: { username: 'AstroCoder' }, score: 8500, rank_title: 'Expert' },
      { id: 5, user: { username: 'BioHack' }, score: 7200, rank_title: 'Expert' },
    ];
  }

  const top3 = entries.slice(0, 3);
  const others = entries.slice(3);

  return (
    <div className="space-y-12">
      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="flex justify-center items-end gap-2 md:gap-6 mt-16 mb-20 px-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 p-1 shadow-[0_0_20px_rgba(156,163,175,0.5)] flex items-center justify-center">
                <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-white">
                  {(top3[1]?.attributes?.user?.data?.attributes?.username || top3[1]?.user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-300 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-[#111]">#2</div>
            </div>
            <div className="text-white font-bold mb-1 truncate max-w-[100px] text-center">{top3[1]?.attributes?.user?.data?.attributes?.username || top3[1]?.user?.username || 'Unknown'}</div>
            <div className="text-gray-400 text-sm mb-4 font-mono">{top3[1]?.attributes?.score?.toLocaleString() || top3[1]?.score?.toLocaleString() || 0}</div>
            <div className="w-24 md:w-32 h-32 md:h-40 bg-gradient-to-t from-[#111] to-gray-800/80 rounded-t-lg border-t-2 border-gray-400 flex items-start justify-center pt-4">
              <Medal className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center animate-fade-in z-10">
            <div className="relative mb-4">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 p-1 shadow-[0_0_30px_rgba(250,204,21,0.6)] flex items-center justify-center">
                <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center text-2xl md:text-4xl font-bold text-white">
                  {(top3[0]?.attributes?.user?.data?.attributes?.username || top3[0]?.user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg border-2 border-[#111]">#1</div>
            </div>
            <div className="text-yellow-400 font-black text-lg mb-1 truncate max-w-[120px] text-center drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">{top3[0]?.attributes?.user?.data?.attributes?.username || top3[0]?.user?.username || 'Unknown'}</div>
            <div className="text-gray-300 text-sm mb-4 font-mono">{top3[0]?.attributes?.score?.toLocaleString() || top3[0]?.score?.toLocaleString() || 0}</div>
            <div className="w-28 md:w-36 h-40 md:h-52 bg-gradient-to-t from-[#111] to-yellow-900/40 rounded-t-lg border-t-2 border-yellow-400 flex items-start justify-center pt-4 shadow-[0_-10px_30px_rgba(250,204,21,0.15)]">
              <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="relative mb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 p-1 shadow-[0_0_20px_rgba(217,119,6,0.5)] flex items-center justify-center">
                <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-white">
                  {(top3[2]?.attributes?.user?.data?.attributes?.username || top3[2]?.user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-600 text-amber-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-[#111]">#3</div>
            </div>
            <div className="text-white font-bold mb-1 truncate max-w-[100px] text-center">{top3[2]?.attributes?.user?.data?.attributes?.username || top3[2]?.user?.username || 'Unknown'}</div>
            <div className="text-gray-400 text-sm mb-4 font-mono">{top3[2]?.attributes?.score?.toLocaleString() || top3[2]?.score?.toLocaleString() || 0}</div>
            <div className="w-24 md:w-32 h-24 md:h-32 bg-gradient-to-t from-[#111] to-amber-900/60 rounded-t-lg border-t-2 border-amber-600 flex items-start justify-center pt-4">
              <Medal className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>
      )}

      {/* Ranking Table */}
      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Rank</th>
              <th className="p-4 font-medium">Researcher</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium text-right">Arena Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {others.map((entry, index) => {
              const attrs = entry.attributes || entry;
              const user = attrs.user?.data?.attributes || attrs.user;
              const username = user?.username || 'Unknown Researcher';
              const rank = index + 4; // Start at #4 since top 3 are in podium
              
              return (
                <tr key={entry.id || index} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <span className="text-gray-500 font-mono pl-1">#{rank}</span>
                  </td>
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs shadow-lg">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    {username}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Shield className="w-3 h-3" />
                      {attrs.rank_title || 'Novice'}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-amber-400 font-bold group-hover:text-amber-300 transition-colors">
                    {attrs.score?.toLocaleString() || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen p-8 md:p-16 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-12 text-center flex flex-col items-center">
        <Trophy className="w-16 h-16 text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Global Rankings</h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          The most elite researchers and computational engineers on the platform. Solve arena bounties to increase your Elo and claim your spot.
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-purple-400 animate-pulse text-xl py-12">Calculating global ranks...</div>}>
        <LeaderboardTable />
      </Suspense>
    </div>
  );
}
