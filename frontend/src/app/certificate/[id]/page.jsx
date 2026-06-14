"use client";

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Share2, ShieldCheck, CheckCircle } from 'lucide-react';

export default function CertificatePage({ params }) {
  const certificateRef = useRef(null);

  // Mock data based on ID
  const certificateId = params.id;
  const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const studentName = "Research Scholar"; // Could fetch from API using ID
  const courseName = "Advanced Quantum Physics & Computing";

  const downloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;
    
    // Temporarily adjust styles for better PDF rendering
    element.style.transform = "scale(1)";
    
    const canvas = await html2canvas(element, { 
      scale: 2,
      backgroundColor: '#0a0a0a',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`NeuronLabs-Certificate-${certificateId}.pdf`);
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`I just completed ${courseName} on NeuronLabs!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center py-12 px-4">
      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={downloadPDF}
          className="bg-[#111] hover:bg-[#222] border border-[#333] text-gray-200 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-mono uppercase tracking-widest text-sm"
        >
          <Download className="w-5 h-5" /> Download PDF
        </button>
        <button 
          onClick={shareToLinkedIn}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-mono uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          <Share2 className="w-5 h-5" /> Add to LinkedIn
        </button>
      </div>

      {/* Certificate Frame */}
      <div 
        ref={certificateRef}
        className="w-full max-w-[1000px] aspect-[1.414] bg-[#0a0a0a] border-[1px] border-cyan-500/30 p-12 relative overflow-hidden flex flex-col justify-between"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 60%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-cyan-500/50 m-8"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-cyan-500/50 m-8"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-cyan-500/50 m-8"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-cyan-500/50 m-8"></div>

        {/* Content */}
        <div className="text-center z-10 flex flex-col items-center mt-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              NEURON
            </span>
            <span className="text-4xl font-light text-white tracking-widest">
              LABS
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-cyan-400 mb-12">
            <ShieldCheck className="w-6 h-6" />
            <span className="tracking-[0.3em] uppercase text-sm font-bold">Verified Proof of Skill</span>
          </div>

          <p className="text-gray-400 text-lg uppercase tracking-widest mb-4">This certifies that</p>
          <h1 className="text-6xl font-bold text-white mb-8 capitalize" style={{ fontFamily: 'serif' }}>{studentName}</h1>
          <p className="text-gray-400 text-lg mb-4">has successfully completed the advanced technical curriculum for</p>
          <h2 className="text-3xl font-bold text-cyan-400 mb-12 tracking-wide uppercase">{courseName}</h2>
        </div>

        {/* Footer Signatures */}
        <div className="flex justify-between items-end z-10 px-12">
          <div className="text-left">
            <div className="w-48 border-b border-gray-600 mb-2"></div>
            <p className="text-gray-400 uppercase tracking-widest text-xs">Date of Issue</p>
            <p className="text-white font-mono">{issueDate}</p>
          </div>

          <div className="flex flex-col items-center opacity-40">
            <CheckCircle className="w-24 h-24 text-green-500 mb-2" />
            <p className="font-mono text-xs text-gray-500">ID: {certificateId.toUpperCase()}</p>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="w-48 border-b border-gray-600 mb-2"></div>
            <p className="text-gray-400 uppercase tracking-widest text-xs">Authored By</p>
            <p className="text-white font-mono">NeuronLabs Automated Evaluation System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
