import { Database, Search, Download, Star, Filter } from "lucide-react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";

async function getDatasets() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/datasets`, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch datasets:', error);
    return [];
  }
}

export default async function DatasetsPage() {
  const datasets = await getDatasets();
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-cyan-500/30 pb-20">
      <GlobalNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {/* Header section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-400 mb-6">
            <Database className="w-4 h-4" />
            Asset Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            Open Datasets
          </h1>
          <p className="text-neutral-400 text-xl max-w-2xl leading-relaxed">
            Instantly mount massive, curated datasets directly into your active Virtual Boxes with zero download time. 
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
              placeholder="Search datasets, formats, or tags..." 
              className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-neutral-900/50 border border-white/10 text-white hover:bg-neutral-800 transition-colors">
            <Filter className="w-5 h-5 text-neutral-400" />
            Filters
          </button>
        </div>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="group relative glass-panel rounded-3xl border border-white/5 bg-[#0a0a0a]/80 p-8 hover:-translate-y-1 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${dataset.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-neutral-900 rounded-xl border border-white/5">
                    <Database className="w-6 h-6 text-neutral-300" />
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400 text-sm font-medium bg-neutral-900/50 px-2.5 py-1 rounded-full border border-white/5">
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    {dataset.downloads || "0"}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{dataset.title}</h3>
                <p className="text-neutral-400 text-sm mb-6 flex-grow leading-relaxed">{dataset.description}</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono px-2 py-1 bg-white/5 text-neutral-300 rounded-md border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                    <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5"/> {dataset.size || "Unknown"}</span>
                    <span>{dataset.format || "CSV/JSON"}</span>
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all flex items-center justify-center gap-2 group/btn">
                  <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                  Mount to Sandbox
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
