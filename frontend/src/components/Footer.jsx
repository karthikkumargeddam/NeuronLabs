import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-gray-800/60 mt-auto py-12 relative z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white text-xs">
              N
            </div>
            NeuronLabs
          </div>
          <p className="text-gray-500 text-sm font-mono max-w-sm">
            Advanced PhD-level sandboxes and interactive architectures for the next generation of engineers.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm font-mono text-center md:text-left">
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-1">Platform</h4>
            <Link href="/courses" className="text-gray-400 hover:text-cyan-400 transition-colors">Courses</Link>
            <Link href="/labs" className="text-gray-400 hover:text-cyan-400 transition-colors">Sandboxes</Link>
            <Link href="/phd-research" className="text-gray-400 hover:text-cyan-400 transition-colors">PhD Research</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-1">Resources</h4>
            <Link href="/documentation" className="text-gray-400 hover:text-cyan-400 transition-colors">Documentation</Link>
            <Link href="/api-reference" className="text-gray-400 hover:text-cyan-400 transition-colors">API Reference</Link>
            <Link href="/support" className="text-gray-400 hover:text-cyan-400 transition-colors">Support</Link>
          </div>
          <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
            <h4 className="text-white font-bold mb-1">Legal</h4>
            <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-gray-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-600 text-xs font-mono">
          &copy; {new Date().getFullYear()} NeuronLabs Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <Link href="#" className="hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </Link>
          <Link href="#" className="hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.8c0-1.2-.4-2.2-1-3 2.5-.3 5-1.2 5-5.5 0-1.2-.4-2.2-1-3 .1-.3.4-1.4-.1-3 0 0-1-.3-3.3 1.2-1.2-.3-2.5-.5-3.8-.5s-2.6.2-3.8.5C5.5 3.1 4.5 3.4 4.5 3.4c-.5 1.6-.2 2.7-.1 3-.6.8-1 1.8-1 3 0 4.3 2.5 5.2 5 5.5-.6.6-1 1.5-1 2.8V21"/></svg>
          </Link>
          <Link href="#" className="hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
