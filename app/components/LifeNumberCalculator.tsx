'use client'

import React, { useState } from 'react';
import { calculateAllNumbers, CalculationResults } from '../utils/calculations';
import LifeNumberGrid from './LifeNumberGrid';
import ResultDisplay from './ResultDisplay';
import { motion, AnimatePresence } from 'framer-motion';

export default function LifeNumberCalculator() {
  const [birthdate, setBirthdate] = useState('1969-09-12');
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = () => {
    const calculatedResults = calculateAllNumbers(birthdate);
    setResults(calculatedResults);
  };

  return (
    <div className={`flex justify-center items-center transition-colors duration-300`}>
          <div className={`relative w-[98%] sm:w-[480px] p-4 md:p-8 rounded-lg border border-black/10 dark:border-white/10 transition-colors duration-300`}>
            <h1 className={`text-2xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-black dark:text-white`}>
              遇見數字❤️生活豐富&nbsp;
              <span className="text-black/60 dark:text-white/60 text-sm">ver: 1.0</span>
            </h1>          
            <h1 className={`text-2xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-black dark:text-white`}>
              生命運數馬上算
            </h1>
            <div className="mb-4 md:mb-6 flex flex-col items-center">
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className={`w-full p-2 md:p-3 border rounded-lg mb-3 focus:outline-none focus:ring-1 transition-colors duration-300 appearance-none`}
                style={{ colorScheme: 'light' }}
              />
              <button 
                onClick={handleCalculate} 
                className={`w-full p-2 md:p-3 rounded-lg transition-all duration-300 transform hover:scale-105`}
              >
                計算
              </button>
            </div>
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
        </div>
  );
} 