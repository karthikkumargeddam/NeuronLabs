"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { CheckCircle, PlayCircle, FileText, HelpCircle, Code } from "lucide-react";
import { useCourseProgress } from "./CourseContext";

export default function ModuleRenderer({ module, index }) {
  const { markComplete, isCompleted } = useCourseProgress();
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const completed = isCompleted(index);

  const handleQuizSubmit = () => {
    if (module.type !== 'quiz') return;
    let score = 0;
    module.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Only mark complete if they passed (100%)
    if (score === module.questions.length) {
      markComplete(index);
    }
  };

  const renderVideo = () => (
    <div className="space-y-6">
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-black">
        <iframe 
          className="w-full h-full"
          src={module.videoUrl} 
          title="Video Player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold mb-2 text-white">Lecture Notes</h3>
        <p className="text-gray-300">{module.description}</p>
      </div>
      {!completed ? (
        <button 
          onClick={() => markComplete(index)}
          className="mt-6 bg-[#0f9d58] hover:bg-[#0d8c4f] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <CheckCircle className="w-5 h-5" /> Mark Video as Watched
        </button>
      ) : (
        <div className="mt-6 text-[#0f9d58] font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Completed
        </div>
      )}
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-8">
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
        <p className="text-gray-300 mb-6 text-lg border-l-4 border-[#0f9d58] pl-4">
          Test your knowledge before proceeding. You must answer all questions correctly to pass.
        </p>
        
        <div className="space-y-8">
          {module.questions?.map((q, qIndex) => (
            <div key={qIndex} className="p-5 bg-[#111] rounded-xl border border-gray-800 shadow-lg">
              <h4 className="text-lg font-semibold text-white mb-4 leading-relaxed">{qIndex + 1}. {q.question}</h4>
              <div className="space-y-3">
                {q.options.map((opt, oIndex) => {
                  const isSelected = quizAnswers[qIndex] === oIndex;
                  const isCorrect = q.correctIndex === oIndex;
                  const showResult = quizSubmitted;
                  
                  let optClass = "border-gray-700 bg-[#1a1a1a] hover:border-[#0f9d58]";
                  if (isSelected && !showResult) optClass = "border-[#0f9d58] bg-[#0f9d58]/10 text-[#0f9d58]";
                  if (showResult && isCorrect) optClass = "border-green-500 bg-green-500/20 text-green-400";
                  if (showResult && isSelected && !isCorrect) optClass = "border-red-500 bg-red-500/20 text-red-400";

                  return (
                    <label key={oIndex} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${optClass}`}>
                      <input 
                        type="radio" 
                        name={`question-${qIndex}`} 
                        disabled={quizSubmitted}
                        checked={isSelected}
                        onChange={() => setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border flex flex-shrink-0 items-center justify-center ${isSelected ? (showResult ? (isCorrect ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500') : 'border-[#0f9d58] bg-[#0f9d58]') : 'border-gray-600'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className={`${showResult && isCorrect ? 'font-bold' : ''}`}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between">
          {!quizSubmitted ? (
            <button 
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length < module.questions?.length}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:shadow-none"
            >
              Submit Answers
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold ${quizScore === module.questions.length ? 'text-green-500' : 'text-red-500'}`}>
                  Score: {quizScore} / {module.questions.length}
                </span>
                {quizScore === module.questions.length ? (
                  <span className="text-green-400 flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                    <CheckCircle className="w-5 h-5" /> Quiz Passed!
                  </span>
                ) : (
                  <button onClick={() => {setQuizSubmitted(false); setQuizAnswers({});}} className="text-blue-400 underline hover:text-blue-300 font-medium">Retry Quiz</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAssignment = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-black p-8 rounded-2xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[60px] rounded-full mix-blend-screen pointer-events-none"></div>
        <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
          <Code className="text-blue-400 w-8 h-8" /> Coding Assignment
        </h3>
        <p className="text-gray-300 mb-8 text-lg leading-relaxed">{module.prompt}</p>
        
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/code-editor"
            target="_blank"
            className="bg-[#111] hover:bg-[#222] border border-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-mono shadow-lg"
          >
            Open Code Editor ↗
          </Link>
          {!completed ? (
            <button 
              onClick={() => markComplete(index)}
              className="bg-[#0f9d58] hover:bg-[#0d8c4f] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(15,157,88,0.3)]"
            >
              <CheckCircle className="w-5 h-5" /> Mark as Completed
            </button>
          ) : (
            <div className="px-6 py-3 text-[#0f9d58] font-bold flex items-center gap-2 border border-[#0f9d58]/30 rounded-lg bg-[#0f9d58]/10">
              <CheckCircle className="w-5 h-5" /> Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderArticle = () => (
    <div className="space-y-6">
      {module.image && (
        <figure className="mb-10 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          <img src={module.image} alt={module.title} className="w-full h-auto object-cover max-h-[400px]"/>
        </figure>
      )}
      
      <ReactMarkdown 
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-sm" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-white mb-6 mt-12 pb-2 border-b-2 border-gray-800 flex items-center gap-3 before:content-[''] before:block before:w-2 before:h-8 before:bg-[#0f9d58] before:rounded-sm" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-2xl font-semibold text-gray-100 mb-4 mt-8" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-6 text-[1.05rem] tracking-wide" {...props} />,
          ul: ({node, ...props}) => <ul className="space-y-4 mb-8 ml-6 list-disc list-outside text-gray-300 marker:text-[#0f9d58]" {...props} />,
          li: ({node, ...props}) => <li className="pl-2 transition-colors duration-300 hover:text-white" {...props} />,
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
            <blockquote className="my-8 pl-6 py-4 border-l-4 border-[#0f9d58] bg-[#0f9d58]/10 rounded-r-xl italic text-gray-300 relative overflow-hidden shadow-lg" {...props}>
              {props.children}
            </blockquote>
          )
        }}
      >
        {module.explanation || module.description || "Content goes here."}
      </ReactMarkdown>

      {!completed && (
        <button 
          onClick={() => markComplete(index)}
          className="mt-12 bg-[#0f9d58] hover:bg-[#0d8c4f] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(15,157,88,0.3)] hover:-translate-y-1"
        >
          <CheckCircle className="w-5 h-5" /> Mark Reading as Complete
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {module.type === 'video' && renderVideo()}
      {module.type === 'quiz' && renderQuiz()}
      {module.type === 'assignment' && renderAssignment()}
      {(module.type === 'article' || !module.type) && renderArticle()}
    </div>
  );
}
