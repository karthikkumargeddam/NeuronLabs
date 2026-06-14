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

export default async function ApiReferencePage() {
  const content = await getPageContent('api-reference');

  return (
    <div className="w-full max-w-5xl mx-auto mt-32 px-6 md:px-12 mb-24 relative z-10">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse"></div>

      <div className="glass-panel p-12 rounded-3xl border border-gray-800/80 bg-[#0a0a0a]/90 relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          API Reference
        </h1>
        
        <div className="prose prose-invert prose-indigo max-w-none font-mono text-gray-300">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
