"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import CourseDiscussions from "../../components/CourseDiscussions";

export default function CourseViewer({ course, isAuthorized }) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    if (isAuthorized) {
      fetch("http://localhost:1337/api/courses?sort=createdAt:desc&pagination[limit]=5")
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
             const others = data.data.filter(c => c.documentId !== course.documentId).slice(0, 4);
             setRecentCourses(others);
          }
        })
        .catch(err => console.error(err));
    }
  }, [course.documentId, isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 text-center border-red-500/30 max-w-lg">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-gray-400">This course is exclusively for {course.level} scholars. Please sign in with appropriate credentials.</p>
        </div>
      </div>
    );
  }

  const modules = course.modules || [];
  const activeModule = modules[activeModuleIndex] || {};
  const gfgGreen = "#0f9d58";

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      
      {/* 3-Column Layout Container */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* =========================================
            LEFT SIDEBAR: Navigation Menu (20%)
        ========================================= */}
        <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-8 glass-panel p-4 overflow-y-auto max-h-[85vh] border-r border-[#0f9d58]/20">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-gray-800">
             <span className="w-2 h-6 rounded-full" style={{ backgroundColor: gfgGreen }}></span>
             Course Modules
          </h3>
          
          <div className="flex flex-col gap-2">
            {modules.map((module, index) => {
              const isObject = typeof module === 'object' && module !== null;
              const title = isObject ? module.title : module;
              const isActive = index === activeModuleIndex;
              
              return (
                <button 
                  key={index} 
                  onClick={() => setActiveModuleIndex(index)}
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
                </button>
              );
            })}
          </div>
        </aside>

        {/* =========================================
            CENTER: Main Article Content (60%)
        ========================================= */}
        <main className="w-full lg:w-[55%] glass-panel p-6 md:p-10 min-h-[85vh]">
          {modules.length > 0 ? (
            <article>
              {/* Article Header Metadata */}
              <header className="mb-8 border-b border-gray-800 pb-6">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
                  {typeof activeModule === 'object' ? activeModule.title : activeModule}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1 bg-[#0f9d58]/10 text-[#0f9d58] px-3 py-1 rounded-full border border-[#0f9d58]/30">
                    Difficulty: {course.level}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
                    Last Updated: 11 Jun, 2026
                  </span>
                  <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
                    Read Time: ~15 min
                  </span>
                </div>
              </header>

              {/* Main Image */}
              {typeof activeModule === 'object' && activeModule.image && (
                <figure className="mb-10 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                  <img 
                    src={activeModule.image} 
                    alt={activeModule.title} 
                    className="w-full h-auto object-cover max-h-[400px]"
                  />
                </figure>
              )}

              {/* Markdown Prose Content */}
              <div className="prose prose-invert prose-green max-w-none prose-headings:text-white prose-a:text-[#0f9d58] prose-a:no-underline hover:prose-a:underline prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-gray-800 prose-blockquote:border-l-[#0f9d58] prose-blockquote:bg-[#0f9d58]/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
                {typeof activeModule === 'object' && activeModule.explanation ? (
                  <ReactMarkdown>{activeModule.explanation}</ReactMarkdown>
                ) : (
                  <p>Detailed explanation coming soon. Stay tuned for an in-depth dive into this topic.</p>
                )}
              </div>

              {/* Course Discussions */}
              <CourseDiscussions courseId={course.documentId} />
            </article>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">Curriculum is currently being prepared.</p>
            </div>
          )}
        </main>

        {/* =========================================
            RIGHT SIDEBAR: Recent Courses (20%)
        ========================================= */}
        <aside className="w-full lg:w-[20%] shrink-0 lg:sticky lg:top-8 flex flex-col gap-6">
          
          {/* Recent Courses Widget */}
          <div className="glass-panel p-5 border-t-4" style={{ borderColor: gfgGreen }}>
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Recent Courses</h4>
            {recentCourses.length > 0 ? (
              <div className="flex flex-col gap-4">
                {recentCourses.map(rc => (
                  <a key={rc.documentId} href={`/courses/${rc.uuid}`} className="group block">
                    <h5 className="text-sm font-semibold text-gray-300 group-hover:text-[#0f9d58] transition-colors leading-tight">{rc.title}</h5>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono uppercase bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                        {rc.level}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="animate-pulse flex flex-col gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-12 bg-gray-800/50 rounded-md"></div>
                ))}
              </div>
            )}
          </div>

        </aside>

      </div>
    </div>
  );
}
