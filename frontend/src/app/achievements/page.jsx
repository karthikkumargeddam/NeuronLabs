import GlobalNav from "@/components/GlobalNav";
import { Award, Star, Zap, Code, Database, BookOpen, Lock } from "lucide-react";

export default function AchievementsPage() {
  const achievements = [
    {
      id: 1,
      title: "First Compilation",
      description: "Successfully executed code in the Virtual Sandbox.",
      icon: Code,
      unlocked: true,
      date: "Oct 12, 2026",
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      title: "Data Explorer",
      description: "Mounted an open dataset into your workspace.",
      icon: Database,
      unlocked: true,
      date: "Oct 14, 2026",
      color: "from-emerald-500 to-teal-400"
    },
    {
      id: 3,
      title: "Fast Learner",
      description: "Enrolled in your first Advanced AI course.",
      icon: BookOpen,
      unlocked: true,
      date: "Oct 15, 2026",
      color: "from-purple-500 to-fuchsia-400"
    },
    {
      id: 4,
      title: "Code Collaborator",
      description: "Joined a Live Share multiplayer session.",
      icon: Zap,
      unlocked: false,
      date: null,
      color: "from-amber-500 to-orange-400"
    },
    {
      id: 5,
      title: "Arena Champion",
      description: "Placed top 3 in a coding competition leaderboard.",
      icon: Award,
      unlocked: false,
      date: null,
      color: "from-yellow-400 to-yellow-600"
    },
    {
      id: 6,
      title: "AI Whisperer",
      description: "Asked the AI Tutor for help 10 times.",
      icon: Star,
      unlocked: false,
      date: null,
      color: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans">
      <GlobalNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400 mb-6">
            <Award className="w-4 h-4" />
            Gamification
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            Your Achievements
          </h1>
          <p className="text-neutral-400 text-xl max-w-2xl leading-relaxed">
            Unlock exclusive digital badges by learning, building, and contributing to the NeuronLabs ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`relative overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
                achievement.unlocked 
                  ? 'bg-neutral-900/50 border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:bg-neutral-900/80' 
                  : 'bg-neutral-900/20 border-white/5 opacity-70 grayscale hover:grayscale-0 transition-all'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${achievement.color} blur-[80px] opacity-20`}></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-4 rounded-2xl ${achievement.unlocked ? `bg-gradient-to-br ${achievement.color} shadow-lg` : 'bg-neutral-800'}`}>
                  {achievement.unlocked ? (
                    <achievement.icon className="w-8 h-8 text-white" />
                  ) : (
                    <Lock className="w-8 h-8 text-neutral-500" />
                  )}
                </div>
                {achievement.unlocked && (
                  <span className="text-xs font-mono text-neutral-400 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                    Unlocked {achievement.date}
                  </span>
                )}
              </div>

              <h3 className={`text-2xl font-bold mb-2 ${achievement.unlocked ? 'text-white' : 'text-neutral-500'}`}>
                {achievement.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
