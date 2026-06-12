"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseSidebar({ course }) {
  const pathname = usePathname();
  const gfgGreen = "#0f9d58";
  const modules = course?.modules || [];

  return (
    <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-8 glass-panel p-4 overflow-y-auto max-h-[85vh] border-r border-[#0f9d58]/20">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-gray-800">
         <span className="w-2 h-6 rounded-full" style={{ backgroundColor: gfgGreen }}></span>
         Course Modules
      </h3>
      
      <div className="flex flex-col gap-2">
        {modules.map((module, index) => {
          const isObject = typeof module === 'object' && module !== null;
          const title = isObject ? module.title : module;
          
          // Check if this module is active by inspecting the pathname
          const isActive = pathname.endsWith(`/${index}`);
          
          return (
            <Link 
              key={index} 
              href={`/courses/${course.uuid}/${index}`}
              className={`text-left px-4 py-3 flex items-center gap-3 rounded-md transition-all text-sm font-medium border-l-4 ${
                isActive 
                  ? 'bg-[#0f9d58]/10 text-white border-[#0f9d58]' 
                  : 'text-gray-400 border-transparent hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <span className={`text-lg ${isActive ? 'text-[#0f9d58]' : 'text-gray-600'}`}>
                {isActive ? '●' : '○'}
              </span>
              <span className="line-clamp-2">{title}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
