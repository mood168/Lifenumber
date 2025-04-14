'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout'; // 調整 Layout 路徑
import { useAuth } from '../../context/AuthContext'; // 調整 AuthContext 路徑
import { useRouter } from 'next/navigation';
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  Course
} from '../../services/firestoreService'; // 調整 firestoreService 路徑

// 從您的數據中複製初始課程列表，用於遷移
const initialCoursesData: Omit<Course, 'id'>[] = [
    {
      title: '生命靈數運用班',
      subtitle: '#需先上完蔡建安老師的生命靈數課#',
      description: '將深入案例講解，結合遊戲互動及特色卡牌運用，讓你在輕鬆的氣氛中探索自己與他人的生命奧秘，體驗全新的自我發現之旅！',
      instructor: '陳瑞嬌老師',
      duration: '4小時',
      rating: 4.8,
      students: 1280,
      location: '台中(霧峰教室)',
      date: '2025/05/10',
      image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      register_url: 'https://meet-1350.com.tw/mycourse/after-class/53340/',
      price: 'NT$ 1,280',
      tag: '熱門'
    },
    {
      title: '生命靈數運用班',
      subtitle: '#需先上完蔡建安老師的生命靈數課#',
      description: '將深入案例講解，結合遊戲互動及特色卡牌運用，讓你在輕鬆的氣氛中探索自己與他人的生命奧秘，體驗全新的自我發現之旅！',
      instructor: '陳瑞嬌老師',
      duration: '4小時',
      rating: 4.8,
      students: 1280,
      location: '台北(9F小教室)',
      date: '2025/05/7',
      image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      register_url: 'https://meet-1350.com.tw/mycourse/after-class/53340/',
      price: 'NT$ 1,280',
      tag: '熱門'
    },
    {
      title: '家庭能量光明燈',
      subtitle: '發現生命靈數之光獨特色彩心靈之旅',
      description: '色彩冒險結合生命靈數的補數顏色和土耳其燈的神秘光芒。透過生命靈數的啟示以獨特的方式探索內在特質，轉化為美麗的土耳其燈設計，為生命注入更多色彩和靈感。',
      instructor: '陳瑞嬌老師',
      duration: '4小時',
      rating: 4.9,
      students: 960,
      location: '竹北市',
      date: '2025/04/19',
      image: 'https://images.unsplash.com/photo-1447015237013-0e80b2786dfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      register_url: 'https://meet-1350.com.tw/mycourse/after-class/53340/',
      price: 'NT$ 1,580',
      tag: '額滿'
    },
    {
      title: '同學會能量光明燈',
      subtitle: '發現生命靈數之光獨特色彩心靈之旅',
      description: '色彩冒險結合生命靈數的補數顏色和土耳其燈的神秘光芒。透過生命靈數的啟示以獨特的方式探索內在特質，轉化為美麗的土耳其燈設計，為生命注入更多色彩和靈感。',
      instructor: '陳瑞嬌老師',
      duration: '4小時',
      rating: 4.7,
      students: 750,
      location: '竹北市',
      date: '2025/04/15',
      image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      register_url: 'https://example.com/register_placeholder',
      price: 'NT$ 1,380',
      tag: '額滿'
    }
  ];

