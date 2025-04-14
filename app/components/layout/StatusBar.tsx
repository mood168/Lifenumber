'use client';

import React, { useState, useEffect } from 'react';
import { FaBatteryFull, FaWifi, FaSignal } from 'react-icons/fa';

const StatusBar = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[44px] bg-black text-white px-6 flex items-center justify-between fixed top-0 w-full z-50">
      <div className="flex items-center space-x-1">
        <FaSignal className="h-4 w-4" />
        <span className="text-xs">中華電信</span>
        <FaWifi className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium">{time}</div>
      <div className="flex items-center space-x-1">
        <FaBatteryFull className="h-4 w-4" />
        <span className="text-xs">100%</span>
      </div>
    </div>
  );
};

export default StatusBar; 