import React from 'react';
import { Page, Text, Button, Icon } from 'zmp-ui';
import Header from '../components/header';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import { cancelBooking } from '../services/booking.service';

const BookingDetailPage = () => {
  const location = useLocation();
  const { booking } = location.state;
  const { userInfo: user, accessToken } = useRecoilValue(userState);

  const statusDisplayMapping = {
    cancelled: 'Đã hủy lịch',
    completed: 'Đã thành công',
    pending: 'Chờ xác nhận',
    approved: 'Đã xác nhận',
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const result = await cancelBooking(bookingId, accessToken);
      console.log('Booking cancelled successfully:', result);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <h1 className="text-xl mb-4 text-center custom-font">
          CHI TIẾT ĐẶT HẸN
        </h1>

        <div className="border border-gray-500 rounded-lg p-4 mb-4">
          <div className="">
            <Text>Mã đặt lịch: {booking._id}</Text>
          </div>
          <div className="mt-4">
            <Text>Tên khách hàng: {user.name}</Text>
          </div>
          <div className="mt-4">
            <Text>
              Thời gian đặt lịch: {new Date(booking.date).toLocaleString()}
            </Text>
          </div>
        </div>
        <div className="p-4 mb-4 flex flex-row">
          {/* <div className="border border-gray-500 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold">Dịch vụ đặt trước</h2>
            {services.map((service) => (
              <Text key={service._id}>
                {service.name} - {service.price}đ
              </Text>
            ))}
          </div>

          <div className="border border-gray-500 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold">Sản phẩm đặt mua</h2>
            {products.map((product) => (
              <Text key={product._id}>
                {product.name} - {product.price}đ
              </Text>
            ))}
          </div>

          <div className="border border-gray-500 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold">Tổng đơn</h2>
            <Text>{calculateTotal()}đ</Text>
          </div> */}
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
              booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </div>

        <div className="flex justify-center">
          <button
            className="border border-red-500 w-40 h-7 rounded-full "
            onClick={() => handleCancelBooking(booking._id)}
          >
            <span className="ml-2 text-base text-red-500">Hủy lịch hẹn</span>
          </button>
        </div>
      </div>
    </Page>
  );
};

export default BookingDetailPage;
