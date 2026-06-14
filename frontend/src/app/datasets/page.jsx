import { Database, Search, Download, Star, Filter } from "lucide-react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import DatasetGridClient from "./DatasetGridClient";

export const metadata = {
  title: "Open Datasets | NeuronLabs",
  description: "Instantly mount massive, curated datasets directly into your active Virtual Boxes with zero download time. Train your AI models faster.",
  openGraph: {
    title: "Open Datasets | NeuronLabs",
    description: "Instantly mount massive, curated datasets directly into your active Virtual Boxes.",
    images: ["/og-datasets.png"]
  }
};

async function getDatasets() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}`}/api/datasets`, { next: { revalidate: 60 } });
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
        <DatasetGridClient datasets={datasets} />
      </div>
    </div>
  );
}
