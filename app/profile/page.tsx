'use client'; // Add this directive for client-side hooks

import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { FaHistory, FaChartLine, FaShare, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserHistory, deleteHistoryEntry, deleteAllUserHistory, HistoryEntry } from '../services/firestoreService';
import { Timestamp } from 'firebase/firestore';
import Image from 'next/image';

// Helper function to format date
const formatDate = (timestamp: Timestamp | undefined | Date) => {
  if (!timestamp) return '日期不可用';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('zh-TW');
};

const ProfilePage = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { user, loading, logout } = useAuth(); // Get user info from Auth Context and logout function
  const router = useRouter();
  const [historyLoading, setHistoryLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (loading) return; // If AuthContext is still loading, do nothing

    if (!user) {
      router.push('/login'); // If user is not authenticated, redirect to login page
      return;
    }

    // Fetch user history
    const fetchHistory = async () => {
      if (user && user.uid) {
        setHistoryLoading(true);
        const userHistory = await getUserHistory(user.uid);
        setHistory(userHistory as HistoryEntry[]);
        setHistoryLoading(false);
        console.log("Fetched user history:", userHistory);
      } else {
        setHistory([]);
        setHistoryLoading(false);
      }
    };

    fetchHistory();

  }, [user, loading, router]);

  // Handle sign out
  const handleLogout = async () => {
    await logout();
    router.push('/login'); // Redirect to login page after logout
  };

  const handleDeleteEntry = async (entryId: string | undefined) => {
    if (!user || !user.uid || !entryId) return;
    const confirmed = window.confirm("確定要刪除此條記錄嗎？");
    if (confirmed) {
      setHistoryLoading(true); // Start loading state
      const success = await deleteHistoryEntry(user.uid, entryId);
      if (success) {
        // Re-fetch history or remove from local state
        setHistory(prevHistory => prevHistory.filter(entry => entry.id !== entryId));
        alert("記錄已刪除。");
      } else {
        alert("刪除記錄失敗。");
      }
      setHistoryLoading(false); // End loading state
    }
  };

  const handleDeleteAllHistory = async () => {
    if (!user || !user.uid) return;
    const confirmed = window.confirm("警告：確定要刪除所有歷史記錄嗎？此操作無法復原！");
    if (confirmed) {
      setHistoryLoading(true); // Start loading state
      const success = await deleteAllUserHistory(user.uid);
      if (success) {
        setHistory([]); // Clear local state
        alert("所有歷史記錄已刪除。");
      } else {
        alert("刪除所有歷史記錄失敗。");
      }
      setHistoryLoading(false); // End loading state
    }
  };

  if (loading || !user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>載入中...</p>
        </div>
      </Layout>
    );
  }

  // Get user display name or email as fallback
  const userDisplayName = user.displayName || user.email?.split('@')[0] || '用戶';
  // Get user email address
  const userEmail = user.email || '未設置電子郵件';
  // Check if user has a photo URL
  const hasPhotoUrl = !!user.photoURL;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* User avatar - shows photo if available, otherwise shows initials */}
            {hasPhotoUrl ? (
              <div className="relative w-20 h-20">
                <Image 
                  src={user.photoURL as string} 
                  alt={userDisplayName}
                  fill
                  sizes="80px"
                  className="rounded-full object-cover border-2 border-purple-400"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-2xl text-purple-600 dark:text-purple-400">
                  {userDisplayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {userDisplayName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <FaSignOutAlt />
            <span>登出</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[ 
            { icon: FaHistory, label: '歷史記錄', count: history.length.toString() },
            { icon: FaChartLine, label: '運勢分析', count: '-' }, 
            { icon: FaShare, label: '分享', count: '-' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <item.icon className="w-6 h-6 mx-auto text-purple-600 dark:text-purple-400" />
              <div className="mt-2 font-semibold text-gray-900 dark:text-white">
                {item.count}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            計算歷史
          </h2>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400">計算歷史記錄</h2>
            <button
              onClick={handleDeleteAllHistory}
              disabled={historyLoading || history.length === 0}
              className={`px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 ${
                historyLoading || history.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              刪除全部記錄
            </button>
          </div>
          {historyLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">正在加載歷史記錄...</p>
          ) : history.length > 0 ? (
            <ul className="space-y-3">
              {history.map((entry) => (
                <li key={entry.id} className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">生日: {entry.birthdate}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">計算日期: {formatDate(entry.date)}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">生命密碼: {entry.lifeNumber}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">天賦數: {entry.talentNumber}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">生日數: {entry.birthNumber}</p>
                    {/* 可以添加更多結果的顯示 */}
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    disabled={historyLoading}
                    className={`ml-4 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300 ${
                      historyLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    刪除
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">尚無歷史記錄。</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage; 