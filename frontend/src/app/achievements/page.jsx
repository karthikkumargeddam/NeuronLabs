import GlobalNav from "@/components/GlobalNav";
import { Trophy, Medal, Star, Award, Zap, Shield, Code, Database, BookOpen, Lock } from "lucide-react";
import { Suspense } from "react";
import { fetchAPI } from '../../lib/api';

const iconMap = {
  Trophy, Medal, Star, Award, Zap, Shield, Code, Database, BookOpen, Lock
};

async function AchievementsList() {
  let achievements = [];
  try {
    const response = await fetchAPI('/api/achievements', { populate: '*' }, { next: { revalidate: 60 } });
    achievements = response?.data || [];
  } catch (e) {
    console.error("Failed to fetch achievements", e);
  }

  if (achievements.length === 0) {
    achievements = [
      {
        id: 'mock-a1',
        title: "First Compilation",
        description: "Successfully executed code in the Virtual Sandbox.",
        iconName: "Code",
        unlocked: true,
        points: 50,
        color: "from-blue-500 to-cyan-400"
      },
      {
        id: 'mock-a2',
        title: "Data Explorer",
        description: "Mounted an open dataset into your workspace.",
        iconName: "Database",
        unlocked: true,
        points: 100,
        color: "from-emerald-500 to-teal-400"
      },
      {
        id: 'mock-a3',
        title: "Fast Learner",
        description: "Enrolled in your first Advanced AI course.",
        iconName: "BookOpen",
        unlocked: true,
        points: 50,
        color: "from-purple-500 to-fuchsia-400"
      },
      {
        id: 'mock-a4',
        title: "Code Collaborator",
        description: "Joined a Live Share multiplayer session.",
        iconName: "Zap",
        unlocked: false,
        points: 150,
        color: "from-amber-500 to-orange-400"
      },
      {
        id: 'mock-a5',
        title: "Arena Champion",
        description: "Placed top 3 in a coding competition leaderboard.",
        iconName: "Award",
        unlocked: false,
        points: 500,
        color: "from-yellow-400 to-yellow-600"
      },
      {
        id: 'mock-a6',
        title: "AI Whisperer",
        description: "Asked the AI Tutor for help 10 times.",
        iconName: "Star",
        unlocked: false,
        points: 100,
        color: "from-indigo-500 to-blue-600"
      }
    ];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((ach) => {
        const attrs = ach.attributes || ach;
        const id = attrs.documentId || attrs.uuid || ach.id;
        const isUnlocked = attrs.unlocked;
        const IconComponent = iconMap[attrs.iconName] || Trophy;
        const colorClass = attrs.color || "from-neutral-500 to-neutral-700";
        
        return (
          <div 
            key={id} 
            className={`relative overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
              isUnlocked 
                ? 'bg-neutral-900/50 border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:bg-neutral-900/80' 
                : 'bg-neutral-900/20 border-white/5 opacity-70 grayscale hover:grayscale-0 transition-all'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} blur-[80px] opacity-20`}></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${isUnlocked ? `bg-gradient-to-br ${colorClass} shadow-lg` : 'bg-neutral-800'}`}>
                {isUnlocked ? (
                  <IconComponent className="w-8 h-8 text-white" />
                ) : (
                  <Lock className="w-8 h-8 text-neutral-500" />
                )}
              </div>
              {isUnlocked && (
                <span className="text-xs font-mono text-neutral-400 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                  +{attrs.points || 100} PTS
                </span>
              )}
            </div>

            <h3 className={`text-2xl font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-neutral-500'}`}>
              {attrs.title}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {attrs.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans">
      <GlobalNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400 mb-6 relative z-10">
            <Award className="w-4 h-4" />
            Gamification
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400 relative z-10">
            Your Achievements
          </h1>
          <p className="text-neutral-400 text-xl max-w-2xl leading-relaxed relative z-10">
            Unlock exclusive digital badges by learning, building, and contributing to the NeuronLabs ecosystem.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-yellow-400 animate-pulse text-xl py-12">Loading Achievements...</div>}>
          <AchievementsList />
        </Suspense>
      </div>
    </div>
  );
}
