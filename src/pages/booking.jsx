import React, { useState, useEffect } from 'react';
import { Page, Text, useNavigate, Icon } from 'zmp-ui';
import Header from '../components/header';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import ServiceChoose from '../components/service-choose';
import BookingTags from '../components/booking-tag';
import { getBookingHistoriesByUserId } from '../services/booking.service';

const BookingPage = () => {
  const navigate = useNavigate();
  const { userInfo: user, accessToken } = useRecoilValue(userState);
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [bookings, setBookings] = useState([]);

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

  // Gọi API để lấy danh sách booking
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingHistories = await getBookingHistoriesByUserId(
          statusMapping[filterStatus] === 'all'
            ? ''
            : statusMapping[filterStatus],
          accessToken
        );
        setBookings(bookingHistories);
      } catch (error) {
        console.error('Error fetching booking histories:', error);
      }
    };

    fetchBookings();
  }, [filterStatus, accessToken]);

  const filteredBookings =
    statusMapping[filterStatus] === 'all'
      ? bookings
      : bookings.filter(
          (booking) => booking.status === statusMapping[filterStatus]
        );

  return (
    <Page className="page">
      <Header />

      {/* Filter Tags */}
      <div className="mt-16">
        <BookingTags
          selectedCategory={filterStatus}
          onSelectCategory={setFilterStatus}
        />
      </div>

      {/* Button đặt lịch */}
      <div className="flex items-center justify-center">
        <button
          className="w-full h-14 flex flex-col items-center justify-center bg-pink-200"
          onClick={() => {
            navigate('/bookingform');
          }}
        >
          <Icon icon="zi-add-story" className="text-red-500" />
          <span className="ml-2 text-base text-black">Đặt lịch tại đây</span>
        </button>
      </div>

      {/* Hiển thị thông báo khi không có booking */}
      {filteredBookings.length === 0 ? (
        <div className="p-4">
          <div className="text-center">
            <Text className="text-lg font-bold">Chưa có lịch hẹn</Text>
          </div>
        </div>
      ) : (
        // Hiển thị danh sách các booking đã lọc
        <div className="">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-gray-500 rounded-lg px-8 mt-5 mb-5 m-7"
            >
              {/* Sử dụng Flexbox để sắp xếp các thông tin trên cùng một hàng */}
              <div className="mt-2 mb-2">
                <Text>Mã đặt lịch:</Text>
                <Text>{booking._id}</Text>
              </div>
              <div className="flex justify-start mt-2 mb-2">
                <Text>Tên khách hàng:</Text>
                <Text className="ml-2">{user.name}</Text>
              </div>
              <div className="flex justify-start mt-2 mb-2">
                <Text>Thời gian đặt lịch:</Text>
                <Text className="ml-2">
                  {new Date(booking.date).toLocaleString()}
                </Text>{' '}
              </div>
              <div className="flex justify-start mt-2 mb-2">
                <Text>Trạng thái đặt lịch:</Text>
                <Text
                  className={`text-base ml-2 ${
                    booking.status === 'cancelled'
                      ? 'text-red-500'
                      : booking.status === 'completed'
                        ? 'text-green-500'
                        : booking.status === 'pending'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                  }`}
                >
                  {statusDisplayMapping[booking.status] ||
                    booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                </Text>
              </div>
              <div className="flex justify-center mb-2">
                <button
                  className="w-40 h-7 rounded-full bg-red-500"
                  onClick={() => {
                    navigate('/bookingdetail');
                  }}
                >
                  <span className="text-base text-white">
                    Xem chi tiết đặt lịch
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceChoose />
    </Page>
  );
};

export default BookingPage;
