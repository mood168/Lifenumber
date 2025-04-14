'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      // Redirect to profile page or home page after successful registration
      router.push('/profile');
    } catch (error: Error | unknown) {
      console.error('註冊錯誤:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('註冊過程中發生錯誤');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/profile');
    } catch (error: Error | unknown) {
      console.error("Google registration error:", error);
      setError("Google 帳號註冊失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen px-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
            註冊帳戶
          </h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label 
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                顯示名稱 (選填)
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="您的名稱"
              />
            </div>
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
                minLength={6}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="至少6位字元"
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
                {isLoading ? '處理中...' : '註冊'}
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
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500" />
              <span>使用 Google 帳號註冊</span>
            </button>
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            已經有帳號了？{' '}
            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
              立即登入
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage; 