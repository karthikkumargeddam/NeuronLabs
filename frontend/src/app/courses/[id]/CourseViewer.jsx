"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import CourseDiscussions from "../../components/CourseDiscussions";
import { useRouter } from "next/navigation";
import { PlayCircle, FileText, HelpCircle, Code, CheckCircle, Award } from "lucide-react";

export default function CourseViewer({ course, isAuthorized }) {
  const router = useRouter();
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [recentCourses, setRecentCourses] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (isAuthorized) {
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/courses?sort=createdAt:desc&pagination[limit]=5`)
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
             const others = data.data.filter(c => c.documentId !== course.documentId).slice(0, 4);
             setRecentCourses(others);
          }
        })
        .catch(err => console.error(err));
    }
  }, [course.documentId, isAuthorized]);

  // Reset quiz state when switching modules
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [activeModuleIndex]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-12 text-center border-red-500/30 max-w-lg">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-gray-400">This course is exclusively for {course.level} scholars. Please sign in with appropriate credentials.</p>
        </div>
      </div>
    );
  }

  const rawModules = course.modules || [];
  
  // Normalize modules to ensure LMS features are visible even on legacy courses
  const modules = rawModules.length > 0 && typeof rawModules[0] === 'object' && rawModules[0].type ? rawModules : [
    {
      type: "video",
      title: "Module 1: Introduction to " + course.title,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1", 
      description: "Welcome to the course. Watch this introductory video lecture to get started with the core concepts."
    },
    {
      type: "article",
      title: "Module 2: Theoretical Foundations",
      explanation: rawModules.length > 0 && rawModules[0].explanation ? rawModules[0].explanation : "### Advanced Theory\n\nHere is the theoretical reading material for this section. Make sure you understand these formulas before proceeding to the quiz.\n\n* Key Concept A\n* Key Concept B",
      image: rawModules.length > 0 && rawModules[0].image ? rawModules[0].image : null
    },
    {
      type: "quiz",
      title: "Module 3: Knowledge Check",
      questions: [
        {
          question: "Which of the following is a key concept covered in Module 2?",
          options: ["Linear Regression", "Quantum Entanglement", "Gradient Descent", "Key Concept A"],
          correctIndex: 3
        },
        {
          question: "Is this course designed for " + course.level + " students?",
          options: ["Yes", "No"],
          correctIndex: 0
        }
      ]
    },
    {
      type: "assignment",
      title: "Module 4: Practical Assignment",
      prompt: "Open the Code Editor and implement a basic script demonstrating the concepts learned. Once your code runs without errors, click Complete Assignment below."
    }
  ];

  const activeModule = modules[activeModuleIndex] || {};
  const gfgGreen = "#0f9d58";
  const isCourseComplete = completedModules.length === modules.length;

  const markModuleComplete = () => {
    if (!completedModules.includes(activeModuleIndex)) {
      setCompletedModules([...completedModules, activeModuleIndex]);
    }
  };

  const handleQuizSubmit = () => {
    if (activeModule.type !== 'quiz') return;
    let score = 0;
    activeModule.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Only mark complete if they passed (100% for this demo)
    if (score === activeModule.questions.length) {
      markModuleComplete();
    }
  };

  const getModuleIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'quiz': return <HelpCircle className="w-5 h-5" />;
      case 'assignment': return <Code className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // Renderers for different module types
  const renderVideo = () => (
    <div className="space-y-6">
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-black">
        <iframe 
          className="w-full h-full"
          src={activeModule.videoUrl} 
          title="Video Player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
        <h3 className="text-xl font-bold mb-2 text-white">Lecture Notes</h3>
        <p className="text-gray-300">{activeModule.description}</p>
      </div>
      {!completedModules.includes(activeModuleIndex) && (
        <button 
          onClick={markModuleComplete}
          className="mt-6 bg-[#0f9d58] hover:bg-[#0d8c4f] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <CheckCircle className="w-5 h-5" /> Mark Video as Watched
        </button>
      )}
    </div>
  );

  const renderArticle = () => (
    <div className="space-y-6">
      {activeModule.image && (
        <figure className="mb-10 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          <img src={activeModule.image} alt={activeModule.title} className="w-full h-auto object-cover max-h-[400px]"/>
        </figure>
      )}
      <div className="prose prose-invert prose-green max-w-none prose-headings:text-white prose-a:text-[#0f9d58] hover:prose-a:underline prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-gray-800 prose-blockquote:border-l-[#0f9d58] prose-blockquote:bg-[#0f9d58]/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
        {activeModule.explanation ? <ReactMarkdown>{activeModule.explanation}</ReactMarkdown> : <p>Detailed explanation coming soon.</p>}
      </div>
      {!completedModules.includes(activeModuleIndex) && (
        <button 
          onClick={markModuleComplete}
          className="mt-8 bg-[#0f9d58] hover:bg-[#0d8c4f] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <CheckCircle className="w-5 h-5" /> Mark Reading as Complete
        </button>
      )}
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-8">
      <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800">
        <p className="text-gray-300 mb-6">Test your knowledge before proceeding. You must answer all questions correctly to pass.</p>
        
        <div className="space-y-8">
          {activeModule.questions?.map((q, qIndex) => (
            <div key={qIndex} className="p-4 bg-[#111] rounded-lg border border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4">{qIndex + 1}. {q.question}</h4>
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
                    <label key={oIndex} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${optClass}`}>
                      <input 
                        type="radio" 
                        name={`question-${qIndex}`} 
                        disabled={quizSubmitted}
                        checked={isSelected}
                        onChange={() => setQuizAnswers({...quizAnswers, [qIndex]: oIndex})}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? (showResult ? (isCorrect ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500') : 'border-[#0f9d58] bg-[#0f9d58]') : 'border-gray-600'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span className={showResult && isCorrect ? 'font-bold' : ''}>{opt}</span>
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
              disabled={Object.keys(quizAnswers).length < activeModule.questions?.length}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              Submit Answers
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <span className={`text-xl font-bold ${quizScore === activeModule.questions.length ? 'text-green-500' : 'text-red-500'}`}>
                  Score: {quizScore} / {activeModule.questions.length}
                </span>
                {quizScore === activeModule.questions.length ? (
                  <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Passed!</span>
                ) : (
                  <button onClick={() => {setQuizSubmitted(false); setQuizAnswers({});}} className="text-blue-400 underline hover:text-blue-300">Retry Quiz</button>
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
      <div className="bg-[#1a1a1a] p-8 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <Code className="text-blue-400 w-6 h-6" /> Coding Assignment
        </h3>
        <p className="text-gray-300 mb-6 text-lg">{activeModule.prompt}</p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/code-editor')}
            className="bg-[#111] hover:bg-[#222] border border-gray-700 text-gray-200 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-mono"
          >
            Open Code Editor ↗
          </button>
          {!completedModules.includes(activeModuleIndex) && (
            <button 
              onClick={markModuleComplete}
              className="bg-[#0f9d58] hover:bg-[#0d8c4f] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <CheckCircle className="w-5 h-5" /> Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in pb-20">
      
      {/* 3-Column Layout Container */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* =========================================
            LEFT SIDEBAR: Navigation Menu (20%)
        ========================================= */}
        <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-8 flex flex-col gap-6">
          <div className="glass-panel p-4 overflow-y-auto max-h-[70vh] border-r border-[#0f9d58]/20">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-gray-800">
               <span className="w-2 h-6 rounded-full" style={{ backgroundColor: gfgGreen }}></span>
               Course Curriculum
            </h3>
            
            <div className="flex flex-col gap-2">
              {modules.map((module, index) => {
                const isActive = index === activeModuleIndex;
                const isCompleted = completedModules.includes(index);
                
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveModuleIndex(index)}
                    className={`text-left px-4 py-3 flex justify-between items-center gap-3 rounded-md transition-all text-sm font-medium border-l-4 ${
                      isActive 
                        ? 'bg-[#0f9d58]/10 text-white border-[#0f9d58]' 
                        : 'text-gray-400 border-transparent hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className={`${isActive ? 'text-[#0f9d58]' : 'text-gray-500'}`}>
                        {getModuleIcon(module.type)}
                      </span>
                      <span className="truncate">{module.title}</span>
                    </div>
                    {isCompleted && <CheckCircle className="w-4 h-4 text-[#0f9d58] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Certificate Claim Block */}
          <div className={`p-6 rounded-xl border ${isCourseComplete ? 'bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border-cyan-500' : 'bg-[#111] border-gray-800'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Award className={`w-8 h-8 ${isCourseComplete ? 'text-yellow-400' : 'text-gray-600'}`} />
              <div>
                <h4 className="font-bold text-white">Course Certificate</h4>
                <p className="text-xs text-gray-400">Complete all modules to unlock</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
              ></div>
            </div>

            <button 
              onClick={() => router.push(`/certificate/${course.documentId || course.uuid || 'demo'}`)}
              disabled={!isCourseComplete}
              className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all shadow-lg ${
                isCourseComplete 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isCourseComplete ? 'Claim Certificate' : `${completedModules.length}/${modules.length} Completed`}
            </button>
          </div>
        </aside>

        {/* =========================================
            CENTER: Main Module Content (60%)
        ========================================= */}
        <main className="w-full lg:w-[55%] glass-panel p-6 md:p-10 min-h-[85vh]">
          {modules.length > 0 ? (
            <article>
              {/* Header */}
              <header className="mb-8 border-b border-gray-800 pb-6">
                <div className="flex items-center gap-3 text-[#0f9d58] mb-4 uppercase tracking-widest text-xs font-bold">
                  {getModuleIcon(activeModule.type)} {activeModule.type}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white leading-tight">
                  {activeModule.title}
                </h1>
              </header>

              {/* Dynamic Content Renderer */}
              {activeModule.type === 'video' && renderVideo()}
              {activeModule.type === 'article' && renderArticle()}
              {activeModule.type === 'quiz' && renderQuiz()}
              {activeModule.type === 'assignment' && renderAssignment()}

              {/* Course Discussions (Only on articles for now) */}
              {activeModule.type === 'article' && (
                <div className="mt-12">
                  <CourseDiscussions courseId={course.documentId} />
                </div>
              )}
            </article>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">Curriculum is currently being prepared.</p>
            </div>
          )}
        </main>

        {/* =========================================
            RIGHT SIDEBAR: Recent Courses (20%)
        ========================================= */}
        <aside className="w-full lg:w-[20%] shrink-0 lg:sticky lg:top-8 flex flex-col gap-6">
          <div className="glass-panel p-5 border-t-4" style={{ borderColor: gfgGreen }}>
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Recent Courses</h4>
            {recentCourses.length > 0 ? (
              <div className="flex flex-col gap-4">
                {recentCourses.map(rc => (
                  <a key={rc.documentId} href={`/courses/${rc.uuid}`} className="group block">
                    <h5 className="text-sm font-semibold text-gray-300 group-hover:text-[#0f9d58] transition-colors leading-tight">{rc.title}</h5>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono uppercase bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                        {rc.level}
                      </span>
                    </div>
                  </a>
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

      </div>
    </div>
  );
}
