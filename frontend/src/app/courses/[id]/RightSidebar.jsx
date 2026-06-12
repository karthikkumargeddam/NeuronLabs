"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RightSidebar({ courseId, isAuthorized }) {
  const [recentCourses, setRecentCourses] = useState([]);
  const gfgGreen = "#0f9d58";

  useEffect(() => {
    if (isAuthorized) {
      fetch("http://localhost:1337/api/courses?sort=createdAt:desc&pagination[limit]=5")
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
             const others = data.data.filter(c => c.documentId !== courseId).slice(0, 4);
             setRecentCourses(others);
          }
        })
        .catch(err => console.error(err));
    }
  }, [courseId, isAuthorized]);

  if (!isAuthorized) return null;

  return (
    <aside className="w-full lg:w-[20%] shrink-0 lg:sticky lg:top-8 flex flex-col gap-6">
      <div className="glass-panel p-5 border-t-4" style={{ borderColor: gfgGreen }}>
        <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Recent Courses</h4>
        {recentCourses.length > 0 ? (
          <div className="flex flex-col gap-4">
            {recentCourses.map(rc => (
              <Link key={rc.documentId} href={`/courses/${rc.uuid}`} className="group block">
                <h5 className="text-sm font-semibold text-gray-300 group-hover:text-[#0f9d58] transition-colors leading-tight">{rc.title}</h5>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono uppercase bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                    {rc.level}
                  </span>
                </div>
              </Link>
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
  );
}
