'use client';

import React, { useState } from 'react';
import { setupAdmin } from '../../utils/adminSetup';
import Layout from '../../components/layout/Layout';

const AdminSetupPage = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const handleSetupAdmin = async () => {
    if (!password) {
      setStatus('error');
      setMessage('請輸入密碼');
      return;
    }

    setStatus('loading');
    try {
      await setupAdmin(password);
      setStatus('success');
      setMessage('管理員權限設置成功！');
      setPassword(''); // 清空密碼
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        if (error.message.includes('auth/wrong-password') || error.message.includes('auth/invalid-credential')) {
          setMessage('密碼錯誤，請重試');
        } else if (error.message.includes('auth/invalid-email')) {
          setMessage('電子郵件格式無效');
        } else if (error.message.includes('auth/user-not-found')) {
          setMessage('找不到該用戶，請確認郵箱地址');
        } else {
          setMessage('設置失敗：' + error.message);
        }
      } else {
        setMessage('發生未知錯誤');
      }
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
            將 moodapp2023@gmail.com 設置為管理員帳號。
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              管理員密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 text-black dark:text-white"
              placeholder="請輸入密碼"
            />
          </div>

          <button
            onClick={handleSetupAdmin}
            disabled={status === 'loading'}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
          >
            {status === 'loading' ? '設置中...' : '設置管理員'}
          </button>

          {message && (
            <p className={`mt-4 text-center ${
              status === 'success' ? 'text-green-600 dark:text-green-400' : 
              status === 'error' ? 'text-red-600 dark:text-red-400' : ''
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminSetupPage; 