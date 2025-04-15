'use client';

import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { addAdminUser } from '../../services/firestoreService';
import { toast } from 'react-hot-toast';

const AdminSetupPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAdmin = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('請輸入有效的 Email 地址');
      return;
    }

    setIsLoading(true);
    try {
      await addAdminUser(email);
      toast.success(`已將 ${email} 設置為管理員`);
      setEmail(''); // 清空輸入框
    } catch (error) {
      toast.error('設置管理員失敗');
      console.error('設置管理員時發生錯誤:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-700 dark:text-purple-300">
          管理員設置
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <p className="text-black dark:text-white mb-4">
            將以下 Email 設置為管理員帳號。
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              管理員帳號 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white"
              placeholder="請輸入 Email"
            />
          </div>

          <button
            onClick={handleAddAdmin}
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? '設置中...' : '設置管理員'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSetupPage; 