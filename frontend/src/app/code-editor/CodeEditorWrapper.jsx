"use client";

import dynamic from 'next/dynamic';

const CodeEditorClient = dynamic(() => import('./CodeEditorClient'), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center text-gray-500 font-mono text-sm">Loading editor workspace...</div>
});

export default function CodeEditorWrapper({ initialChallengeId }) {
  return <CodeEditorClient initialChallengeId={initialChallengeId} />;
}
