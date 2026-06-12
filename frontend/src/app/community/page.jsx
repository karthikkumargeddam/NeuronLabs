import { Users, Heart, GitBranch, TerminalSquare, ExternalLink, Flame } from "lucide-react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";

async function getShowcases() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/showcases`, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch showcases:', error);
    return [];
  }
}

export default async function CommunityPage() {
  const showcases = await getShowcases();
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-indigo-500/30 pb-20">
      <GlobalNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {/* Header section */}
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-400 mb-6">
              <Users className="w-4 h-4" />
              Community Showcase
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              Discover & Build
            </h1>
            <p className="text-neutral-400 text-xl max-w-2xl leading-relaxed">
              Explore top-rated notebooks, web apps, and models deployed by the Neuron community. Launch them instantly in your sandbox.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            Publish Project
          </button>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {showcases.map((project) => (
            <div key={project.id} className="group relative glass-panel rounded-3xl border border-white/5 bg-[#0a0a0a]/80 p-8 hover:border-white/10 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-neutral-900 rounded-xl border border-white/5">
                      <TerminalSquare className="w-6 h-6 text-neutral-300" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-neutral-500 mb-1">Project</div>
                      <div className="text-sm font-medium text-indigo-400">{project.author || "Anonymous"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-sm font-medium hover:text-pink-400 transition-colors cursor-pointer">
                      <Heart className="w-4 h-4" />
                      {project.upvotes || 0}
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-sm font-medium hover:text-white transition-colors cursor-pointer">
                      <GitBranch className="w-4 h-4" />
                      0
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                <p className="text-neutral-400 text-[1.05rem] leading-relaxed mb-8 flex-grow">{project.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono px-2 py-1 bg-white/5 text-neutral-300 rounded-md border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="px-5 py-2.5 rounded-xl font-bold bg-indigo-500 text-white hover:bg-indigo-400 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                    Clone to Sandbox
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
