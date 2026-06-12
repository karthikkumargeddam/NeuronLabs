import Link from 'next/link';
import { fetchAPI } from '../../lib/api';
import { Suspense } from 'react';

async function CourseList() {
  const response = await fetchAPI('/api/courses', { populate: '*' });
  const courses = response?.data || [];

  if (courses.length === 0) {
    return (
      <div className="text-center p-12 text-gray-400 glass-panel">
        <p>No courses found in the database. Check your Strapi backend.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const attrs = course.attributes || course;
        const id = attrs.uuid || course.id;

        return (
          <Link href={`/courses/${id}`} key={course.id}>
            <div className="glass-panel p-6 h-full hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col">
              <div className="inline-block border border-[var(--primary)] bg-[rgba(79,70,229,0.1)] text-[var(--primary)] text-xs font-mono px-3 py-1 rounded-full mb-4 self-start">
                {attrs.level || 'Standard'}
              </div>
              <h3 className="text-xl font-bold mb-2">{attrs.title}</h3>
              <p className="text-gray-400 text-sm flex-grow line-clamp-3">{attrs.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Course Catalog</h1>
        <p className="text-xl text-gray-400">Explore our comprehensive range of technical deep-dives.</p>
      </div>

      <Suspense fallback={<div className="text-center text-[var(--primary)] animate-pulse text-xl py-12">Loading courses...</div>}>
        <CourseList />
      </Suspense>
    </div>
  );
}
