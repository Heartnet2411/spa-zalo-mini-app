import React, { Suspense, useState } from 'react';
import { Button, Page, Text, useNavigate, Input, Select } from 'zmp-ui';
import Header from '../components/header';
import { userState } from '../state';
import { useRecoilValue, useSetRecoilState } from 'recoil';
const BookingFormPage = () => {
  const setUserState = useSetRecoilState(userState);
  const { userInfo: user } = useRecoilValue(userState);

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-1xl mb-4 custom-font ">THÔNG TIN KHÁCH HÀNG</h1>
          <Text>Họ và tên</Text>
          <Input id="name" type="text" value={user.name} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mt-5">
          <h1 className="text-1xl mb-4 custom-font ">THÔNG TIN ĐẶT HẸN</h1>
          <Text>Ngày đặt lịch</Text>
          <Input></Input>
          <Text>Giờ đặt lịch</Text>
          <Input></Input>
        </div>
        <button className="mt-5 h-8 w-full rounded-full flex items-center justify-center bg-blue-500">
          <span className="ml-2 text-base text-white">Thêm dịch vụ</span>
        </button>
        <button className="mt-5 h-8 w-full rounded-full flex items-center justify-center bg-blue-500">
          <span className="ml-2 text-base text-white">Thêm sản phẩm</span>
        </button>
        <button className="mt-5 h-8 w-full rounded-full flex items-center justify-center bg-red-500">
          <span className="ml-2 text-base text-white">Đặt lịch</span>
        </button>
      </div>
    </Page>
  );
};

export default BookingFormPage;
