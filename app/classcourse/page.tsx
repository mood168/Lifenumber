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
      try {
        const fetchedCourses = await getCourses('date', 'asc'); // 按日期升序獲取
        
        // 過濾掉過期課程
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 設置時間為 00:00:00 以便比較

        const upcomingCourses = fetchedCourses.filter(course => {
          try {
            // 假設日期格式為 'YYYY/MM/DD'
            const [year, month, day] = course.date.split('/').map(Number);
            const courseDate = new Date(year, month - 1, day); // 月份是 0-based
            courseDate.setHours(0, 0, 0, 0);
            return courseDate >= today; // 只保留今天或未來的課程
          } catch (e) {
            console.error(`解析課程日期時發生錯誤: ${course.date}`, e);
            return false; // 無法解析日期，則不顯示
          }
        });

        setCourses(upcomingCourses);
      } catch (error) {
        console.error("獲取課程時發生錯誤:", error);
        setCourses([]); // 錯誤時清空課程
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 從FireStoreService中檢查是否為管理員
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && user.email) {
        try {
          const { isAdminUser } = await import('../services/firestoreService');
          const adminStatus = await isAdminUser(user.email);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('檢查管理員狀態時發生錯誤:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);


  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center mb-6 relative"> {/* 添加相對定位 */} 
          <h1 className="text-3xl font-bold text-center text-purple-700 dark:text-purple-300">
            最新課程
          </h1>
          {/* 條件渲染管理員連結 */} 
          {!authLoading && isAdmin && (
            <div className="flex gap-2">
              <Link 
                href="/admin/courses"
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs sm:text-sm rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center whitespace-nowrap"
              >
                <FaCog className="mr-1 hidden sm:inline" />
                課程管理
              </Link>
              <Link 
                href="/admin/bookings"
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs sm:text-sm rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center whitespace-nowrap"
              >
                <FaCog className="mr-1 hidden sm:inline" />
                報名管理
              </Link>
              {/* 設置需要是登入帳戶為 mood1app2023@gmail.com 才會顯示此按鈕 */}
              {user && user.email === 'mood1app2023@gmail.com' && (
                <Link 
                  href="/admin/setup"
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs sm:text-sm rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center whitespace-nowrap"
                >
                  <FaCog className="mr-1 hidden sm:inline" />
                  設置
                </Link>
              )}
            </div>
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