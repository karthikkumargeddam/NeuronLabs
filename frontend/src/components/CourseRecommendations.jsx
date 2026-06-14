"use client";

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Sparkles, Clock, Star } from 'lucide-react';

const RECOMMENDED_COURSES = [
  { id: 1, title: 'Advanced Neural Networks', instructor: 'Dr. Alan Turing', duration: '8h 20m', rating: 4.9, image: 'https://api.dicebear.com/7.x/shapes/svg?seed=nn&backgroundColor=0a0a0a' },
  { id: 2, title: 'Transformer Architecture in Depth', instructor: 'Geoffrey Hinton', duration: '12h 15m', rating: 5.0, image: 'https://api.dicebear.com/7.x/shapes/svg?seed=gpt&backgroundColor=0a0a0a' },
  { id: 3, title: 'Reinforcement Learning 101', instructor: 'Richard Sutton', duration: '6h 40m', rating: 4.8, image: 'https://api.dicebear.com/7.x/shapes/svg?seed=rl&backgroundColor=0a0a0a' },
  { id: 4, title: 'Applied Generative AI', instructor: 'Ian Goodfellow', duration: '9h 10m', rating: 4.9, image: 'https://api.dicebear.com/7.x/shapes/svg?seed=genai&backgroundColor=0a0a0a' },
  { id: 5, title: 'Ethics in Artificial Intelligence', instructor: 'Timnit Gebru', duration: '4h 30m', rating: 4.7, image: 'https://api.dicebear.com/7.x/shapes/svg?seed=ethics&backgroundColor=0a0a0a' }
];

export default function CourseRecommendations() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-12 bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-white/5 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Sparkles className="text-yellow-400 w-5 h-5" /> Recommended For You
          </h2>
          <p className="text-sm text-neutral-400 mt-1">Based on your enrollment history and trending AI topics.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
      >
        {RECOMMENDED_COURSES.map(course => (
          <Link href={`/courses`} key={course.id} className="block shrink-0 w-[280px] sm:w-[320px] snap-start group">
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#111] hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 h-full flex flex-col">
              <div className="h-40 relative overflow-hidden bg-[#050505]">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {course.rating}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors line-clamp-1">{course.title}</h3>
                <p className="text-sm text-neutral-400 mb-4">{course.instructor}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500">
                    <Clock className="w-3.5 h-3.5" /> {course.duration}
                  </div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">View</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
