import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { fetchAPI } from "../../../../lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import RazorpayCheckout from "../../../../../components/RazorpayCheckout";

async function getCourseData(uuid) {
  try {
    const response = await fetchAPI('/api/courses', {
      filters: { uuid: { $eq: uuid } },
      populate: '*'
    }, { next: { revalidate: 60 } });
    
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
  const session = await getServerSession(authOptions);
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

        <div className="max-w-none relative">
          {typeof activeModule === 'object' && activeModule.explanation ? (
            <>
              {index > 0 && !session?.user?.isPro ? (
                <div className="relative">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a] z-10 flex flex-col items-center justify-end pb-20">
                     <div className="glass-panel p-8 text-center border-[#0f9d58]/30 max-w-lg mb-8 shadow-2xl relative z-20">
                       <div className="w-16 h-16 bg-[#0f9d58]/20 text-[#0f9d58] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#0f9d58]/50 shadow-[0_0_15px_rgba(15,157,88,0.3)]">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                         </svg>
                       </div>
                       <h2 className="text-3xl font-extrabold text-white mb-4">Premium Module</h2>
                       <p className="text-gray-400 mb-8 leading-relaxed">
                         This advanced module is locked. Upgrade to the ₹299 Pro Plan to unlock this deep dive, interactive sandboxes, and personalized AI tutoring.
                       </p>
                       <RazorpayCheckout amount={299} userEmail={session?.user?.email} />
                     </div>
                   </div>
                   <div className="opacity-20 select-none blur-[6px] pointer-events-none h-[600px] overflow-hidden">
                      <ReactMarkdown 
                        rehypePlugins={[rehypeSlug]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-sm" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-white mb-6 mt-12 pb-2 border-b-2 border-gray-800 flex items-center gap-3 before:content-[''] before:block before:w-2 before:h-8 before:bg-[#2f8D46] before:rounded-sm" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-2xl font-semibold text-gray-100 mb-4 mt-8" {...props} />,
                          p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-6 text-[1.05rem] tracking-wide" {...props} />,
                          ul: ({node, ...props}) => <ul className="space-y-4 mb-8 ml-6 list-disc list-outside text-gray-300 marker:text-[#2f8D46]" {...props} />,
                          li: ({node, ...props}) => <li className="pl-2" {...props} />,
                          pre: ({children, ...props}) => <pre className="p-5 overflow-x-auto text-[0.9rem] leading-loose font-mono text-gray-300 relative z-10" {...props}>{children}</pre>,
                          code: ({node, className, children, ...props}) => <code className={className} {...props}>{children}</code>,
                          blockquote: ({node, ...props}) => <blockquote className="my-8 pl-6 py-4 border-l-4 border-[#2f8D46] bg-[#2f8D46]/10 rounded-r-xl italic text-gray-300" {...props}>{props.children}</blockquote>
                        }}
                      >
                        {activeModule.explanation.substring(0, 1000) + '...'}
                      </ReactMarkdown>
                   </div>
                </div>
              ) : (
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
              )}
            </>
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
