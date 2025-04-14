'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { FaStar, FaUsers, FaMapMarkerAlt, FaCalendar, FaCog } from 'react-icons/fa';
import Image from 'next/image'; // 使用 Next.js Image 元件優化圖片加載
import Link from 'next/link'; // 導入 Link
import { getCourses, Course } from '../services/firestoreService'; // 導入服務和介面
import { useAuth } from '../context/AuthContext'; // 導入 useAuth

const ClassCoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth(); // 獲取用戶和加載狀態

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      const fetchedCourses = await getCourses('date', 'asc'); // 按日期升序獲取
      setCourses(fetchedCourses);
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  const isAdmin = user && user.email === 'moodapp2023@gmail.com'; // 檢查是否為管理員

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center mb-6 relative"> {/* 添加相對定位 */} 
          <h1 className="text-3xl font-bold text-center text-purple-700 dark:text-purple-300">
            最新課程
          </h1>
          {/* 條件渲染管理員連結 */} 
          {!authLoading && isAdmin && (
            <Link 
              href="/admin/courses"
              className="absolute right-0 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 sm:ml-4 px-3 py-1.5 bg-indigo-600 text-white text-xs sm:text-sm rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center whitespace-nowrap"
            >
               <FaCog className="mr-1 hidden sm:inline" />
              課程管理
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-10">
             <p className="text-gray-600 dark:text-gray-400">正在加載課程...</p>
             {/* 可以添加一個加載動畫 */}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id || course.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transform transition duration-300 hover:scale-105">
                <div className="relative h-48 w-full">
                  <Image
                    src={course.image || '/placeholder-image.jpg'} // 提供預設圖片
                    alt={course.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-opacity duration-300"
                    // 可以添加 placeholder 和 blurDataURL
                  />
                  {course.tag && (
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded ${course.tag === '熱門' ? 'bg-red-500' : course.tag === '額滿' ? 'bg-gray-500' : 'bg-blue-500'}`}>
                      {course.tag}
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{course.title}</h2>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">{course.subtitle}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex-grow">{course.description}</p>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                    <div className="flex items-center"><FaUsers className="mr-1.5"/>{course.instructor} | {course.duration}</div>
                    <div className="flex items-center"><FaStar className="mr-1.5 text-yellow-500"/>{course.rating} ({course.students} 位學員)</div>
                    <div className="flex items-center"><FaMapMarkerAlt className="mr-1.5"/>{course.location}</div>
                    <div className="flex items-center"><FaCalendar className="mr-1.5"/>{course.date}</div>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-bold text-purple-700 dark:text-purple-300">{course.price}</span>
                    <Link 
                      href={`/booking/${course.id}`}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors duration-300"
                    >
                      立即報名
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">目前沒有可顯示的課程。</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClassCoursePage; 