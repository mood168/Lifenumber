'use client'; // Add this directive for client-side hooks

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import { FaHistory, FaChartLine, FaShare, FaSignOutAlt, FaUser, FaEnvelope, FaCalendar, FaVenusMars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserHistory, deleteHistoryEntry, deleteAllUserHistory, HistoryEntry, getUserProfile, updateUserProfile, type UserProfile } from '../services/firestoreService';
import { Timestamp } from 'firebase/firestore';
import Image from 'next/image';

// 定義類型
type Message = {
  type: string;
  text: string;
};

type HistoryItem = HistoryEntry;

// Helper function to format date
const formatDate = (timestamp: Timestamp | undefined | Date) => {
  if (!timestamp) return '日期不可用';
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('zh-TW');
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const loadUserProfile = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }, [user]);

  const fetchHistory = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const history = await getUserHistory(user.uid);
      setHistoryItems(history);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  }, [user]);

  // 加載用戶資料
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user, loadUserProfile]);

  // 加載歷史記錄
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, fetchHistory]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [historyLoading, setHistoryLoading] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const success = await updateUserProfile(user.uid, formData);
      if (success) {
        setMessage({ type: 'success', text: '個人資料更新成功！' });
        loadUserProfile();
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: '更新失敗，請稍後再試。' });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ type: 'error', text: '更新資料時發生錯誤' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId: string | undefined) => {
    if (!user || !user.uid || !entryId) return;
    const confirmed = window.confirm("確定要刪除此條記錄嗎？");
    if (confirmed) {
      setHistoryLoading(true); // Start loading state
      const success = await deleteHistoryEntry(user.uid, entryId);
      if (success) {
        // Re-fetch history or remove from local state
        setHistoryItems(prevHistory => prevHistory.filter(entry => entry.id !== entryId));
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
        setHistoryItems([]); // Clear local state
        alert("所有歷史記錄已刪除。");
      } else {
        alert("刪除所有歷史記錄失敗。");
      }
      setHistoryLoading(false); // End loading state
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>請先登入</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* User avatar - shows photo if available, otherwise shows initials */}
            {user.photoURL ? (
              <div className="relative w-20 h-20">
                <Image 
                  src={user.photoURL} 
                  alt={user.displayName || '用戶'}
                  fill
                  sizes="80px"
                  className="rounded-full object-cover border-2 border-purple-400"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <span className="text-2xl text-purple-600 dark:text-purple-400">
                  {user.displayName?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.displayName || '用戶'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {user.email || '未設置電子郵件'}
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

        <div className="space-y-4">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black dark:text-white">登入名稱</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="loginName"
                  value={formData.loginName || user.displayName || ''}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-black dark:text-white">電子郵件</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email || user.email || ''}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-black dark:text-white">真實姓名</label>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">計算每日運勢用,必填</span>
              </div>
              <input
                type="text"
                name="realName"
                value={formData.realName || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-black dark:text-white">出生日期</label>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">計算每日運勢用,必填</span>
              </div>
              <div className="relative">
                <FaCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate || ''}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-black dark:text-white">性別</label>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">計算每日運勢用,必填</span>
              </div>
              <div className="relative">
                <FaVenusMars className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300"
                  required
                >
                  <option value="">請選擇性別</option>
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isSaving ? '儲存中...' : '儲存'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="border rounded p-4 space-y-2 text-black dark:text-white">
              {/* <p><span className="font-medium text-black dark:text-white">登入名稱：</span>{profile?.loginName || user.displayName}</p>
              <p><span className="font-medium text-black dark:text-white">電子郵件：</span>{profile?.email || user.email}</p> */}
              <p><span className="font-medium text-black dark:text-white">真實姓名：</span>{profile?.realName || <span className="text-red-300">計算每日運勢用,必填</span>}</p>
              <p><span className="font-medium text-black dark:text-white">出生日期：</span>{profile?.birthDate || <span className="text-red-300">計算每日運勢用,必填</span>}</p>
              <p><span className="font-medium text-black dark:text-white">性別：</span>{profile?.gender ? {
                male: '男性',
                female: '女性',
                other: '其他'
              }[profile.gender] : <span className="text-red-300">計算每日運勢用,必填</span>}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className={`w-full ${profile?.realName && profile?.birthDate && profile?.gender ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} text-white p-2 rounded`}
            >
              {profile?.realName && profile?.birthDate && profile?.gender ? '編輯個人資料' : '完善個人資料'}
            </button>
          </div>
        )}

        </div>

        <div className="grid grid-cols-3 gap-4">
          {[ 
            { icon: FaHistory, label: '歷史記錄', count: historyItems.length.toString() },
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
              disabled={historyLoading || historyItems.length === 0}
              className={`px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 ${
                historyLoading || historyItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              刪除全部記錄
            </button>
          </div>
          {historyLoading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">正在加載歷史記錄...</p>
          ) : historyItems.length > 0 ? (
            <ul className="space-y-3">
              {historyItems.map((entry) => (
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

        {message && (
          <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        
      </div>
    </Layout>
  );
};

export default ProfilePage; 