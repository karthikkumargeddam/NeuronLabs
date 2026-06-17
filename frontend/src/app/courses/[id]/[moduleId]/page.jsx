import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import { fetchAPI } from "../../../../lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

import RazorpayCheckout from "../../../../components/RazorpayCheckout";
import ModuleRenderer from "../../../../components/ModuleRenderer";

function getRelevantVideo(course, moduleTitle) {
  const cTitle = (course.title || "").toLowerCase();
  const mTitle = (moduleTitle || "").toLowerCase();
  const title = cTitle + " " + mTitle;

  if (title.includes("deep learning")) return "https://www.youtube.com/embed/VyWAvY2CF9c?rel=0&modestbranding=1"; // FCC Deep Learning
  if (title.includes("machine learning") || title.includes("ml")) return "https://www.youtube.com/embed/i_LwzRmAUM?rel=0&modestbranding=1"; // FCC ML
  if (title.includes("computer vision")) return "https://www.youtube.com/embed/Oqm9vs10tBg?rel=0&modestbranding=1"; // CNNs
  if (title.includes("data science") || title.includes("data engineering")) return "https://www.youtube.com/embed/ua-CiDNNj30?rel=0&modestbranding=1"; // FCC Data Science
  if (title.includes("python")) return "https://www.youtube.com/embed/rfscVS0vtbw?rel=0&modestbranding=1"; // FCC Python
  if (title.includes("generative ai") || title.includes("llm") || title.includes("agent") || title.includes("reasoning") || title.includes("react")) return "https://www.youtube.com/embed/mEsleV16qdo?rel=0&modestbranding=1"; // FCC Gen AI
  
  // Default fallback to Stanford CS229
  return "https://www.youtube.com/embed/8_LwD1o5oEE?rel=0&modestbranding=1";
}

async function getCourseData(uuid) {
  try {
    const response = await fetchAPI('/api/courses', {
      filters: { uuid: { $eq: uuid } },
      populate: '*'
    }, { next: { revalidate: 60 } });
    
    if (response?.data?.length > 0) {
      const course = response.data[0];
      const attrs = course.attributes || course;
      if (!attrs.modules || attrs.modules.length === 0) {
        attrs.modules = [
          { title: "Introduction Video" },
          { title: "Core Concepts Reading" },
          { title: "Knowledge Check" },
          { title: "Practical Assignment" }
        ];
      }
      return attrs;
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

  let activeModule = modules[index];

  // Normalizer: If the Strapi module is just text or missing LMS types,
  // we intelligently mock the first 4 modules to show off LMS features for testing.
  if (typeof activeModule !== 'object' || !activeModule.type) {
    const baseText = typeof activeModule === 'object' ? activeModule.explanation : activeModule;
    const baseTitle = typeof activeModule === 'object' ? activeModule.title : `Module ${index + 1}`;
    
    if (index === 0) {
      activeModule = {
        type: 'video',
        title: baseTitle,
        videoUrl: getRelevantVideo(course, baseTitle),
        description: baseText || "Welcome to the course. Watch this introductory video lecture to get started with the core concepts."
      };
    } else if (index === 1) {
      activeModule = {
        type: 'article',
        title: baseTitle,
        explanation: baseText || "Detailed explanation goes here.",
        image: typeof activeModule === 'object' ? activeModule.image : null
      };
    } else if (index === 2) {
      activeModule = {
        type: 'quiz',
        title: baseTitle,
        questions: [
          {
            question: "Which of the following is a key concept covered in the previous module?",
            options: ["Linear Regression", "Quantum Entanglement", "Gradient Descent", "All of the above"],
            correctIndex: 3
          },
          {
            question: "Is this course designed for advanced scholars?",
            options: ["Yes", "No"],
            correctIndex: 0
          }
        ]
      };
    } else if (index === 3) {
      activeModule = {
        type: 'assignment',
        title: baseTitle,
        prompt: "Open the Code Editor and implement a basic script demonstrating the concepts learned. Once your code runs without errors, click Complete Assignment."
      };
    } else {
      activeModule = {
        type: 'article',
        title: baseTitle,
        explanation: baseText
      };
    }
  }

  const getModuleIcon = (type) => {
    switch (type) {
      case 'video': return "▶";
      case 'article': return "📄";
      case 'quiz': return "❓";
      case 'assignment': return "💻";
      default: return "📄";
    }
  };

  return (
    <main className="w-full lg:w-[55%] glass-panel p-6 md:p-10 min-h-[85vh]">
      <article>
        <header className="mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 text-[#0f9d58] mb-4 uppercase tracking-widest text-xs font-bold">
            <span className="text-lg">{getModuleIcon(activeModule.type)}</span> {activeModule.type}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
            {activeModule.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1 bg-[#0f9d58]/10 text-[#0f9d58] px-3 py-1 rounded-full border border-[#0f9d58]/30">
              Difficulty: {course.level}
            </span>
            <span className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
              Read Time: ~15 min
            </span>
          </div>
        </header>

        <div className="max-w-none relative">
          {false && !session?.user?.isPro ? (
            <div className="relative">
                {/* Premium Lock UI skipped for testing */}
            </div>
          ) : (
            <ModuleRenderer module={activeModule} index={index} />
          )}
        </div>
      </article>
    </main>
  );
}
