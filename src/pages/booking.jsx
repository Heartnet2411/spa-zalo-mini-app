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
    'Đã xác nhận': 'approved',
    'Đã thành công': 'completed',
    'Đã hủy lịch': 'cancelled',
  };

  const statusDisplayMapping = {
    cancelled: 'Đã hủy lịch',
    completed: 'Đã thành công',
    pending: 'Chờ xác nhận',
    approved: 'Đã xác nhận',
  };

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

  const handleViewDetail = (id) => {
    navigate(`/bookingdetail/${id}`);
  };

  return (
    <Page className="page">
      <Header />
      <div className="mt-16 mb-16">
        <div className="mt-16">
          <BookingTags
            selectedCategory={filterStatus}
            onSelectCategory={setFilterStatus}
          />
        </div>
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
        {filteredBookings.length === 0 ? (
          <div className="p-4">
            <div className="text-center">
              <Text className="text-lg font-bold">Chưa có lịch hẹn</Text>
            </div>
          </div>
        ) : (
          <div className="">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="border shadow-lg rounded-lg px-4 m-5"
              >
                <Text className="mt-2">
                  <span>
                    {booking?.status === 'cancelled' ? null : new Date(
                        booking.date
                      ) > new Date() ? (
                      <span>
                        {/* <Icon icon="zi-clock-1" size={18} /> */}
                        Chỉ còn{' '}
                        <span className="font-bold text-orange-500">
                          {(() => {
                            const now = new Date();
                            const bookingDate = new Date(booking.date);
                            const diff = bookingDate - now; // Chênh lệch tính bằng milliseconds

                            // Chuyển đổi milliseconds thành ngày, giờ, phút
                            const days = Math.floor(
                              diff / (1000 * 60 * 60 * 24)
                            );
                            const hours = Math.floor(
                              (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                            );
                            const minutes = Math.floor(
                              (diff % (1000 * 60 * 60)) / (1000 * 60)
                            );

                            return `${days} ngày, ${hours} tiếng ${minutes} phút`;
                          })()}
                        </span>{' '}
                        nữa là đến lịch hẹn
                      </span>
                    ) : (
                      <span className="font-bold text-red-500">
                        Đã quá hạn!
                      </span>
                    )}
                  </span>
                </Text>

                {/* <div className="items-center mt-4 mb-2 gap-1">
                  <span className="font-bold">Mã đặt lịch:</span>
                  <Text>{booking._id}</Text>
                </div> */}
                {/* <div className="flex justify-start items-center mt-4 mb-2 gap-1 -mr-2">
                  <Icon icon="zi-user-circle-solid" size={20} />
                  <span className="font-bold">Khách hàng :</span>
                  <Text className="ml-1">{user.name}</Text>
                </div> */}
                <div className="flex justify-start items-start my-4 gap-1 -mr-2">
                  {/* <Icon icon="zi-calendar-solid" size={20} /> */}
                  <span className="font-bold whitespace-nowrap">
                    Thời gian :
                  </span>
                  <Text className="ml-1">
                    {`${['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][new Date(booking.date).getDay()]}, 
  ${new Date(booking.date).getDate().toString().padStart(2, '0')}/${(new Date(booking.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(booking.date).getFullYear()} - `}

                    <span>
                      {`${new Date(booking.date).getHours()}h${new Date(booking.date).getMinutes().toString().padStart(2, '0')}`}
                    </span>
                  </Text>
                </div>
                <div className="flex justify-start items-start my-4 gap-1">
                  {/* <Icon icon="zi-note" size={20} /> */}
                  <span className="font-bold">Đã đặt :</span>
                  <span>{booking?.services?.length || 0}</span>
                  <span> dịch vụ - </span>
                  <span>{booking?.products?.length || 0}</span>
                  <span> sản phẩm</span>
                </div>
                <div className="flex justify-start items-center my-4 gap-1 -mr-2">
                  {/* <Icon icon="zi-info-circle-solid" size={20} /> */}
                  <span className="font-bold">Trạng thái :</span>
                  <div
                    className={`px-4 py-0.5 ml-1 rounded-md ${
                      booking?.status === 'cancelled'
                        ? 'bg-red-400'
                        : booking?.status === 'completed'
                          ? 'bg-green-400'
                          : booking?.status === 'pending'
                            ? 'bg-yellow-400'
                            : 'bg-blue-400'
                    }`}
                  >
                    <Text>
                      {statusDisplayMapping[booking?.status] ||
                        booking?.status.charAt(0).toUpperCase() +
                          booking?.status.slice(1)}
                    </Text>
                  </div>
                </div>
                <div className="flex justify-center mb-2 mt-3">
                  <button
                    className="px-3 py-2 border border-blue-500 rounded-md text-blue-500"
                    onClick={() => handleViewDetail(booking._id)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <ServiceChoose /> */}
    </Page>
  );
};

export default BookingPage;
