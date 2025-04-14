import React from 'react';
import Layout from '../components/layout/Layout';
import { FaMoon, FaBell, FaLanguage, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';

const SettingsPage = () => {
  const settings = [
    {
      icon: FaMoon,
      title: '深色模式',
      description: '切換深色/淺色主題',
      hasToggle: true,
    },
    {
      icon: FaBell,
      title: '通知設定',
      description: '管理推送通知',
      hasToggle: true,
    },
    {
      icon: FaLanguage,
      title: '語言設定',
      description: '選擇顯示語言',
      value: '繁體中文',
    },
    {
      icon: FaInfoCircle,
      title: '關於',
      description: '版本資訊與更新記錄',
    },
    {
      icon: FaQuestionCircle,
      title: '幫助與支援',
      description: '常見問題與聯繫方式',
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          設定
        </h1>

        <div className="space-y-4">
          {settings.map((setting, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <setting.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {setting.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {setting.description}
                  </p>
                </div>
              </div>

              {setting.hasToggle ? (
                <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 transform"></div>
                </div>
              ) : setting.value ? (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {setting.value}
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">›</span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            版本 1.0.0
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage; 