"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCourseProgress } from "../../../components/CourseContext";
import { Award, CheckCircle } from "lucide-react";

export default function CourseSidebar({ course }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCompleted, isCourseComplete, totalModules, completedModules } = useCourseProgress();
  const gfgGreen = "#0f9d58";
  const modules = course?.modules || [];

  return (
    <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-8 flex flex-col gap-6">
      <div className="glass-panel p-4 overflow-y-auto max-h-[70vh] border-r border-[#0f9d58]/20">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-gray-800">
           <span className="w-2 h-6 rounded-full" style={{ backgroundColor: gfgGreen }}></span>
           Course Modules
        </h3>
        
        <div className="flex flex-col gap-2">
          {modules.map((module, index) => {
            const isObject = typeof module === 'object' && module !== null;
            const title = isObject ? module.title : `Module ${index + 1}`;
            
            // Check if this module is active by inspecting the pathname
            const isActive = pathname.endsWith(`/${index}`);
            const completed = isCompleted(index);
            
            return (
              <Link 
                key={index} 
                href={`/courses/${course.uuid}/${index}`}
                className={`text-left px-4 py-3 flex items-center justify-between gap-3 rounded-md transition-all text-sm font-medium border-l-4 ${
                  isActive 
                    ? 'bg-[#0f9d58]/10 text-white border-[#0f9d58]' 
                    : 'text-gray-400 border-transparent hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className={`text-lg ${isActive ? 'text-[#0f9d58]' : 'text-gray-600'}`}>
                    {isActive ? '●' : '○'}
                  </span>
                  <span className="line-clamp-2">{title}</span>
                </div>
                {completed && <CheckCircle className="w-4 h-4 text-[#0f9d58] shrink-0" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Certificate Claim Block */}
      <div className={`p-6 rounded-xl border ${isCourseComplete ? 'bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border-cyan-500' : 'bg-[#111] border-gray-800'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Award className={`w-8 h-8 ${isCourseComplete ? 'text-yellow-400 animate-pulse' : 'text-gray-600'}`} />
          <div>
            <h4 className="font-bold text-white">Course Certificate</h4>
            <p className="text-xs text-gray-400">Complete all modules to unlock</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${totalModules > 0 ? (completedModules.length / totalModules) * 100 : 0}%` }}
          ></div>
        </div>

        <button 
          onClick={() => router.push(`/certificate/${course.documentId || course.uuid}`)}
          disabled={!isCourseComplete}
          className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all shadow-lg ${
            isCourseComplete 
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:scale-105' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isCourseComplete ? 'Claim Certificate' : `${completedModules.length}/${totalModules} Completed`}
        </button>
      </div>
    </aside>
  );
}
