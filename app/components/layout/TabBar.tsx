'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUser, FaGraduationCap, FaStar, FaCog, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const TabBar: React.FC = () => {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const tabs = [
    { icon: FaHome, label: '首頁', path: '/' },
    { icon: FaGraduationCap, label: '課程', path: '/classcourse' },
    { icon: FaStar, label: '運勢', path: '/daily' },
    { icon: FaUser, label: '我的', path: '/profile' },
    { icon: FaCog, label: '設定', path: '/settings' },
    ...(isAdmin ? [{ icon: FaClipboardList, label: '報名管理', path: '/admin/bookings' }] : []),
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex justify-around items-center h-[83px] px-6 pb-8 pt-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              <tab.icon className="h-6 w-6" />
              <span className="text-xs">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TabBar; 