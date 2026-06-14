import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  User,
  Mail,
  Award,
  BookOpen,
  Code,
  ShieldCheck,
  Clock,
  ChevronRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import ResourceMonitor from "@/components/ResourceMonitor";
import ActivityCalendarClient from "@/components/ActivityCalendarClient";
import CourseRecommendations from "@/components/CourseRecommendations";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { user: sessionUser } = session;

  // Fetch fresh user data from Strapi to bypass stale session cookies
  let freshUser = {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/users/me?populate=*`, {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
      next: { revalidate: 60 }
    });
    if (res.ok) {
      freshUser = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch fresh user data:", err);
  }

  const user = { ...sessionUser, ...freshUser };

  // Fallback dates if the user was upgraded before the fields were added
  const validFrom = user.proValidFrom || user.createdAt || new Date().toISOString();
  // If proValidUntil is somehow missing but they are Pro, give an approximate
  let validUntil = user.proValidUntil;
  if (user.isPro && !validUntil && validFrom) {
    const d = new Date(validFrom);
    d.setMonth(d.getMonth() + 1);
    validUntil = d.toISOString();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-neutral-900 border border-white/10 p-8 sm:p-12 mb-10 shadow-2xl backdrop-blur-sm group">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-4 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Active Session
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                Welcome back, {user.name || "Explorer"}!
              </h1>
              <p className="text-neutral-400 text-lg max-w-xl">
                Here's what's happening with your learning journey today.
              </p>
            </div>
            
            {user.isPro && (
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all duration-500">
                <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Plan</p>
                  <p className="text-lg font-bold text-amber-400">Pro Member</p>
                  {validFrom && (
                    <p className="text-xs text-amber-500/70 mt-0.5">Valid from: {new Date(validFrom).toLocaleDateString()}</p>
                  )}
                  {validUntil && (
                    <p className="text-xs text-amber-500/70 mt-0.5">Valid till: {new Date(validUntil).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Navigation */}
          <div className="space-y-8">
            <div className="bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 hover:bg-neutral-900/80 transition-colors duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="text-indigo-400 w-5 h-5" /> Profile Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5">
                  <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Username</p>
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5">
                  <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-neutral-500">Email Address</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5">
                  <div className="p-2 bg-neutral-800 rounded-xl text-neutral-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Role</p>
                    <p className="text-sm font-medium">{user.role || "Student"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 hover:bg-neutral-900/80 transition-colors duration-300">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400 w-5 h-5" /> Quick Actions
              </h2>
              <div className="space-y-2">
                 <Link href="/courses" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <span className="flex items-center gap-3 text-neutral-300 group-hover:text-white transition-colors">
                      <BookOpen className="w-4 h-4 text-neutral-500 group-hover:text-indigo-400 transition-colors" />
                      Browse Courses
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                 </Link>
                 <Link href="/virtual-toolbox" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <span className="flex items-center gap-3 text-neutral-300 group-hover:text-white transition-colors">
                      <Code className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors" />
                      Virtual Toolbox
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                 </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Activity & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-900/5 border border-indigo-500/10 rounded-3xl p-6 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                  <BookOpen className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="p-3 bg-indigo-500/20 w-fit rounded-2xl mb-4">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">0</h3>
                  <p className="text-neutral-400 font-medium">Enrolled Courses</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/5 border border-purple-500/10 rounded-3xl p-6 hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
                  <Code className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="p-3 bg-purple-500/20 w-fit rounded-2xl mb-4">
                    <Code className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">0</h3>
                  <p className="text-neutral-400 font-medium">Active Sandboxes</p>
                </div>
              </div>
            </div>

            {/* Resource Monitor */}
            <ResourceMonitor />

            {/* Recent Activity / Gamification Graph */}
            <div className="bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 md:p-8 hover:bg-neutral-900/80 transition-colors duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="text-teal-400 w-5 h-5" /> Contribution Activity
                </h2>
                <Link href="/achievements" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                  View Badges <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <ActivityCalendarClient />
            </div>

            {/* AI Course Recommendations Carousel */}
            <CourseRecommendations />

          </div>

        </div>
      </div>
    </div>
  );
}
