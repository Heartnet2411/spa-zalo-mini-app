import React, { Suspense } from 'react';
import { Button, Page, Text, useNavigate } from 'zmp-ui';
import { FiPlus } from 'react-icons/fi';
import Header from '../components/header';
import ServiceChoose from '../components/service-choose';
const BookingPage = () => {
  const navigate = useNavigate();
  return (
    <Page className="page">
       <Header/>
      <div className="p-4 mb-14 mt-14 flex items-center justify-center">
        <div className="text-center">
          <Text className="text-lg font-bold">Chưa có lịch hẹn</Text>
        </div>
        {/* <Text className="text-lg mb-4">
          Thời gian đặt lịch: tháng 9 năm 2024
        </Text> */}
        {/* <div className="bg-white p-4 rounded-lg shadow-md">
          <Text className="text-base font-bold mb-1">Mã đặt lịch:</Text>
          <Text className="text-base mb-2">
            9647BB7A04204EA19EC788E2616BDB12
          </Text>

          <Text className="text-base font-bold mb-1">Khách hàng:</Text>
          <Text className="text-base mb-2">Lê Quang Trung</Text>

          <Text className="text-base font-bold mb-1">Thời gian đặt lịch:</Text>
          <Text className="text-base mb-2">09:45 - 23/09/2024</Text>

          <Text className="text-base font-bold mb-1">Trạng thái đặt lịch:</Text>
          <Text className="text-base text-red-500 mb-4">Đã huỷ</Text>

          <Button className="w-full">Xem chi tiết đặt lịch</Button>
        </div> */}
      </div>
      <div className="">
        <button
          className="mb-5 ml-auto w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
          onClick={() => {
            navigate('/bookingform');
          }}
        >
          <FiPlus size={20} />
        </button>
      </div>
      <ServiceChoose />
    </Page>
  );
};

export default BookingPage;
