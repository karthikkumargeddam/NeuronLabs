"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { BookOpen, Code, Database, Award, Monitor, User, Search } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      >
        <div className="w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-neutral-200">
          <div className="flex items-center px-4 border-b border-white/10">
            <Search className="w-5 h-5 text-neutral-400 mr-2 shrink-0" />
            <Command.Input 
              placeholder="Type a command or search..." 
              className="flex-1 bg-transparent py-4 outline-none placeholder:text-neutral-500 text-white font-medium"
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
            <Command.Empty className="py-6 text-center text-sm text-neutral-500">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-xs text-neutral-500 px-2 py-1.5 font-medium uppercase tracking-wider">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 hover:text-white transition-colors aria-selected:bg-cyan-500/10 aria-selected:text-cyan-400 mt-1"
              >
                <Monitor className="w-4 h-4" /> Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/courses'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 hover:text-white transition-colors aria-selected:bg-cyan-500/10 aria-selected:text-cyan-400"
              >
                <BookOpen className="w-4 h-4" /> Browse Courses
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/datasets'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 hover:text-white transition-colors aria-selected:bg-cyan-500/10 aria-selected:text-cyan-400"
              >
                <Database className="w-4 h-4" /> Datasets
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Tools & Labs" className="text-xs text-neutral-500 px-2 pt-4 pb-1.5 font-medium uppercase tracking-wider">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/playground'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 hover:text-white transition-colors aria-selected:bg-purple-500/10 aria-selected:text-purple-400 mt-1"
              >
                <Code className="w-4 h-4" /> Code Editor (Sandbox)
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/notebooks'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 hover:text-white transition-colors aria-selected:bg-purple-500/10 aria-selected:text-purple-400"
              >
                <BookOpen className="w-4 h-4" /> Data Science Notebooks
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/achievements'))}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 hover:text-white transition-colors aria-selected:bg-yellow-500/10 aria-selected:text-yellow-400"
              >
                <Award className="w-4 h-4" /> Gamification & Badges
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Account" className="text-xs text-neutral-500 px-2 pt-4 pb-1.5 font-medium uppercase tracking-wider">
              {session ? (
                <Command.Item 
                  onSelect={() => runCommand(() => router.push('/api/auth/signout'))}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/10 hover:text-red-400 transition-colors aria-selected:bg-red-500/10 aria-selected:text-red-400 mt-1"
                >
                  <User className="w-4 h-4" /> Sign Out ({session.user.email})
                </Command.Item>
              ) : (
                <Command.Item 
                  onSelect={() => runCommand(() => router.push('/auth/signin'))}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 hover:text-white transition-colors aria-selected:bg-emerald-500/10 aria-selected:text-emerald-400 mt-1"
                >
                  <User className="w-4 h-4" /> Sign In
                </Command.Item>
              )}
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>

      {/* Global CSS for cmdk specific active state styling */}
      <style jsx global>{`
        [cmdk-item][data-selected="true"] {
          background-color: rgba(255, 255, 255, 0.05);
          color: white;
        }
      `}</style>
    </>
  );
}
