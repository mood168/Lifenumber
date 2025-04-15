import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { CalculationResults } from '../utils/calculations';

// 定義歷史記錄條目的介面
export interface HistoryEntry extends CalculationResults {
  id?: string; // Firestore 會自動產生 ID
  userId: string;
  date: Timestamp; // 使用 Firestore Timestamp
}

// 定義課程條目的介面 (基於 app/classcourse/page.tsx)
export interface Course {
  id?: string; // Firestore 會自動產生 ID
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  duration: string;
  rating: number;
  students: number;
  location: string;
  date: string; // 保持字串格式以簡化，或可改為 Timestamp
  image: string;
  register_url: string;
  price: string;
  tag: string;
  createdAt?: Timestamp; // 可選：追蹤創建時間
}

// 定義報名條目的介面
export interface Booking {
  id?: string;
  courseId: string;
  courseTitle: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  participants: number;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// 定義用戶資料介面
export interface UserProfile {
  id?: string;
  loginName: string;
  email: string;
  realName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  createdAt?: string;
  updatedAt?: string;
}

// 定義 Deepseek 回答的介面
export interface DeepseekAnswer {
  id?: string;
  userId: string;
  date: string;
  overall: string;
  love: string;
  career: string;
  wealth: string;
  createdAt: Timestamp;
}

// 新增歷史記錄條目
export const addHistoryEntry = async (userId: string, birthdateInput: string, results: CalculationResults): Promise<string | null> => {
  if (!userId) {
    console.error("User ID is required to add history entry.");
    return null;
  }
  try {
    // 確保傳入的 results 物件中包含 birthdate
    const dataToSave = {
      userId: userId,
      date: Timestamp.fromDate(new Date()), // 使用當前時間的 Timestamp
      ...results, // 將計算結果展開，其中已包含 birthdate
      birthdate: birthdateInput // 確保使用傳入的 birthdateInput 覆蓋 results 中的 birthdate (如果存在)
    };

    // 從 dataToSave 中移除 results 中的 birthdate 以避免重複
    // 但這一步其實不需要，因為展開運算符 (...) 會處理覆蓋
    // delete dataToSave.birthdate; // 移除這行，確保使用 birthdateInput

    const docRef = await addDoc(collection(db, 'userHistory', userId, 'entries'), dataToSave);
    console.log("History entry written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

// 獲取使用者的歷史記錄（最多 20 條，按日期降序）
export const getUserHistory = async (userId: string): Promise<HistoryEntry[]> => {
  if (!userId) {
    console.error("User ID is required to get history.");
    return [];
  }
  try {
    const historyCollection = collection(db, 'userHistory', userId, 'entries');
    const q = query(historyCollection, orderBy("date", "desc"), limit(20)); // 按日期降序排序，限制 20 條
    const querySnapshot = await getDocs(q);
    const history: HistoryEntry[] = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as HistoryEntry);
    });
    console.log(`Fetched ${history.length} history entries for user ${userId}`);
    return history;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

// 刪除單個歷史記錄條目
export const deleteHistoryEntry = async (userId: string, entryId: string): Promise<boolean> => {
  if (!userId || !entryId) {
    console.error("User ID and Entry ID are required to delete history entry.");
    return false;
  }
  try {
    await deleteDoc(doc(db, 'userHistory', userId, 'entries', entryId));
    console.log(`History entry with ID: ${entryId} deleted successfully for user ${userId}.`);
    return true;
  } catch (e) {
    console.error("Error deleting document: ", e);
    return false;
  }
};

// 刪除使用者所有歷史記錄（請謹慎使用！）
export const deleteAllUserHistory = async (userId: string): Promise<boolean> => {
  if (!userId) {
    console.error("User ID is required to delete all history.");
    return false;
  }
  try {
    const historyCollection = collection(db, 'userHistory', userId, 'entries');
    const q = query(historyCollection);
    const querySnapshot = await getDocs(q);
    const deletePromises: Promise<void>[] = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
    console.log(`All history entries deleted successfully for user ${userId}.`);
    return true;
  } catch (e) {
    console.error("Error deleting all user history: ", e);
    return false;
  }
};

// 新增課程
export const addCourse = async (courseData: Omit<Course, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: Timestamp.fromDate(new Date()) // 添加創建時間戳
    });
    console.log("Course written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding course document: ", e);
    return null;
  }
};

