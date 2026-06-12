import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { fetchAPI } from "../../../../lib/api";

async function getCourseData(uuid) {
  try {
    const response = await fetchAPI('/api/courses', {
      filters: { uuid: { $eq: uuid } },
      populate: '*'
    }, { cache: 'no-store' });
    
    if (response?.data?.length > 0) {
      const course = response.data[0];
      return course.attributes || course;
    }
  } catch (e) {
    console.error("Failed to fetch course from Strapi", e);
  }
  return null;
}

export default async function ModulePage({ params }) {
  const { id, moduleId } = await params;
  const course = await getCourseData(id);

  if (!course) {
    notFound();
  }

  const modules = course.modules || [];
  const index = parseInt(moduleId, 10);
  
  if (isNaN(index) || index < 0 || index >= modules.length) {
    if (modules.length === 0) {
      return (
        <main className="w-full lg:w-[55%] glass-panel p-6 md:p-10 min-h-[85vh]">
          <div className="text-center py-20">
            <p className="text-gray-400">Curriculum is currently being prepared.</p>
          </div>
        </main>
      );
    }
    notFound();
  }

  const activeModule = modules[index];

  return (
    <main className="w-full lg:w-[55%] glass-panel p-6 md:p-10 min-h-[85vh]">
      <article>
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

        {typeof activeModule === 'object' && activeModule.image && (
          <figure className="mb-10 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
            <img 
              src={activeModule.image} 
              alt={activeModule.title} 
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </figure>
        )}

        <div className="max-w-none">
          {typeof activeModule === 'object' && activeModule.explanation ? (
            <ReactMarkdown 
              rehypePlugins={[rehypeSlug]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-sm" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-white mb-6 mt-12 pb-2 border-b-2 border-gray-800 flex items-center gap-3 before:content-[''] before:block before:w-2 before:h-8 before:bg-[#2f8D46] before:rounded-sm" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-semibold text-gray-100 mb-4 mt-8" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-6 text-[1.05rem] tracking-wide" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-4 mb-8 ml-6 list-disc list-outside text-gray-300 marker:text-[#2f8D46]" {...props} />,
                li: ({node, ...props}) => (
                  <li className="pl-2 transition-colors duration-300 hover:text-white">
                    {props.children}
                  </li>
                ),
                a: ({node, ...props}) => {
                  const linkClass = "font-medium text-[#4B8BFF] hover:text-[#7BAAFF] underline decoration-[#4B8BFF]/50 hover:decoration-[#7BAAFF] decoration-2 underline-offset-4 transition-all duration-300";
                  if (props.href && props.href.startsWith('/')) {
                    return <Link href={props.href} className={linkClass}>{props.children}</Link>;
                  }
                  if (props.href && props.href.startsWith('#')) {
                    return <a href={props.href} className={linkClass}>{props.children}</a>;
                  }
                  return <a target="_blank" rel="noopener noreferrer" className={linkClass}>{props.children}</a>;
                },
                pre: ({children, ...props}) => {
                  const codeProps = children?.props || {};
                  const match = /language-(\w+)/.exec(codeProps.className || '');
                  return (
                    <div className="relative my-8 rounded-xl overflow-hidden border border-gray-800/80 bg-[#0a0a0a] shadow-2xl group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-center px-4 py-2.5 bg-[#111] border-b border-gray-800/80">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        </div>
                        {match && <span className="ml-auto text-xs font-mono text-gray-500 uppercase tracking-widest">{match[1]}</span>}
                      </div>
                      <pre className="p-5 overflow-x-auto text-[0.9rem] leading-loose font-mono text-gray-300 relative z-10" {...props}>
                        {children}
                      </pre>
                    </div>
                  );
                },
                code: ({node, className, children, ...props}) => {
                  const isInline = !className || !className.includes('language-');
                  return isInline ? (
                    <code className="px-1.5 py-0.5 mx-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[0.9em] font-mono shadow-[0_0_10px_rgba(99,102,241,0.1)]" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({node, ...props}) => (
                  <blockquote className="my-8 pl-6 py-4 border-l-4 border-[#2f8D46] bg-[#2f8D46]/10 rounded-r-xl italic text-gray-300 relative overflow-hidden shadow-lg" {...props}>
                    {props.children}
                  </blockquote>
                )
              }}
            >
              {activeModule.explanation}
            </ReactMarkdown>
          ) : (
            <div className="flex items-center justify-center p-12 border border-gray-800 border-dashed rounded-2xl bg-gray-900/20">
              <p className="text-gray-400 text-lg">Detailed explanation coming soon. Stay tuned for an in-depth dive into this topic.</p>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
