import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";

import { fetchAPI } from "../../../lib/api";
import CourseSidebar from "./CourseSidebar";
import RightSidebar from "./RightSidebar";

async function getCourseData(uuid) {
  try {
    const isNumericId = /^\d+$/.test(uuid);
    
    const filters = {
      $or: [
        { uuid: { $eq: uuid } },
        { documentId: { $eq: uuid } }
      ]
    };
    
    // Only query integer ID if the slug is actually a number
    if (isNumericId) {
      filters.$or.push({ id: { $eq: parseInt(uuid) } });
    }

    const response = await fetchAPI('/api/courses', {
      filters: filters,
      populate: '*'
    }, { next: { revalidate: 60 } });
    
    if (response?.data?.length > 0) {
      const course = response.data[0];
      const attrs = course.attributes || course;
      // Inject mock modules if empty so demo works everywhere (Sidebar, Layout, Page)
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
  
  // Fallback for demo purposes if Strapi is empty
  if (uuid === "advanced-dl") {
    return {
      title: "Advanced Deep Learning",
      level: "PhD",
      description: "Dive deep into Transformer architectures, attention mechanisms, and custom GPU kernels.",
      modules: ["Attention is All You Need", "Custom CUDA Kernels", "Distributed Training"],
    };
  }
  
  return null;
}

import { CourseProvider } from "../../../components/CourseContext";

export default async function CourseLayout({ children, params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const course = await getCourseData(id);

  if (!course) {
    notFound();
  }

  const userRole = session?.user?.role || "Guest";
  const isAuthorized = true;
  const totalModules = course.modules?.length || 0;

  return (
    <CourseProvider courseId={course.documentId || course.uuid || id} totalModules={totalModules}>
      <div className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <CourseSidebar course={course} />
          
          {/* CENTER: Main Article Content (60%) */}
          {children}

          <RightSidebar courseId={course.documentId} isAuthorized={isAuthorized} />
        </div>
      </div>
    </CourseProvider>
  );
}
