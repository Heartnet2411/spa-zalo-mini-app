import React from 'react';
import { Page, Text, Button, Icon } from 'zmp-ui';
import Header from '../components/header';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';

const BookingDetailPage = () => {
  const location = useLocation();
  const { booking } = location.state;
  const { userInfo: user, accessToken } = useRecoilValue(userState);

  const statusDisplayMapping = {
    cancelled: 'Đã hủy lịch',
    completed: 'Đã đặt lịch',
    pending: 'Chờ xác nhận',
    approve: 'Đã xác nhận',
  };

  return (
    // <Page className="page">
    //   <div className="p-4">
    //     <Text className="text-lg font-bold">Chi tiết đặt lịch</Text>
    //     <div className="mt-4">
    //       <Text>Mã đặt lịch: {booking._id}</Text>
    //     </div>
    //     <div className="mt-4">
    //       <Text>Tên khách hàng: {user.name}</Text>
    //     </div>
    //     <div className="mt-4">
    //       <Text>
    //         Thời gian đặt lịch: {new Date(booking.date).toLocaleString()}
    //       </Text>
    //     </div>
    //     <div className="mt-4">
    //       <Text>
    //         Trạng thái:{' '}
    //         {statusDisplayMapping[booking.status] ||
    //           booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
    //       </Text>
    //     </div>
    //   </div>
    // </Page>
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
          <div className="mt-4">
            <Text>
              Trạng thái:{' '}
              {statusDisplayMapping[booking.status] ||
                booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
            </Text>
          </div>
        </div>

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

        <div className="flex justify-center">
          <Button className="bg-red-500" >
            <Icon icon="zi-edit-delete-solid" className="text-white" />
            <span className="ml-2 text-base text-white">Hủy lịch hẹn</span>
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default BookingDetailPage;
