import ReactMarkdown from 'react-markdown';

async function getPageContent(slug) {
  try {
    const res = await fetch(`http://127.0.0.1:1337/api/pages?filters[slug][$eq]=${slug}`, { cache: 'no-store' });
    const data = await res.json();
    return data?.data?.[0]?.content || 'Content not found.';
  } catch (error) {
    return 'Failed to load content.';
  }
}

export default async function PrivacyPolicyPage() {
  const content = await getPageContent('privacy');

  return (
    <div className="w-full max-w-4xl mx-auto mt-32 px-6 md:px-12 mb-24 relative z-10">
      <div className="glass-panel p-12 rounded-3xl border border-gray-800/80 bg-[#0a0a0a]/90">
        <h1 className="text-4xl font-black mb-8 text-white">
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert max-w-none font-mono text-gray-400">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
