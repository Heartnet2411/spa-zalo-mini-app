import React, { useEffect, useState } from 'react';
import {
  Page,
  Text,
  Button,
  Icon,
  useSnackbar,
  useNavigate,
  Modal,
} from 'zmp-ui';
import Header from '../components/header';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import {
  cancelBooking,
  getBookingDetailById,
} from '../services/booking.service';

const BookingDetailPage = () => {
  const { id } = useParams();
  const { userInfo: user, accessToken } = useRecoilValue(userState);
  const { openSnackbar, closeSnackbar } = useSnackbar();

  const [booking, setBooking] = useState(null);

  const navigate = useNavigate();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const statusDisplayMapping = {
    cancelled: 'Đã hủy lịch',
    completed: 'Đã thành công',
    pending: 'Chờ xác nhận',
    approved: 'Đã xác nhận',
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      openSnackbar({
        text: 'Loading...',
        type: 'loading',
        duration: 20000,
      });
      // console.log('Cancelling booking with ID:', bookingId);

      const result = await cancelBooking(bookingId, accessToken);

      if (result) {
        console.log('Booking cancelled successfully:', result);
        openSnackbar({
          text: 'Success',
          type: 'success',
        });
        navigate('/booking');
      } else {
        openSnackbar({
          text: 'Error',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      openSnackbar({
        text: 'Error',
        type: 'error',
      });
    }
  };

  // const confirmCancelBooking = (bookingId) => {
  //   setSelectedBookingId(bookingId);
  //   setDialogVisible(true);
  // };

  // const handleConfirm = () => {
  //   setDialogVisible(false);
  //   console.log('Selected Booking ID for cancellation:', selectedBookingId);
  //   if (selectedBookingId) {
  //     handleCancelBooking(selectedBookingId);
  //   }
  // };

  useEffect(() => {
    const fetchBooking = async () => {
      const response = await getBookingDetailById(id, accessToken);

      if (response) {
        setBooking(response);
      }
    };

    fetchBooking();
  }, [id]);

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <h1 className="text-xl mb-4 text-center custom-font">
          CHI TIẾT ĐẶT HẸN
        </h1>

        <div className=" rounded-lg mb-4">
          <div className="">
            <Text>
              <span className="font-bold">Mã đặt lịch : </span>
              {booking?._id}
            </Text>
          </div>
          <div className="mt-4">
            <Text>
              <span className="font-bold">Tên khách hàng : </span>
              {user?.name}
            </Text>
          </div>
          <div className="mt-4">
            <Text>
              <span className="font-bold">Thời gian : </span>
              {`${['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][new Date(booking?.date).getDay()]}, 
  ${new Date(booking?.date).getDate().toString().padStart(2, '0')}/${(new Date(booking?.date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(booking?.date).getFullYear()} - 
  ${new Date(booking?.date).getHours()}h${new Date(booking?.date).getMinutes().toString().padStart(2, '0')}`}
            </Text>
          </div>
          <div className="mt-4 flex items-center justify-start">
            <span className="font-bold">Trạng thái đặt lịch : </span>
            <Text
              className={`text-base ml-2 ${
                booking?.status === 'cancelled'
                  ? 'text-red-500'
                  : booking?.status === 'completed'
                    ? 'text-green-500'
                    : booking?.status === 'pending'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
              }`}
            >
              {statusDisplayMapping[booking?.status] ||
                booking?.status.charAt(0).toUpperCase() +
                  booking?.status.slice(1)}
            </Text>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl mb-4 text-blue-500 custom-font">
            Dịch vụ đặt trước
          </h2>
          <div className="border border-gray-500 rounded-lg p-4 mb-4">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-center">Tên dịch vụ</th>
                  <th className="px-4 py-2 text-center">Giá</th>
                </tr>
              </thead>
              <tbody>
                {booking?.services?.map((service) => (
                  <tr key={service._id}>
                    <td className="px-4 py-2">{service.serviceName}</td>
                    <td className="px-4 py-2">
                      {service.price.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl mb-4 text-blue-500 custom-font">
            Sản phẩm đặt mua
          </h2>
          <div className="border border-gray-500 rounded-lg p-4 mb-4">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-center">Tên sản phẩm</th>
                  <th className="px-4 py-2 text-center">Giá</th>
                </tr>
              </thead>
              <tbody>
                {booking?.products?.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-2">{product.productName}</td>
                    <td className="px-4 py-2">
                      {product.price.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl mb-4 text-blue-500 custom-font">Tổng đơn</h2>
          <div className="border border-gray-500 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-start gap-2">
              <span>{booking?.totalAmount?.toLocaleString()}đ</span>
              <span className="text-gray-500 italic">
                (Đã bao gồm thuế VAT)
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button
            className="border border-red-500 text-red rounded-full px-4 py-2"
            onClick={() => handleCancelBooking(booking._id)}
          >
            <span className="text-red-500 flex items-center justify-center gap-1">
              <Icon icon="zi-close" size={20} />
              Hủy lịch hẹn
            </span>
          </button>
        </div>

        {/* <Modal
          visible={dialogVisible}
          title="Xác nhận hủy đặt chỗ"
          onClose={() => setDialogVisible(false)} // Đóng modal nếu người dùng nhấn Hủy
          actions={[
            {
              text: 'Hủy',
              close: true, // Đóng modal
            },
            {
              text: 'Đồng ý',
              close: true, // Đóng modal khi người dùng nhấn đồng ý
              highLight: true,
              onClick: () => {
                handleConfirm(); // Gọi hàm hủy khi người dùng nhấn đồng ý
              },
            },
          ]}
          description="Bạn có chắc chắn muốn hủy đặt chỗ này không? Hành động này không thể hoàn tác."
        /> */}
      </div>
    </Page>
  );
};

export default BookingDetailPage;