export default function AdminCoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 身份驗證和數據加載
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // 未登入則跳轉
      // 在實際應用中，您還需要檢查用戶是否為管理員
    } else if (user) {
      fetchCourses();
    }
  }, [user, loading, router]);

  const fetchCourses = async () => {
    setIsLoading(true);
    const fetchedCourses = await getCourses('date', 'asc'); // 按日期升序獲取
    setCourses(fetchedCourses);
    setIsLoading(false);
  };

  // 處理數據遷移
  const handleMigrateData = async () => {
    setIsMigrating(true);
    const existingCourses = await getCourses();
    if (existingCourses.length > 0) {
        alert('Firestore 中已有課程資料，無需遷移。');
        setIsMigrating(false);
        return;
    }

    alert('即將開始將初始課程資料寫入 Firestore...');
    let successCount = 0;
    for (const course of initialCoursesData) {
      const success = await addCourse(course);
      if (success) {
        successCount++;
      }
    }
    alert(`資料遷移完成！成功寫入 ${successCount} / ${initialCoursesData.length} 筆課程資料。`);
    setIsMigrating(false);
    fetchCourses(); // 重新獲取數據
  };

  // 處理表單提交 (新增/編輯)
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentCourse) return;

    setIsLoading(true);
    let success = false;

    if (isEditing) {
      // 更新現有課程
      const courseIdToUpdate = currentCourse.id;
      if (courseIdToUpdate) {
        success = await updateCourse(courseIdToUpdate, currentCourse);
      } else {
         console.error("Editing mode but no course ID found!");
         success = false;
         alert('編輯失敗：找不到課程 ID。'); // 添加用戶提示
      }
    } else {
      // 新增課程
      // 驗證數據是否完整
      if (isCourseComplete(currentCourse)) {
         // 類型斷言，因為 isCourseComplete 保證了數據完整性
         const newCourseData = currentCourse as Omit<Course, 'id'>;
         const newCourseId = await addCourse(newCourseData);
         success = !!newCourseId;
      } else {
         alert('請填寫所有必填欄位！');
         success = false;
      }
    }

    if (success) {
      fetchCourses();
      setShowForm(false);
      setCurrentCourse(null);
      setIsEditing(false);
      alert(isEditing ? '課程更新成功！' : '課程新增成功！');
    } else {
       // 錯誤訊息已在上面處理
       if (!isEditing && !isCourseComplete(currentCourse)) { 
           // 驗證失敗訊息已顯示
       } 
       else if (success === false) { // 只處理來自 Firestore 操作的失敗
          alert(isEditing ? '課程更新失敗！' : '課程新增失敗！');
       }
    }
    setIsLoading(false);
  };

  // Helper function to check if all required fields for a new course are present
  const isCourseComplete = (course: Partial<Course>): course is Omit<Course, 'id'> => {
    // id 是可選的，不需要檢查
    return !!(
      course.title &&
      course.subtitle &&
      course.description &&
      course.instructor &&
      course.duration &&
      course.rating !== undefined &&
      course.students !== undefined &&
      course.location &&
      course.date &&
      course.image &&
      course.register_url &&
      course.price &&
      course.tag
    );
  };

  // 處理刪除
  const handleDelete = async (courseId: string | undefined) => {
    if (!courseId) return;
    const confirmed = window.confirm('確定要刪除此課程嗎？');
    if (confirmed) {
      setIsLoading(true);
      const success = await deleteCourse(courseId);
      if (success) {
        fetchCourses(); // 重新加載列表
        alert('課程刪除成功！');
      } else {
        alert('課程刪除失敗！');
      }
      setIsLoading(false);
    }
  };

  // 打開表單 (新增)
  const handleAddNew = () => {
    setCurrentCourse({}); // 清空表單
    setIsEditing(false);
    setShowForm(true);
  };

  // 打開表單 (編輯)
  const handleEdit = (course: Course) => {
    setCurrentCourse(course);
    setIsEditing(true);
    setShowForm(true);
  };

  // 關閉表單
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentCourse(null);
    setIsEditing(false);
  };

  // 表單輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCurrentCourse(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };


  if (loading || isLoading && !isMigrating) {
    return <Layout><div className="p-6 text-center">正在加載管理頁面...</div></Layout>;
  }

  const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700"; // 統一 Input 樣式並加入 text-gray-800
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300"; // 統一 Label 樣式

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">課程管理</h1>

        {/* 數據遷移按鈕 */}        
        <div className="mb-4 text-center">
          <button
            onClick={handleMigrateData}
            disabled={isMigrating || courses.length > 0} // 如果正在遷移或已有數據，則禁用
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 mr-2 ${
                 courses.length > 0 ? 'bg-gray-400 hover:bg-gray-400' : ''
              }`}
          >
            {isMigrating ? '正在遷移...' : (courses.length > 0 ? '數據已存在' : '將初始數據寫入 Firestore')}
          </button>
           <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            新增課程
          </button>
        </div>

        {/* 課程表單 (Modal 或 Inline) */}        
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{isEditing ? '編輯課程' : '新增課程'}</h2>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label htmlFor="title" className={labelClasses}>標題</label>
                  <input type="text" name="title" id="title" value={currentCourse?.title || ''} onChange={handleInputChange} required className={inputClasses}/>
                </div>
                 <div>
                  <label htmlFor="subtitle" className={labelClasses}>副標題</label>
                  <input type="text" name="subtitle" id="subtitle" value={currentCourse?.subtitle || ''} onChange={handleInputChange} className={inputClasses}/>
                </div>
                <div>
                  <label htmlFor="description" className={labelClasses}>描述</label>
                  <textarea name="description" id="description" value={currentCourse?.description || ''} onChange={handleInputChange} required rows={3} className={inputClasses}></textarea>
                </div>
                 <div>
                  <label htmlFor="instructor" className={labelClasses}>講師</label>
                  <input type="text" name="instructor" id="instructor" value={currentCourse?.instructor || ''} onChange={handleInputChange} required className={inputClasses}/>
                </div>
                <div>
                  <label htmlFor="duration" className={labelClasses}>時長</label>
                  <input type="text" name="duration" id="duration" value={currentCourse?.duration || ''} onChange={handleInputChange} required className={inputClasses}/>
                </div>
                <div className="grid grid-cols-2 gap-4"> {/* Use grid for side-by-side */} 
                    <div>
                      <label htmlFor="rating" className={labelClasses}>評分 (0-5)</label>
                      <input type="number" step="0.1" min="0" max="5" name="rating" id="rating" value={currentCourse?.rating ?? ''} onChange={handleInputChange} required className={inputClasses}/>
                    </div>
                    <div>
                      <label htmlFor="students" className={labelClasses}>學員數</label>
                      <input type="number" min="0" name="students" id="students" value={currentCourse?.students ?? ''} onChange={handleInputChange} required className={inputClasses}/>
                    </div>
                 </div>
                 <div>
                  <label htmlFor="location" className={labelClasses}>地點</label>
                  <input type="text" name="location" id="location" value={currentCourse?.location || ''} onChange={handleInputChange} required className={inputClasses}/>
                </div>
                 <div>
                  <label htmlFor="date" className={labelClasses}>日期 (YYYY/MM/DD)</label>
                  <input type="text" name="date" id="date" value={currentCourse?.date || ''} onChange={handleInputChange} required className={inputClasses}/>
                </div>
                <div>
                  <label htmlFor="image" className={labelClasses}>圖片 URL</label>
                  <input type="url" name="image" id="image" value={currentCourse?.image || ''} onChange={handleInputChange} required className={inputClasses}/>
                </div>
                <div>
                  <label htmlFor="register_url" className={labelClasses}>報名網址</label>
                  <input type="url" name="register_url" id="register_url" value={currentCourse?.register_url || ''} onChange={handleInputChange} required className={inputClasses}/>
                </div>
                 <div>
                  <label htmlFor="price" className={labelClasses}>價格</label>
                  <input type="text" name="price" id="price" value={currentCourse?.price || ''} onChange={handleInputChange} required className={inputClasses}/>
                </div>
                 <div>
                  <label htmlFor="tag" className={labelClasses}>標籤 (例如：熱門, 額滿)</label>
                  <input type="text" name="tag" id="tag" value={currentCourse?.tag || ''} onChange={handleInputChange} className={inputClasses}/>
                </div>
                
                <div className="flex justify-end space-x-3 pt-3">
                  <button type="button" onClick={handleCancelForm} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">取消</button>
                  <button type="submit" disabled={isLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">{isLoading ? '處理中...' : (isEditing ? '更新課程' : '新增課程')}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 課程列表 */} 
        <div className="mt-6 space-y-4">
          {isLoading && !showForm ? (
             <p className="text-center text-gray-600 dark:text-gray-300">正在加載課程列表...</p>
           ) : courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{course.date} - {course.location}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">ID: {course.id}</p> 
                </div>
                <div className="space-x-2 flex-shrink-0">
                  <button onClick={() => handleEdit(course)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">編輯</button>
                  <button onClick={() => handleDelete(course.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">刪除</button>
                </div>
              </div>
            ))
          ) : (
            !isLoading && <p className="text-center text-gray-500 dark:text-gray-400">目前沒有課程資料。請點擊上方按鈕遷移或新增。</p> 
          )}
        </div>

      </div>
    </Layout>
  );
} 