import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import { fetchAPI } from "../../../lib/api";
import Link from "next/link";
import { Award, Download, Share2 } from "lucide-react";

async function getCourseData(uuid) {
  try {
    const isNumericId = /^\d+$/.test(uuid);
    
    const filters = {
      $or: [
        { uuid: { $eq: uuid } },
        { documentId: { $eq: uuid } }
      ]
    };
    
    if (isNumericId) {
      filters.$or.push({ id: { $eq: parseInt(uuid) } });
    }

    const response = await fetchAPI('/api/courses', { filters }, { next: { revalidate: 60 } });
    
    if (response?.data?.length > 0) {
      const course = response.data[0];
      return course.attributes || course;
    }
  } catch (e) {
    console.error("Failed to fetch course from Strapi", e);
  }
  
  // Fallback for demo purposes
  if (uuid === "advanced-dl") {
    return { title: "Advanced Deep Learning", level: "PhD" };
  }
  return null;
}

export default async function CertificatePage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const course = await getCourseData(id);

  if (!course || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Authentication Required</h2>
        <p className="text-gray-400 mb-8">Please sign in to view your certificate.</p>
        <Link href="/login" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-full font-bold">
          Sign In
        </Link>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <Award className="text-yellow-400 w-10 h-10" /> Course Completion
          </h1>
          <p className="text-gray-400 mt-2">Congratulations on completing {course.title}</p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
            <Share2 className="w-5 h-5" /> Share
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all hover:scale-105">
            <Download className="w-5 h-5" /> Download PDF
          </button>
        </div>
      </div>

      {/* Certificate Frame */}
      <div className="w-full bg-gradient-to-br from-[#111] to-[#0a0a0a] p-2 md:p-4 rounded-xl border border-gray-800 shadow-2xl relative">
        {/* Certificate Inner Border */}
        <div className="w-full h-full border-[12px] border-double border-gray-700/50 p-8 md:p-16 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-10 text-center">
          
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10">
            <h2 className="text-cyan-400 font-mono tracking-[0.3em] uppercase mb-12 text-sm md:text-base font-bold">
              NeuronLabs Certification
            </h2>
            
            <h3 className="text-5xl md:text-7xl font-serif text-white mb-6">Certificate of Completion</h3>
            
            <p className="text-gray-400 text-lg mb-8 italic">This proudly certifies that</p>
            
            <h4 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8 border-b-2 border-gray-800 pb-4 inline-block px-12">
              {session.user.name || "Student"}
            </h4>
            
            <p className="text-gray-400 text-lg mb-4 italic">has successfully completed all modules of the advanced curriculum</p>
            
            <h5 className="text-3xl md:text-4xl font-bold text-white mb-16 max-w-3xl mx-auto">
              {course.title}
            </h5>

            <div className="flex flex-col md:flex-row justify-between items-center mt-20 border-t border-gray-800/50 pt-12 max-w-4xl mx-auto">
              <div className="mb-8 md:mb-0">
                <p className="text-white font-bold text-xl">{currentDate}</p>
                <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">Date of Issuance</p>
              </div>
              
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center border-4 border-[#111] shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                <Award className="text-white w-12 h-12" />
              </div>
              
              <div className="mt-8 md:mt-0 text-right">
                <p className="text-cyan-400 font-serif italic text-3xl">Dr. Richard Feynman</p>
                <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">Lead Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
