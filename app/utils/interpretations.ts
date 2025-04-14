// 移除未使用的導入

export interface Interpretation {
  keywords: string;
  description: string;
  strengths?: string[];
  weaknesses?: string[];
  career?: string[];
}

// 定義各個生命靈數的解讀
const interpretations: { [key: number]: Interpretation } = {
  1: {
    keywords: '領導者、獨立、創新',
    description: '天生的領導者，充滿自信和決心。勇於開創，獨立自主。'
  },
  2: {
    keywords: '合作者、敏感、和諧',
    description: '重視合作與和諧，具有外交手腕，情感豐富且敏感。'
  },
  3: {
    keywords: '表達者、創意、樂觀',
    description: '充滿創意和想像力，擅長溝通表達，態度樂觀積極。'
  },
  4: {
    keywords: '建設者、穩定、務實',
    description: '腳踏實地，注重秩序和穩定，是可靠的建設者和執行者。'
  },
  5: {
    keywords: '自由者、冒險、多變',
    description: '熱愛自由和冒險，適應力強，喜歡多樣性和變化。'
  },
  6: {
    keywords: '關懷者、責任、服務',
    description: '富有同情心和責任感，重視家庭和社群，樂於服務他人。'
  },
  7: {
    keywords: '思考者、分析、智慧',
    description: '喜歡思考和分析，追求知識和真理，帶有神秘色彩。'
  },
  8: {
    keywords: '權力者、成就、豐盛',
    description: '具有強烈的企圖心和組織能力，追求成就和物質豐盛。'
  },
  9: {
    keywords: '理想家、人道、智慧',
    description: '充滿理想和人道精神，具有大愛和服務精神，智慧豁達。'
  }
};

// 獲取生命靈數的解讀
export const getLifeNumberInterpretation = (lifeNumber: number): Interpretation => {
  return interpretations[lifeNumber] || {
    keywords: '未知',
    description: '找不到對應的生命靈數解讀。'
  };
};

// 可以添加其他數字的解讀函數，例如天賦數、生日數等
// export const getTalentNumberInterpretation = (talentNumber: number): Interpretation => { ... }; 