'use client';

import React, { useEffect } from 'react';
import TabBar from './TabBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // 添加調試日誌
  useEffect(() => {
    console.log('Layout 組件已渲染');
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="pb-[83px]">
        {children}
      </main>
      <TabBar />
    </div>
  );
};

export default Layout; 