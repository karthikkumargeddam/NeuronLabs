export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronlabs.online';
  
  // Static routes
  const routes = ['', '/courses'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic courses
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://wise-action-3f2ccfecaa.strapiapp.com';
    const res = await fetch(`${strapiUrl}/api/courses`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const courses = json.data;
      
      const courseRoutes = courses.map((course) => ({
        url: `${baseUrl}/courses/${course.documentId || course.id}`,
        lastModified: course.updatedAt || new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      
      return [...routes, ...courseRoutes];
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return routes;
}
