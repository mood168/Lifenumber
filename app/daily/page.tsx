import React from 'react';
import Layout from '../components/layout/Layout';
import { FaStar, FaHeart, FaBriefcase, FaGem } from 'react-icons/fa';

const DailyPage = () => {
  const today = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const categories = [
    {
      icon: FaStar,
      title: '整體運勢',
      rating: 4,
      description: '今天整體運勢不錯，可以嘗試新的事物。',
    },
    {
      icon: FaHeart,
      title: '感情運勢',
      rating: 3,
      description: '與伴侶保持良好溝通，單身者可能遇到特別的人。',
    },
    {
      icon: FaBriefcase,
      title: '事業運勢',
      rating: 5,
      description: '工作上會有突破性進展，適合展開新項目。',
    },
    {
      icon: FaGem,
      title: '財運運勢',
      rating: 4,
      description: '財運穩定，可能有意外收穫。',
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            每日運勢
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{today}</p>
        </div>

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
              
              <div className="flex space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < category.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DailyPage; 