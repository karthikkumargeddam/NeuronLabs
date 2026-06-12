import Link from "next/link";
import { fetchAPI } from "../lib/api";
import { Suspense } from "react";

import Chatbot from "../components/Chatbot";
import FeedbackWidget from "../components/FeedbackWidget";
import ConnectWithUsForm from "../components/ConnectWithUsForm";

import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ConditionalPricing from "../components/ConditionalPricing";

async function FeaturedCourses() {
  const response = await fetchAPI('/api/courses', { 
    pagination: { limit: 3 },
    populate: '*'
  });
  const courses = response?.data || [];

  if (courses.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto mt-32 text-left z-10 relative px-6 md:px-12">
      <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">Featured Curriculum</h2>
        <Link href="/courses" className="text-cyan-400 hover:text-cyan-300 font-medium group flex items-center gap-2 transition-colors">
          View All <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map((course) => {
          const attrs = course.attributes || course;
          return (
            <Link href={`/courses/${attrs.uuid || course.id}`} key={course.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-panel p-8 h-full rounded-2xl border border-gray-800/80 bg-[#0a0a0a]/80 hover:bg-[#111]/90 transition-all duration-300">
                <div className="inline-flex border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-mono px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                  {attrs.level || 'Standard'}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">{attrs.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{attrs.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function MockupTerminal() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-24 relative z-10 perspective-1000">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 rounded-[2rem] blur-2xl opacity-20 animate-pulse"></div>
      
      {/* Main Mockup Container */}
      <div className="relative glass-panel rounded-[2rem] border border-gray-700/50 bg-[#050505]/90 shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-transform hover:scale-[1.01] duration-500">
        
        {/* Sidebar Explorer */}
        <div className="w-full md:w-64 border-r border-gray-800/60 bg-[#0a0a0a]/50 p-4 hidden md:flex flex-col">
          <div className="flex gap-2 mb-6 px-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
          <div className="text-xs font-mono font-semibold text-gray-500 mb-4 px-2 tracking-widest uppercase">Sandboxes</div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono text-sm border border-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <span>VBox_Cluster_01</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 font-mono text-sm hover:bg-white/5 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>GPU_Sandbox_A</span>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-800/60">
            <div className="flex items-center gap-2 px-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Virtual Box Connected
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col h-[500px]">
          {/* Editor Tabs */}
          <div className="flex items-center bg-[#111]/80 border-b border-gray-800/60 overflow-x-auto">
            <div className="px-6 py-3 border-r border-gray-800/60 border-t-2 border-t-cyan-400 bg-[#050505] text-cyan-300 font-mono text-sm">
              distributed_training.py
            </div>
            <div className="px-6 py-3 border-r border-gray-800/60 text-gray-500 font-mono text-sm hover:bg-[#1a1a1a] cursor-pointer">
              docker-compose.yml
            </div>
          </div>
          
          {/* Code Area */}
          <div className="flex-1 p-6 font-mono text-sm overflow-auto text-gray-300 leading-relaxed bg-[#050505]">
            <div><span className="text-pink-500">import</span> torch</div>
            <div><span className="text-pink-500">import</span> torch.distributed <span className="text-pink-500">as</span> dist</div>
            <br/>
            <div><span className="text-gray-500"># Initializing Virtual Box GPU Cluster Sandbox</span></div>
            <div><span className="text-pink-500">def</span> <span className="text-blue-300">init_sandbox_cluster</span>():</div>
            <div className="pl-4">dist.init_process_group(backend=<span className="text-yellow-300">'nccl'</span>)</div>
            <div className="pl-4">local_rank = parseInt(os.environ[<span className="text-yellow-300">'LOCAL_RANK'</span>])</div>
            <div className="pl-4">torch.cuda.set_device(local_rank)</div>
            <br/>
            <div className="pl-4"><span className="text-pink-500">print</span>(<span className="text-yellow-300">{`f"Virtual Box initialized. Active GPUs: {torch.cuda.device_count()}"`}</span>)</div>
            <div className="pl-4"><span className="text-gray-500"># Launching interactive sandbox session...</span></div>
          </div>

          {/* Terminal Area */}
          <div className="h-48 bg-[#000] border-t border-gray-800/80 p-4 font-mono text-xs overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20"></div>
            <div className="text-gray-500 mb-2">NeuronLabs Sandboxed Terminal v2.0</div>
            <div className="flex items-center text-green-400 mb-1">
              <span className="text-purple-400 mr-2">root@vbox-cluster-01:~$</span> 
              <span>nvidia-smi</span>
            </div>
            <div className="text-gray-400">
              <pre className="opacity-70">
{`+-----------------------------------------------------------------------------+
| NVIDIA-SMI 535.104      Driver Version: 535.104      CUDA Version: 12.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
|   0  Tesla V100-SXM2...  On   | 00000000:00:04.0 Off |                    0 |
+-------------------------------+----------------------+----------------------+`}
              </pre>
            </div>
            <div className="flex items-center mt-2 animate-pulse">
              <span className="text-purple-400 mr-2">root@vbox-cluster-01:~$</span> 
              <span className="w-2 h-4 bg-gray-400 block"></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Call to Action */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:-translate-y-1 transition-all cursor-pointer">
        <Link href="/labs" className="flex items-center gap-3">
          Launch Virtual Box
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  );
}

import CheckoutButton from "../components/CheckoutButton";

function PricingSection() {
  return (
    <div className="w-full max-w-7xl mx-auto mt-40 mb-12 text-left z-10 relative px-6 md:px-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 mb-4">Choose Your Plan</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Flexible pricing for students, professionals, and entire organizations.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Free Plan */}
        <div className="glass-panel p-8 rounded-3xl border border-gray-800/80 bg-[#0a0a0a]/80 hover:-translate-y-2 transition-transform duration-500">
          <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
          <div className="text-4xl font-black text-white mb-6">₹0<span className="text-lg text-gray-500 font-medium">/month</span></div>
          <ul className="space-y-4 mb-8 text-gray-400">
            <li className="flex items-center gap-3"><span className="text-cyan-500">✓</span> Basic Sandboxes</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">✓</span> Community Support</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">✓</span> Standard Curriculum</li>
            <li className="flex items-center gap-3 text-gray-600"><span className="text-gray-700">×</span> GPU Acceleration</li>
          </ul>
          <button className="w-full py-3 rounded-full font-bold border border-gray-700 text-white hover:bg-gray-800 transition-colors">Get Started</button>
        </div>

        {/* 299 Plan */}
        <div className="glass-panel p-10 rounded-3xl border border-cyan-500/50 bg-gradient-to-b from-[#111] to-[#050505] relative transform md:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.15)] z-10 hover:-translate-y-2 transition-transform duration-500">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">Most Popular</div>
          <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
          <div className="text-5xl font-black text-cyan-400 mb-6">₹299<span className="text-lg text-gray-500 font-medium">/month</span></div>
          <ul className="space-y-4 mb-8 text-gray-300">
            <li className="flex items-center gap-3"><span className="text-cyan-400">✓</span> Advanced Sandboxes</li>
            <li className="flex items-center gap-3"><span className="text-cyan-400">✓</span> Priority Support</li>
            <li className="flex items-center gap-3"><span className="text-cyan-400">✓</span> Full Curriculum Access</li>
            <li className="flex items-center gap-3"><span className="text-cyan-400">✓</span> 50hrs GPU Acceleration</li>
          </ul>
          <CheckoutButton amount={299} planName="Pro" />
        </div>

        {/* Enterprise Plan */}
        <div className="glass-panel p-8 rounded-3xl border border-gray-800/80 bg-[#0a0a0a]/80 hover:-translate-y-2 transition-transform duration-500">
          <h3 className="text-2xl font-bold text-white mb-2">Enterprise Level</h3>
          <div className="text-4xl font-black text-white mb-6">Custom</div>
          <ul className="space-y-4 mb-8 text-gray-400">
            <li className="flex items-center gap-3"><span className="text-cyan-500">✓</span> Unlimited Sandboxes</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">✓</span> Dedicated Account Manager</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">✓</span> Custom Curriculum</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">✓</span> Unlimited GPU Acceleration</li>
          </ul>
          <button className="w-full py-3 rounded-full font-bold border border-gray-700 text-white hover:bg-gray-800 transition-colors">Contact Sales</button>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isPro = session?.user?.isPro;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#030303]">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>



      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center pt-16 md:pt-24 text-center z-10 px-4">
        <div className="inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono px-4 py-2 rounded-full mb-10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-fade-in">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span></span>
          Virtual Boxes & Isolated Sandboxes Now Live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] max-w-5xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Code, Train, and Deploy in <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 relative">
            Zero-Setup Virtual Boxes
            <span className="absolute -bottom-4 left-0 w-full h-2 bg-cyan-500 blur-xl opacity-50"></span>
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mb-12 font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Instantly spin up GPU-accelerated sandboxes. Dive into our exclusive M.Tech & PhD environments directly from your browser.
        </p>

        <div className="flex items-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <Link 
            href="/virtual-toolbox" 
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            Launch Virtual Toolbox
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <Link 
            href="/courses" 
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1"
          >
            Explore Labs
          </Link>
        </div>

        {/* Mockup Terminal Component */}
        <div className="w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <MockupTerminal />
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 w-full max-w-7xl px-6 md:px-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="glass-panel p-10 text-left hover:-translate-y-2 transition-transform duration-500 rounded-3xl border border-gray-800/80 bg-gradient-to-br from-[#111] to-[#0a0a0a]">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-8 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Isolated Virtual Boxes</h3>
            <p className="text-gray-400 text-[1.05rem] leading-relaxed">Dedicated Linux instances running in perfect isolation. Install dependencies, run root commands, and break things safely.</p>
          </div>
          
          <div className="glass-panel p-10 text-left hover:-translate-y-2 transition-transform duration-500 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-[#0a0a0a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 mix-blend-overlay filter blur-[80px] opacity-30"></div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-8 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">GPU-Accelerated Sandboxes</h3>
            <p className="text-gray-400 text-[1.05rem] leading-relaxed">Instantly attach NVIDIA V100/A100 GPUs to your sandbox. Train massive transformer models without leaving your browser window.</p>
          </div>

          <div className="glass-panel p-10 text-left hover:-translate-y-2 transition-transform duration-500 rounded-3xl border border-gray-800/80 bg-gradient-to-br from-[#111] to-[#0a0a0a]">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-8 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Zero-Setup Environments</h3>
            <p className="text-gray-400 text-[1.05rem] leading-relaxed">Skip the Dockerfiles and Conda environments. One click boots up pre-configured environments for PyTorch, TensorFlow, and more.</p>
          </div>
        </div>

        <Suspense fallback={<div className="mt-24 text-cyan-400 animate-pulse font-mono">Loading featured curriculum...</div>}>
          <FeaturedCourses />
        </Suspense>
        
        {!isPro && (
          <ConditionalPricing>
            <PricingSection />
          </ConditionalPricing>
        )}

        {/* Connect With Us Form */}
        <ConnectWithUsForm />

        {/* Footer padding */}
        <div className="h-32"></div>
      </main>
      <Chatbot />
      <FeedbackWidget />
    </div>
  );
}
