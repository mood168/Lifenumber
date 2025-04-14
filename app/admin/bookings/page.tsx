'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { getBookings, updateBookingStatus } from '../../services/firestoreService';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface Booking {
  id?: string;
  name: string;
  email: string;
  phone: string;
  participants: number;
  notes: string;
  courseId: string;
  courseTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadBookings = async () => {
      if (user?.email === 'moodapp2023@gmail.com') {
        const fetchedBookings = await getBookings();
        setBookings(fetchedBookings);
      }
      setIsLoading(false);
    };
    loadBookings();
  }, [user]);

  const handleStatusUpdate = async (bookingId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  if (!user || user.email !== 'moodapp2023@gmail.com') {
    return (
      <Layout>
        <div className="p-4">
          <p className="text-center text-red-500">您沒有權限訪問此頁面</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-700 dark:text-purple-300">
          報名管理
        </h1>

        {isLoading ? (
          <p className="text-center">載入中...</p>
        ) : bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{booking.courseTitle}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      報名時間: {new Date(booking.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {booking.status === 'pending' && booking.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(booking.id!, 'approved')}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          title="核准"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id!, 'rejected')}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          title="拒絕"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {booking.status === 'approved' ? '已核准' : '已拒絕'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-900 dark:text-gray-100">
                  <div>
                    <p><strong className="text-gray-700 dark:text-gray-300">姓名：</strong>{booking.name}</p>
                    <p><strong className="text-gray-700 dark:text-gray-300">Email：</strong>{booking.email}</p>
                    <p><strong className="text-gray-700 dark:text-gray-300">電話：</strong>{booking.phone}</p>
                  </div>
                  <div>
                    <p><strong className="text-gray-700 dark:text-gray-300">報名人數：</strong>{booking.participants}</p>
                    <p><strong className="text-gray-700 dark:text-gray-300">備註：</strong>{booking.notes || '無'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">目前沒有報名記錄</p>
        )}
      </div>
    </Layout>
  );
};

export default BookingManagementPage; 