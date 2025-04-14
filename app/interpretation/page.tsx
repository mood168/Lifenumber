import React from 'react';
import Layout from '../components/layout/Layout';

const InterpretationPage = () => {
  const numbers = [
    { number: 1, title: '領導者', description: '獨立、創新、領導力' },
    { number: 2, title: '和平使者', description: '合作、直覺、敏感' },
    { number: 3, title: '表達者', description: '創意、溝通、樂觀' },
    { number: 4, title: '建造者', description: '穩定、務實、組織' },
    { number: 5, title: '自由者', description: '冒險、變化、適應' },
    { number: 6, title: '照顧者', description: '責任、關懷、和諧' },
    { number: 7, title: '思考者', description: '分析、智慧、神秘' },
    { number: 8, title: '權威者', description: '力量、成就、物質' },
    { number: 9, title: '理想家', description: '同情、服務、完成' },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          生命數字解讀
        </h1>
        <div className="grid grid-cols-1 gap-4">
          {numbers.map((item) => (
            <div
              key={item.number}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xl">
                  {item.number}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default InterpretationPage; 