import React, { useState } from 'react';
import { Page, Text, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import ServiceChoose from '../components/service-choose';
import BookingTags from '../components/booking-tag';
import { bookings } from '../utils/bookingdemo';

const BookingPage = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  const statusMapping = {
    'Tất cả': 'all',
    'Chờ xác nhận': 'pending',
    'Đã xác nhận': 'approve',
    'Đã đặt lịch': 'completed',
    'Đã hủy lịch': 'cancelled',
  };

  const statusDisplayMapping = {
    cancelled: 'Đã hủy lịch',
    completed: 'Đã đặt lịch',
    pending: 'Chờ xác nhận',
    approve: 'Đã xác nhận',
  };

  const filteredBookings =
    statusMapping[filterStatus] === 'all'
      ? bookings
      : bookings.filter(
          (booking) => booking.bookingStatus === statusMapping[filterStatus]
        );

  return (
    
      <Page className="page">
        <Header />

        {/* Filter Tags */}
        <div className="mt-16 mb-2">
          <BookingTags
            selectedCategory={filterStatus}
            onSelectCategory={setFilterStatus}
          />
        </div>

        {/* Hiển thị thông báo khi không có booking */}
        {filteredBookings.length === 0 ? (
          <div className="p-4 mb-14 mt-14 flex items-center justify-center">
            <div className="text-center">
              <Text className="text-lg font-bold">Chưa có lịch hẹn</Text>
            </div>
          </div>
        ) : (
          // Hiển thị danh sách các booking đã lọc
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 bg-white shadow-md "
              >
                <Text>Mã đặt lịch:</Text>
                <Text>{booking.bookingCode}</Text>

                <Text>Thời gian đặt lịch:</Text>
                <Text>{booking.bookingTime}</Text>

                <Text>Trạng thái đặt lịch:</Text>
                <Text
                  className={`text-base mb-4 ${
                    booking.bookingStatus === 'cancelled'
                      ? 'text-red-500'
                      : booking.bookingStatus === 'completed'
                        ? 'text-green-500'
                        : booking.bookingStatus === 'pending'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                  }`}
                >
                  {statusDisplayMapping[booking.bookingStatus] ||
                    booking.bookingStatus.charAt(0).toUpperCase() +
                      booking.bookingStatus.slice(1)}
                </Text>
              </div>
            ))}
          </div>
        )}

        {/* Button đặt lịch */}
        <div className="flex items-center justify-center mt-5">
          <button
            className="w-80 h-10 rounded-full flex items-center justify-center bg-red-500"
            onClick={() => {
              navigate('/bookingform');
            }}
          >
            <span className="ml-2 text-base text-white">Đặt lịch</span>
          </button>
        </div>

        <ServiceChoose />
      </Page>
  );
};

export default BookingPage;
