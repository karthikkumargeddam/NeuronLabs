import GlobalNav from '@/components/GlobalNav';
import PlaygroundClient from './PlaygroundClient';

async function getModels() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/models`, { cache: 'no-store' });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
}

export default async function PlaygroundPage() {
  const models = await getModels();
  
  return (
    <div className="flex flex-col h-screen bg-[#030303] text-white overflow-hidden font-sans selection:bg-rose-500/30">
      <GlobalNav />
      <PlaygroundClient models={models} />
    </div>
  );
}

