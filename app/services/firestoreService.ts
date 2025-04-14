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
  getDoc
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