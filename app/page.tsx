'use client'

import React, { useState, useEffect } from 'react';
import { calculateAllNumbers, CalculationResults } from './utils/calculations';
import LifeNumberGrid from './components/LifeNumberGrid';
import ResultDisplay from './components/ResultDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import { addHistoryEntry } from './services/firestoreService';

export default function Home() {
  const [birthdate, setBirthdate] = useState('1969-09-12');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('首頁已加載', { user, loading });
  }, [user, loading]);

  const handleCalculate = async () => {
    try {
      console.log('計算中...');
      const calculatedResults = calculateAllNumbers(birthdate);
      setResults(calculatedResults);
      console.log('計算結果:', calculatedResults);

      if (user && user.uid) {
        console.log(`Attempting to save history for user: ${user.uid}`);
        const entryId = await addHistoryEntry(user.uid, birthdate, calculatedResults);
        if (entryId) {
          console.log("History entry saved to Firestore with ID:", entryId);
        } else {
          console.error("Failed to save history entry to Firestore.");
        }
      } else {
        console.log("User not logged in, history not saved to Firestore.");
      }
    } catch (error) {
      console.error("Error calculating or saving history:", error);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
          遇見數字❤️生活豐富
          <span className="text-black/60 dark:text-white/60 text-sm ml-2">
            ver: 1.0
          </span>
        </h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
          生命靈數馬上算
        </h2>
        
        <div className="mb-6 flex flex-col items-center">
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-white"
          />
          <button 
            onClick={handleCalculate}
            className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            計算
          </button>
        </div>

        {!user && !loading && (
          <div className="mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              登入後可以保存您的計算歷史
            </p>
            <Link href="/login" className="text-purple-600 dark:text-purple-400 font-medium">
              立即登入
            </Link>
            {' 或 '}
            <Link href="/register" className="text-purple-600 dark:text-purple-400 font-medium">
              註冊帳號
            </Link>
          </div>
        )}

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <ResultDisplay results={results} />
              <LifeNumberGrid results={results} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
