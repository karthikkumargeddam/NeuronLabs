import { MessageSquare, ThumbsUp, CheckCircle2, Search, Filter } from "lucide-react";
import GlobalNav from "@/components/GlobalNav";
import Link from "next/link";

// We'll map showcases to "questions" for now so the backend still works
async function getQuestions() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/showcases`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return [];
  }
}

export const metadata = {
  title: "Q&A Community | NeuronLabs",
  description: "Ask questions, share knowledge, and collaborate with other data scientists and developers.",
};

export default async function CommunityPage() {
  const questions = await getQuestions();
  
  // Create mock questions if the database is empty or mapping showcases
  const displayQuestions = questions.length > 0 ? questions.map(q => ({
    id: q.id,
    title: q.title,
    body: q.description,
    author: q.author || "Anonymous User",
    votes: q.upvotes || Math.floor(Math.random() * 50),
    answers: Math.floor(Math.random() * 10),
    tags: q.tags || ["machine-learning", "python"],
    isResolved: Math.random() > 0.5,
    createdAt: "2 hours ago"
  })) : [
    {
      id: 1,
      title: "How do I deal with CUDA out of memory in PyTorch during fine-tuning?",
      body: "I am trying to fine-tune a Llama 2 7B model using PEFT and LoRA, but I keep hitting a CUDA OOM error on my 24GB VRAM GPU. What batch size or gradient accumulation steps should I use?",
      author: "alex_ml",
      votes: 142,
      answers: 5,
      tags: ["pytorch", "llm", "cuda"],
      isResolved: true,
      createdAt: "1 hour ago"
    },
    {
      id: 2,
      title: "What's the best way to clean missing values in a massive Pandas DataFrame?",
      body: "I have a CSV with 50 million rows. Using simple pandas dropna() or fillna() takes too long and crashes my RAM. Any tips on optimizing this?",
      author: "data_ninja",
      votes: 89,
      answers: 12,
      tags: ["pandas", "data-cleaning", "optimization"],
      isResolved: false,
      createdAt: "3 hours ago"
    },
    {
      id: 3,
      title: "React Server Components vs Client Components for fetching Strapi data",
      body: "I am building a dashboard and I'm confused about when to use 'use client' versus just doing async fetching directly in the component. What is the best practice for SEO and performance?",
      author: "web_dev_dude",
      votes: 45,
      answers: 2,
      tags: ["nextjs", "react", "strapi"],
      isResolved: true,
      createdAt: "5 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-indigo-500/30 pb-20">
      <GlobalNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {/* Header section */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-white">
              Community Q&A
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl">
              Stuck on a bug? Ask the community of AI engineers and developers.
            </p>
          </div>
          <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors shrink-0">
            Ask Question
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex bg-neutral-900 rounded-lg p-1 border border-white/5 w-full sm:w-auto">
            <button className="px-4 py-1.5 rounded-md bg-neutral-800 text-white text-sm font-medium">Newest</button>
            <button className="px-4 py-1.5 rounded-md text-neutral-400 hover:text-white text-sm font-medium transition-colors">Active</button>
            <button className="px-4 py-1.5 rounded-md text-neutral-400 hover:text-white text-sm font-medium transition-colors">Unanswered</button>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search questions..." 
              className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-0 border-t border-white/5">
          {displayQuestions.map((q) => (
            <div key={q.id} className="flex flex-col sm:flex-row gap-6 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              
              {/* Stats column */}
              <div className="flex sm:flex-col gap-4 sm:gap-2 items-center sm:items-end shrink-0 text-sm w-full sm:w-24">
                <div className="text-neutral-300 font-medium">
                  {q.votes} votes
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded \${q.isResolved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : q.answers > 0 ? 'border border-indigo-500/30 text-indigo-400' : 'text-neutral-500'}`}>
                  {q.isResolved && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {q.answers} answers
                </div>
              </div>

              {/* Content column */}
              <div className="flex-1 min-w-0">
                <Link href="#" className="text-lg text-indigo-400 hover:text-indigo-300 font-medium mb-2 block line-clamp-2">
                  {q.title}
                </Link>
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                  {q.body}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {q.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded border border-indigo-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-neutral-500 flex items-center gap-2">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=\${q.author}`} className="w-5 h-5 rounded-full bg-neutral-800" alt="avatar" />
                    <span className="text-indigo-400">{q.author}</span>
                    <span>asked {q.createdAt}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-white/10 rounded text-sm text-neutral-400 hover:bg-white/5 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-indigo-500 bg-indigo-500/20 rounded text-sm text-white">1</button>
            <button className="px-3 py-1 border border-white/10 rounded text-sm text-neutral-400 hover:bg-white/5">2</button>
            <button className="px-3 py-1 border border-white/10 rounded text-sm text-neutral-400 hover:bg-white/5">3</button>
            <button className="px-3 py-1 border border-white/10 rounded text-sm text-neutral-400 hover:bg-white/5">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
