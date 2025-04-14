'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCourse, submitBooking, type Course } from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface BookingFormProps {
  courseId: string;
}

const BookingForm = ({ courseId }: BookingFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (courseId) {
        const courseData = await getCourse(courseId);
        setCourse(courseData);
      }
    };
    loadCourse();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!course?.title) {
        throw new Error('課程資訊不完整');
      }
      const bookingData = {
        ...formData,
        courseId,
        userId: user?.uid || '',
        courseTitle: course.title,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      
      await submitBooking(bookingData);
      toast.success('報名成功！我們會盡快與您聯繫');
      setTimeout(() => {
        router.push('/classcourse');
      }, 1500);
    } catch (error) {
      toast.error('報名失敗，請稍後再試');
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!course) {
    return <p className="text-center">載入中...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-purple-700 dark:text-purple-300">
        課程報名 - {course.title}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">課程資訊</h2>
          <p className="text-black dark:text-gray-200">{course.description}</p>
          <div className="mt-2 text-black dark:text-purple-300">
            <p>上課時間：{course.date}</p>
            <p>地點：{course.location}</p>
            <p>費用：{course.price}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">姓名</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">電話</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">報名人數</label>
            <input
              type="number"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              min="1"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">備註</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? '處理中...' : '確認報名'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 