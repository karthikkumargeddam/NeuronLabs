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

  return (
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
          {entries.map((entry, index) => {
            const attrs = entry.attributes || entry;
            const user = attrs.user?.data?.attributes || attrs.user;
            const username = user?.username || 'Unknown Researcher';
            
            return (
              <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  {index === 0 ? <Medal className="w-6 h-6 text-yellow-400" /> :
                   index === 1 ? <Medal className="w-6 h-6 text-gray-300" /> :
                   index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                   <span className="text-gray-500 font-mono pl-1">#{index + 1}</span>}
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
