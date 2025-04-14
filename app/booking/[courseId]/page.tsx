import { getCourses } from '../../services/firestoreService';
import Layout from '../../components/layout/Layout';
import BookingForm from './BookingForm';

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({
    courseId: course.id,
  }));
}

export default function BookingPage({ params }: { params: { courseId: string } }) {
  return (
    <Layout>
      <BookingForm courseId={params.courseId} />
    </Layout>
  );
} 