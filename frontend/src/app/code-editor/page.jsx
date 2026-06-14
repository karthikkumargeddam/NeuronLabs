import CodeEditorWrapper from './CodeEditorWrapper';

export const metadata = {
  title: 'Code Editor Practice | NeuronLabs',
  description: 'Practice coding in top 10 programming languages.',
};

export default function CodeEditorPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        <h1 className="text-3xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
          Code Practice Area
        </h1>
        <p className="text-gray-400 mb-6 max-w-2xl text-sm lg:text-base">
          Master the top programming languages. Write, experiment, and save your code snippets directly to your profile.
        </p>
        <div className="flex-1 min-h-[600px] border border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-[#0a0a0a]">
          <CodeEditorWrapper />
        </div>
      </div>
    </div>
  );
}