// 獲取所有課程 (可選排序，例如按日期)
export const getCourses = async (sortBy: string = 'date', direction: 'asc' | 'desc' = 'desc'): Promise<Course[]> => {
  try {
    const coursesCollection = collection(db, 'courses');
    // 注意：如果按 'date' (字串) 排序，結果可能不如預期，除非格式統一 (例如 YYYY-MM-DD)
    // 若要精確排序，應將 date 存為 Timestamp
    const q = query(coursesCollection, orderBy(sortBy, direction));
    const querySnapshot = await getDocs(q);
    const courses: Course[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() } as Course);
    });
    console.log(`Fetched ${courses.length} courses`);
    return courses;
  } catch (e) {
    console.error("Error getting course documents: ", e);
    return [];
  }
};

// 獲取單個課程 (如果需要編輯)
export const getCourse = async (courseId: string): Promise<Course | null> => {
  if (!courseId) return null;
  try {
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef); // 使用 getDoc 而不是 getDocs
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    } else {
      console.log("No such course document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting course document: ", e);
    return null;
  }
};

// 更新課程
export const updateCourse = async (courseId: string, courseData: Partial<Omit<Course, 'id'>>): Promise<boolean> => {
  if (!courseId) return false;
  try {
    const docRef = doc(db, 'courses', courseId);
    await updateDoc(docRef, courseData); // 使用 updateDoc
    console.log(`Course with ID: ${courseId} updated successfully.`);
    return true;
  } catch (e) {
    console.error("Error updating course document: ", e);
    return false;
  }
};

// 刪除課程
export const deleteCourse = async (courseId: string): Promise<boolean> => {
  if (!courseId) return false;
  try {
    await deleteDoc(doc(db, 'courses', courseId));
    console.log(`Course with ID: ${courseId} deleted successfully.`);
    return true;
  } catch (e) {
    console.error("Error deleting course document: ", e);
    return false;
  }
};

// 提交報名
export const submitBooking = async (bookingData: Omit<Booking, 'id'>) => {
  const bookingsRef = collection(db, 'bookings');
  const docRef = await addDoc(bookingsRef, bookingData);
  return docRef.id;
};

// 獲取所有報名
export const getBookings = async () => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
};

// 更新報名狀態
export const updateBookingStatus = async (bookingId: string, status: 'approved' | 'rejected') => {
  const bookingRef = doc(db, 'bookings', bookingId);
  await updateDoc(bookingRef, { status });
};

// 獲取用戶的報名記錄
export const getUserBookings = async (userId: string) => {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
};

// 檢查是否為管理員
export async function isAdminUser(email: string): Promise<boolean> {
  try {
    const adminRef = collection(db, 'admin_users');
    const q = query(adminRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('檢查管理員狀態時發生錯誤:', error);
    return false;
  }
}

// 添加管理員
export async function addAdminUser(email: string): Promise<void> {
  try {
    const adminRef = collection(db, 'admin_users');
    await addDoc(adminRef, {
      email,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('添加管理員時發生錯誤:', error);
    throw error;
  }
}

// 獲取用戶資料
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null;
  try {
    const docRef = doc(db, 'user_profiles', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('獲取用戶資料時發生錯誤:', error);
    return null;
  }
};

// 創建或更新用戶資料
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<boolean> => {
  if (!userId) return false;
  try {
    const docRef = doc(db, 'user_profiles', userId);
    const now = new Date().toISOString();
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // 更新現有資料
      await updateDoc(docRef, {
        ...profileData,
        updatedAt: now
      });
    } else {
      // 創建新資料
      await setDoc(docRef, {
        ...profileData,
        createdAt: now,
        updatedAt: now
      });
    }
    return true;
  } catch (error) {
    console.error('更新用戶資料時發生錯誤:', error);
    return false;
  }
};

// 檢查用戶資料是否完整
export const isUserProfileComplete = async (userId: string): Promise<boolean> => {
  const profile = await getUserProfile(userId);
  if (!profile) return false;
  
  // 檢查所有必填欄位是否都有值
  return Boolean(
    profile.loginName &&
    profile.email &&
    profile.realName &&
    profile.birthDate &&
    profile.gender
  );
};

// 獲取今日的 Deepseek 回答
export const getTodayDeepseekAnswer = async (userId: string): Promise<DeepseekAnswer | null> => {
  if (!userId) return null;
  try {
    const today = new Date().toISOString().split('T')[0];
    const answersRef = collection(db, 'deepseek_answer');
    const q = query(
      answersRef,
      where('userId', '==', userId),
      where('date', '==', today),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as DeepseekAnswer;
    }
    return null;
  } catch (error) {
    console.error('Error getting deepseek answer:', error);
    return null;
  }
};

// 保存 Deepseek 回答
export const saveDeepseekAnswer = async (answer: Omit<DeepseekAnswer, 'id' | 'createdAt'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'deepseek_answer'), {
      ...answer,
      createdAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving deepseek answer:', error);
    return null;
  }
};

