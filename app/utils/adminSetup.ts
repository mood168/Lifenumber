import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const setupAdmin = async (password: string) => {
  if (!password) {
    throw new Error('請輸入密碼');
  }

  try {
    // 登入管理員帳號以獲取 UID
    const userCredential = await signInWithEmailAndPassword(auth, 'moodapp2023@gmail.com', password);
    const adminUid = userCredential.user.uid;

    // 在 users 集合中設置管理員權限
    await setDoc(doc(db, 'users', adminUid), {
      email: 'moodapp2023@gmail.com',
      isAdmin: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log('管理員權限設置成功');
    return true;
  } catch (error) {
    console.error('設置管理員時發生錯誤:', error);
    throw error;
  }
}; 