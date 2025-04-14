'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import Layout from '../components/layout/Layout';
import Link from 'next/link'; // Import Link for navigation
import { FaGoogle } from 'react-icons/fa'; // Import Google icon

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 添加日誌以幫助調試
  useEffect(() => {
    console.log('登入頁面已加載');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log('嘗試登入，電子郵件:', email);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('登入成功');
      // Redirect to profile page or dashboard upon successful login
      router.push('/profile'); 
    } catch (error: Error | unknown) {
      console.error('登入錯誤:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('登入過程中發生錯誤');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    console.log('嘗試 Google 登入');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log('Google 登入成功');
      router.push('/profile');
    } catch (error: Error | unknown) {
      console.error("Google login error:", error);
      setError("Google 登入失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center p-6" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
            登入
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label 
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                電子郵件
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label 
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                密碼
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '登入中...' : '登入'}
              </button>
            </div>
          </form>
          
          {/* Social Login Divider */}
          <div className="my-6 flex items-center justify-center">
            <div className="h-px w-full bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">或者</span>
            <div className="h-px w-full bg-gray-300 dark:bg-gray-600"></div>
          </div>
          
          {/* Google Login Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500" />
              <span>使用 Google 帳號登入</span>
            </button>
          </div>
          
          {/* Registration Link */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            還沒有帳號嗎？{' '}
            <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
              立即註冊
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage; 