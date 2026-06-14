import ReactMarkdown from 'react-markdown';

async function getPageContent(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/pages?filters[slug][$eq]=${slug}`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data?.data?.[0]?.content || 'Content not found.';
  } catch (error) {
    return 'Failed to load content.';
  }
}

export default async function SupportPage() {
  const content = await getPageContent('support');

  return (
    <div className="w-full max-w-4xl mx-auto mt-32 px-6 md:px-12 mb-24 relative z-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse"></div>

      <div className="glass-panel p-12 rounded-3xl border border-gray-800/80 bg-[#0a0a0a]/90 relative overflow-hidden">
        <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </div>
        
        <h1 className="text-4xl font-black mb-8 text-white">
          Support
        </h1>
        
        <div className="prose prose-invert prose-purple max-w-none font-mono text-gray-300">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
