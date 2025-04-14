import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // 也初始化 Auth 以便未來使用

// 在這裡填入您的 Firebase 專案設定
// 建議將這些值儲存在 .env.local 檔案中以確保安全
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAxZitnvh6eB2hvnPj66YzEH0QwqHKSBJ0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lifenumber-4165b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lifenumber-4165b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lifenumber-4165b.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "354586740442",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:354586740442:web:34ae0d75dfb4b066a707e3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-1234567890"
};

// 初始化 Firebase
// 檢查是否已經初始化以避免重複初始化 (對 Next.js 很重要)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app); // 初始化 Auth

export { app, db, auth }; 