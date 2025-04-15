'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { FaStar, FaHeart, FaBriefcase, FaGem, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getTodayDeepseekAnswer, saveDeepseekAnswer, type DeepseekAnswer } from '../services/firestoreService';

const DailyPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fortune, setFortune] = useState<DeepseekAnswer | null>(null);

  const today = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const askDeepseek = async (name: string, birthDate: string, gender: string) => {
    try {
      const prompt = `
        請以專業占卜師的角度，為一位名叫${name}的${gender === 'male' ? '男性' : '女性'}（出生日期：${birthDate}）解讀今日運勢。
        請分別從以下四個面向進行分析，每個面向180-250字：
        1. 整體運勢
        2. 感情運勢
        3. 事業運勢
        4. 財運運勢
        請用溫和積極的語氣，給出具體的建議。
      `;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-eff332de370945f499451ac09597417e'
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // 解析回應內容
      const sections = content.split(/(?=\d\.\s)/);
      const cleanContent = (text: string) => {
        return text
          .replace(/---/g, '')
          .replace(/###/g, '')
          .trim();
      };

      return {
        overall: cleanContent(sections[1]?.replace(/1\.\s整體運勢[:：]?\s*/, '') || '無法獲取運勢'),
        love: cleanContent(sections[2]?.replace(/2\.\s感情運勢[:：]?\s*/, '') || '無法獲取運勢'),
        career: cleanContent(sections[3]?.replace(/3\.\s事業運勢[:：]?\s*/, '') || '無法獲取運勢'),
        wealth: cleanContent(sections[4]?.replace(/4\.\s財運運勢[:：]?\s*/, '') || '無法獲取運勢')
      };
    } catch (error) {
      console.error('Deepseek API error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadFortune = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        // 檢查是否已有今日運勢
        const today = new Date().toISOString().split('T')[0];
        const existingAnswer = await getTodayDeepseekAnswer(user.uid);
        
        if (existingAnswer) {
          setFortune(existingAnswer);
        } else {
          // 獲取用戶資料
          const userProfile = await getUserProfile(user.uid);
          if (!userProfile?.realName || !userProfile?.birthDate || !userProfile?.gender) {
            throw new Error('用戶資料不完整');
          }

          // 獲取新的運勢
          const fortuneResult = await askDeepseek(
            userProfile.realName,
            userProfile.birthDate,
            userProfile.gender
          );

          // 保存到 Firestore
          const newFortune = {
            userId: user.uid,
            date: today,
            ...fortuneResult
          };
          
          await saveDeepseekAnswer(newFortune);
          setFortune(newFortune as DeepseekAnswer);
        }
      } catch (error) {
        console.error('Error loading fortune:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFortune();
  }, [user]);

  const categories = [
    {
      icon: FaStar,
      title: '整體運勢',
      description: fortune?.overall || '請先完善個人資料',
    },
    {
      icon: FaHeart,
      title: '感情運勢',
      description: fortune?.love || '請先完善個人資料',
    },
    {
      icon: FaBriefcase,
      title: '事業運勢',
      description: fortune?.career || '請先完善個人資料',
    },
    {
      icon: FaGem,
      title: '財運運勢',
      description: fortune?.wealth || '請先完善個人資料',
    },
  ];

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600 dark:text-gray-400">請先登入以查看每日運勢</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            每日運勢
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{today}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <category.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>

                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DailyPage; 