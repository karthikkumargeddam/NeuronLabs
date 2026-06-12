import { redirect } from 'next/navigation';

export default async function CoursePage({ params }) {
  const { id } = await params;
  redirect(`/courses/${id}/0`);
}
