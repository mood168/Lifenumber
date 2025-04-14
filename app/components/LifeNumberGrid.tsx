import React, { useRef, useEffect, useState } from 'react';

interface LifeNumberGridProps {
  results: {
    birthdate: string;
    lifeNumber: number;
    talentNumber: number;
    birthNumber: number;
    connectedLines: string[];
  };
}

const LifeNumberGrid: React.FC<LifeNumberGridProps> = ({ results }) => {
  const { birthdate, lifeNumber, talentNumber, birthNumber, connectedLines } = results;
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (gridRef.current) {
        setGridSize({
          width: gridRef.current.offsetWidth,
          height: gridRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const gridNumbers = [
    [1, 2, 3, null],
    [4, 5, 6, null],
    [7, 8, 9, 0]
  ];

  const getCircleCount = (number: number): number => {
    let count = 0;
    const dateString = birthdate;
    
    // 計算在生日中出現的次數
    dateString.split('').forEach(digit => {
      if (parseInt(digit) === number) count++;
    });   
    
    // 為特殊數字添加額外的圈
    if (number === birthNumber) count++;
    // if (number === Math.floor(birthNumber / 10)) count++; // 處理兩位數的生日
   
    return count;
  };

  const getTriangleCount = (number: number): number => {
    let count = 0;
    talentNumber.toString().split('').forEach(digit => {
      if (parseInt(digit) === number) count++;
    });    
    return count;
  };

  const renderSquare = (number: number) => {
    if (number === lifeNumber) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute border-[5px] border-purple-500 dark:border-purple-400"
            style={{
              width: '60px',
              height: '60px',
              zIndex: 25
            }}
          ></div>
        </div>
      );
    }
    return null;
  };

  const renderTriangle = (number: number) => {
    const triangleCount = getTriangleCount(number);
    if (triangleCount === 0) return null;

    const getColor = (index: number) => {
      switch(index) {
        case 0: return '#6B7280'; // Darker Gray
        case 1: return '#FFFFFF'; // White
        case 2: return '#4ADE80'; // Green
        case 3: return '#FF0000'; // Red
        default: return '#6B7280'; // Default Darker Gray
      }
    };

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(triangleCount)].map((_, index) => (
          <div
            key={index}
            style={{
              width: `${65 - index * 18}px`,
              height: `${65 - index * 18}px`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              zIndex: 30 + index,
              opacity: 0.6,
              position: 'absolute',
              backgroundColor: getColor(index)
            }}
          ></div>
        ))}
      </div>
    );
  };

  const renderCircles = (number: number) => {
    const circleCount = getCircleCount(number);
    if (circleCount === 0) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(circleCount)].map((_, index) => (
          <div
            key={index}
            className={`absolute border-2 border-gray-400 dark:border-gray-500 rounded-full
              ${index === 0 ? 'w-12 h-12' : ''}
              ${index === 1 ? 'w-16 h-16' : ''}
              ${index === 2 ? 'w-20 h-20' : ''}
              ${index === 3 ? 'w-24 h-24' : ''}
              ${index >= 4 ? 'w-28 h-28' : ''}
            `}
            style={{ zIndex: 20 - index }}
          ></div>
        ))}
      </div>
    );
  };

  const renderLines = () => {
    const cellWidth = gridSize.width / 4;
    const cellHeight = gridSize.height / 3;

    return connectedLines.map((line, index) => {
      const numbers = line.split('').map(Number);
      const positions = numbers.map(num => {
        let row, col;
        if (num === 0) {
          row = 2;
          col = 3;
        } else {
          row = Math.floor((num - 1) / 3);
          col = (num - 1) % 3;
        }
        return { 
          x: col * cellWidth + cellWidth / 2, 
          y: row * cellHeight + cellHeight / 2 
        };
      });

      const path = `M ${positions.map(p => `${p.x},${p.y}`).join(' L ')}`;
      
      return (
        <path
          key={index}
          d={path}
          stroke="rgb(156 163 175)"
          className="dark:stroke-gray-500"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      );
    });
  };

  return (
    <div ref={gridRef} className="flex flex-col items-center mt-4 relative">
      <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 40 }}>
        {gridSize.width > 0 && gridSize.height > 0 && renderLines()}
      </svg>
      {gridNumbers.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((number) => (
            number !== null ? (
              <div
                key={number}
                className={`w-20 h-20 flex items-center justify-center text-2xl text-gray-700 dark:text-gray-300 relative`}
              >
                <span className="z-10 relative">{number}</span>
                {renderCircles(number)} 
                {renderSquare(number)}                
                {renderTriangle(number)}
              </div>
            ) : (
              <div key={`empty-${rowIndex}`} className="w-20 h-20"></div>
            )
          ))}
        </div>
      ))}
    </div>
  );
};

export default LifeNumberGrid;
