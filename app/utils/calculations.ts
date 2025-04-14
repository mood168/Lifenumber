export function calculateLifeNumber(year: string, month: string, day: string): number {
  // 將年、月、日轉換為字符串並連接
  month = month.toString().padStart(2, '0');
  day = day.toString().padStart(2, '0');
  const dateString = `${year}${month}${day}`;
  
  // 將所有數字相加
  let sum = dateString.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  // 如果和不是個位數，繼續相加直到得到個位數
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

export function calculateTalentNumber(year: number, month: number, day: number): number {
  const month1 = month.toString().padStart(2, '0');
  const day1 = day.toString().padStart(2, '0');
  let sumNext = 0;
  let sumAll = 0;
  const dateString = `${year}${month1}${day1}`;

  const sum = dateString.split('').reduce((acc, digit) => acc + parseInt(digit), 0);  
  
  if (sum > 9) {
    sumNext = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    if (sumNext > 9) {
      sumAll = parseInt(sum.toString()+sumNext.toString());         
    } else {
      sumAll = sum;
    }
  } else {
    sumAll = sum;
  }
  return sumAll;
}

export function calculateLifeLessonNumber(month: string, day: string): number {
  month = month.padStart(2, '0');
  day = day.padStart(2, '0');
  // 計算日基數
  let dayBase = day.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  // 如果不是個位數，繼續相加
  while (dayBase > 9) {
    dayBase = dayBase.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  // 計算月基數
  let monthBase = month.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  // 如果不是個位數，繼續相加
  while (monthBase > 9) {
    monthBase = monthBase.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  // 計算人生功課數
  const lifeLessonNumber = Math.abs(dayBase - monthBase);
  
  return lifeLessonNumber;
}

export function calculateEmptyNumbers(
  birthdate: string,
  lifeNumber: number,
  lifeLessonNumber: number,
  talentNumber: number,
  birthNumber: number
): number[] {
  const allNumbers = birthdate.split('').map(Number);
  allNumbers.push(lifeNumber, birthNumber);
  talentNumber.toString().split('').forEach(digit => {
    allNumbers.push(parseInt(digit));
  });
  
  const presentNumbers = new Set(allNumbers);
  const emptyNumbers = [];

  for (let i = 1; i <= 9; i++) {
    if (!presentNumbers.has(i)) {
      emptyNumbers.push(i);
    }
  }

  return emptyNumbers;
}

export function calculateConnectedLines(numbers: number[]): string[] {
  const lines = [
    [1, 2, 3],
    [1, 4, 7],
    [3, 5, 7],
    [4, 5, 6],
    [2, 5, 8],
    [1, 5, 9],
    [7, 8, 9],
    [3, 6, 9],
    [1, 5, 9, 0]
  ];

  return lines
    .filter(line => line.every(num => numbers.includes(num)))
    .map(line => line.join(''));
}

export interface CalculationResults {
  birthdate: string;
  lifeNumber: number;
  talentNumber: number;
  birthNumber: number;
  emptyNumbers: number[];
  lifeLessonNumber: number;
  connectedLines: string[];
}

export function calculateAllNumbers(birthdate: string): CalculationResults {
  const [year, month, day] = birthdate.split('-');
  
  const lifeNumber = calculateLifeNumber(year, month, day);
  const talentNumber = calculateTalentNumber(parseInt(year), parseInt(month), parseInt(day));
  
  // 修改 birthNumber 的計算，確保是個位數
  let birthNumber = day.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  while (birthNumber > 9) {
    birthNumber = birthNumber.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  
  const lifeLessonNumber = calculateLifeLessonNumber(month, day);

  const emptyNumbers = calculateEmptyNumbers(
    birthdate.replace(/-/g, ''),
    lifeNumber,
    lifeLessonNumber,
    talentNumber,
    birthNumber
  );

  const allNumbers = birthdate.replace(/-/g, '').split('').map(Number);
  allNumbers.push(lifeNumber, birthNumber);
  talentNumber.toString().split('').forEach(digit => {
    allNumbers.push(parseInt(digit));
  });
  const uniqueNumbers = Array.from(new Set(allNumbers));
  const connectedLines = calculateConnectedLines(uniqueNumbers);

  return {
    birthdate,
    lifeNumber,
    talentNumber,
    birthNumber,
    emptyNumbers,
    lifeLessonNumber,
    connectedLines
  };
}
